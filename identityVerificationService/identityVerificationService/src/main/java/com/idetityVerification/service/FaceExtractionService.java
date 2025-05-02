package com.idetityVerification.service;

import org.bytedeco.opencv.opencv_core.Mat;
import org.bytedeco.opencv.opencv_core.Rect;
import org.bytedeco.opencv.opencv_core.RectVector;
import org.bytedeco.opencv.global.opencv_imgcodecs;
import org.bytedeco.javacpp.BytePointer;
import org.bytedeco.opencv.opencv_objdetect.CascadeClassifier;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class FaceExtractionService {

    private final CascadeClassifier detector;

    public FaceExtractionService(CascadeClassifier detector) {
        this.detector = detector;
    }

    // renamed to match your controller
    public byte[] extractFace(MultipartFile file) throws IOException {
        // 1) decode into a Mat
        Mat image = opencv_imgcodecs.imdecode(
                new Mat(file.getBytes()),
                opencv_imgcodecs.IMREAD_COLOR
        );

        // 2) detect faces into a RectVector
        RectVector faces = new RectVector();
        detector.detectMultiScale(image, faces);

        if (faces.size() == 0) {
            throw new IllegalArgumentException("No face detected");
        }

        // 3) pick the largest face
        Rect best = faces.get(0);
        long bestArea = best.width() * best.height();
        for (int i = 1; i < faces.size(); i++) {
            Rect r = faces.get(i);
            long area = (long) r.width() * r.height();
            if (area > bestArea) {
                best = r;
                bestArea = area;
            }
        }

        // 4) crop & encode to PNG
        Mat crop = new Mat(image, best);
        BytePointer buf = new BytePointer();
        opencv_imgcodecs.imencode(".png", crop, buf);

        byte[] out = new byte[(int) buf.limit()];
        buf.get(out);
        return out;
    }
}
