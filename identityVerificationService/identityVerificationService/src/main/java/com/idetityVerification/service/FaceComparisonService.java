package com.idetityVerification.service;

import com.idetityVerification.dto.FaceComparisonResult;
import com.idetityVerification.model.User;
import com.idetityVerification.repository.UserRepository;
import org.bytedeco.javacpp.Loader;
import org.bytedeco.javacpp.BytePointer;
import org.bytedeco.javacpp.IntPointer;
import org.bytedeco.javacpp.DoublePointer;
import org.bytedeco.opencv.opencv_core.Mat;
import org.bytedeco.opencv.opencv_core.MatVector;
//import org.bytedeco.opencv.opencv_core.Size;
import org.bytedeco.opencv.opencv_face.LBPHFaceRecognizer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import static org.bytedeco.opencv.global.opencv_core.CV_8UC1;
import static org.bytedeco.opencv.global.opencv_core.CV_32SC1;
import static org.bytedeco.opencv.global.opencv_imgcodecs.IMREAD_GRAYSCALE;
import static org.bytedeco.opencv.global.opencv_imgcodecs.imdecode;
// <-- you need these two imports for preprocessing:
import static org.bytedeco.opencv.global.opencv_imgproc.resize;
import static org.bytedeco.opencv.global.opencv_imgproc.equalizeHist;
import org.bytedeco.opencv.opencv_core.Size;

import java.util.Optional;

@Service
public class FaceComparisonService {

    @Autowired
    private UserRepository userRepository;
    private final RedisTemplate<String, byte[]> redisTemplate;

    public FaceComparisonService(RedisTemplate<String, byte[]> redisTemplate) {
        this.redisTemplate = redisTemplate;
        Loader.load(org.bytedeco.opencv.presets.opencv_core.class);
    }

    public FaceComparisonResult compare(String userId, double threshold) {
        // 1) fetch PNG blobs
        byte[] idBytes   = redisTemplate.opsForValue().get("idPhoto:" + userId);
        byte[] faceBytes = redisTemplate.opsForValue().get("face:"    + userId);
        if (idBytes   == null || idBytes.length   == 0) throw new IllegalArgumentException("No ID photo for "   + userId);
        if (faceBytes == null || faceBytes.length == 0) throw new IllegalArgumentException("No selfie for " + userId);

        // 2) decode into grayscale Mats
        Mat idBuf    = new Mat(1, idBytes.length,   CV_8UC1, new BytePointer(idBytes));
        Mat idGray   = imdecode(idBuf,   IMREAD_GRAYSCALE);
        if (idGray.empty())  throw new IllegalStateException("Failed to decode ID for "    + userId);

        Mat faceBuf  = new Mat(1, faceBytes.length, CV_8UC1, new BytePointer(faceBytes));
        Mat faceGray = imdecode(faceBuf, IMREAD_GRAYSCALE);
        if (faceGray.empty()) throw new IllegalStateException("Failed to decode selfie for " + userId);

        // ────────────────────────────────────────────────
        // 3) **PREPROCESSING**: resize + equalize
        // ────────────────────────────────────────────────
        Size targetSize = new Size(200, 200);
        // make both images the same dimensions
        resize(idGray,   idGray,   targetSize);
        resize(faceGray, faceGray, targetSize);
        // even out contrast / reduce grain
        equalizeHist(idGray,   idGray);
        equalizeHist(faceGray, faceGray);

        // ────────────────────────────────────────────────
        // 4) prepare training set (just one image, label=1)
        // ────────────────────────────────────────────────
        MatVector images = new MatVector(1);
        images.put(0, idGray);
        IntPointer ptr = new IntPointer(1);
        ptr.put(0, 1);
        Mat labels = new Mat(1, 1, CV_32SC1, ptr);

        // 5) create & train LBPH
        LBPHFaceRecognizer recognizer = LBPHFaceRecognizer.create(1,8,8,8,Double.MAX_VALUE);
        recognizer.train(images, labels);

        // 6) predict
        IntPointer  pred = new IntPointer(1);
        DoublePointer conf= new DoublePointer(1);
        recognizer.predict(faceGray, pred, conf);

        int   label       = pred.get(0);
        double confidence = conf.get(0);

        System.out.println(
                String.format("Java LBPH → label=%d, confidence=%.2f", label, confidence)
        );

        boolean match     = (label == 1 && confidence < threshold);

        Long id = Long.valueOf(userId);
        Optional<User> opt = userRepository.findById(id);
        if (opt.isPresent()) {
            User user = opt.get();
            user.setIdentityVerification(match);
            userRepository.save(user);
        } else {
            throw new IllegalArgumentException("User not found: " + userId);
        }

        return new FaceComparisonResult(userId, match, confidence, threshold);
    }
}
