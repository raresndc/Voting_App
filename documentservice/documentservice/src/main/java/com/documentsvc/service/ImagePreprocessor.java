// src/main/java/com/documentsvc/service/ImagePreprocessor.java
package com.documentsvc.service;

import org.opencv.core.Mat;
import org.opencv.core.Size;
import org.opencv.imgproc.Imgproc;

public class ImagePreprocessor {

    /**
     * Prepares an ROI for OCR by:
     * 1) Converting to grayscale
     * 2) Applying Otsu’s binary threshold
     * 3) Morphological opening to remove noise
     * 4) Upsampling by 2× to make small text ~30px high
     */
    public static Mat preprocessForOcr(Mat roi) {
        // 1) Gray
        Mat gray = new Mat();
        Imgproc.cvtColor(roi, gray, Imgproc.COLOR_BGR2GRAY);

        // 2) Bin
        Mat bin = new Mat();
        Imgproc.threshold(
                gray,
                bin,
                0,
                255,
                Imgproc.THRESH_BINARY | Imgproc.THRESH_OTSU
        );

        // 3) Morphological open
        Mat kernel = Imgproc.getStructuringElement(
                Imgproc.MORPH_RECT,
                new Size(3, 3)
        );
        Imgproc.morphologyEx(bin, bin, Imgproc.MORPH_OPEN, kernel);

        // 4) Upsample
        Mat up = new Mat();
        Imgproc.resize(
                bin,
                up,
                new Size(bin.width() * 2, bin.height() * 2),
                0, 0,
                Imgproc.INTER_CUBIC
        );

        return up;
    }
}
