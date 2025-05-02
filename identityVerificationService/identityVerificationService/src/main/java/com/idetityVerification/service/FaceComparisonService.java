package com.idetityVerification.service;

import org.springframework.stereotype.Service;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Value;

import com.idetityVerification.service.FaceExtractionService;

import org.bytedeco.opencv.opencv_core.Mat;
import org.bytedeco.opencv.opencv_core.MatVector;
import org.bytedeco.opencv.opencv_core.Size;
import org.bytedeco.opencv.global.opencv_imgcodecs;
import org.bytedeco.opencv.global.opencv_imgproc;
import org.bytedeco.opencv.opencv_face.LBPHFaceRecognizer;
import org.bytedeco.opencv.global.opencv_core;
import org.bytedeco.javacpp.IntPointer;
import org.bytedeco.javacpp.DoublePointer;

import java.io.IOException;
import java.nio.IntBuffer;

@Service
public class FaceComparisonService {

    private final RedisTemplate<String, byte[]> redis;
    private final FaceExtractionService extractor;
    private final double defaultThreshold;

    public FaceComparisonService(
            RedisTemplate<String, byte[]> redis,
            FaceExtractionService extractor,
            @Value("${face.compare.threshold:50.0}") double defaultThreshold
    ) {
        this.redis = redis;
        this.extractor = extractor;
        this.defaultThreshold = defaultThreshold;
    }

    public boolean isSamePerson(String userId) throws IOException {
        return isSamePerson(userId, defaultThreshold);
    }

    public boolean isSamePerson(String userId, double threshold) throws IOException {
        byte[] idBytes   = redis.opsForValue().get("idPhoto:" + userId);
        byte[] liveBytes = redis.opsForValue().get("face:"    + userId);
        if (idBytes == null || liveBytes == null) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "One or both photos not found for user " + userId
            );
        }

        // 1) Crop face regions
        Mat idFace   = extractor.cropFaceMat(idBytes);
        Mat liveFace = extractor.cropFaceMat(liveBytes);

        // 2) Convert to grayscale
        Mat grayId   = new Mat(), grayLive = new Mat();
        opencv_imgproc.cvtColor(idFace,   grayId,   opencv_imgproc.COLOR_BGR2GRAY);
        opencv_imgproc.cvtColor(liveFace, grayLive, opencv_imgproc.COLOR_BGR2GRAY);

        // 3) Equalize histograms to normalize brightness/contrast
        opencv_imgproc.equalizeHist(grayId, grayId);
        opencv_imgproc.equalizeHist(grayLive, grayLive);

        // 4) Resize to fixed size
        Size size = new Size(200, 200);
        opencv_imgproc.resize(grayId,   grayId,   size);
        opencv_imgproc.resize(grayLive, grayLive, size);

        // 5) Prepare training data
        MatVector trainingImages = new MatVector(1);
        trainingImages.put(0, grayId);
        Mat labels = new Mat(1, 1, opencv_core.CV_32SC1);
        IntBuffer labelsBuf = labels.createBuffer();
        labelsBuf.put(0, 1);

        // 6) Train LBPH recognizer with explicit parameters
        LBPHFaceRecognizer recognizer = LBPHFaceRecognizer.create(
                1,    // radius
                8,    // neighbors
                8,    // grid_x
                8,    // grid_y
                threshold // use threshold here to set internal confidence threshold
        );
        recognizer.train(trainingImages, labels);

        // 7) Predict on the live face
        IntPointer predictedLabel = new IntPointer(1);
        DoublePointer confidence = new DoublePointer(1);
        recognizer.predict(grayLive, predictedLabel, confidence);

        int predicted = predictedLabel.get(0);
        double score = confidence.get(0);

        // 8) Return match if label correct and confidence below threshold
        return predicted == 1 && score < threshold;
    }
}
