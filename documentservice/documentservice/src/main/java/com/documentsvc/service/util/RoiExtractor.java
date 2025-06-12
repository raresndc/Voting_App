// src/main/java/com/documentsvc/service/util/RoiExtractor.java
package com.documentsvc.service.util;

import com.documentsvc.service.ImagePreprocessor;
import lombok.extern.slf4j.Slf4j;
import org.opencv.core.*;
import org.opencv.imgproc.Imgproc;
import org.opencv.imgcodecs.Imgcodecs;
import net.sourceforge.tess4j.ITessAPI;
import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import net.sourceforge.tess4j.Word;

import javax.imageio.ImageIO;
import java.awt.Rectangle;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Slf4j
public class RoiExtractor {
    /**
     * All rectangles are defined as fractions of the full card width/height.
     */
    private static final Map<String, Rect2d> FIELD_MAP = Map.of(
            "Seria",      new Rect2d(0.15, 0.10, 0.50, 0.08),
            "Last name",    new Rect2d(0.35, 0.18, 0.50, 0.08),
            "First name",   new Rect2d(0.35, 0.27, 0.50, 0.08),
            "Nationality", new Rect2d(0.35, 0.36, 0.50, 0.08),
            "Sex",         new Rect2d(0.75, 0.36, 0.10, 0.08),
            "CNP",   new Rect2d(0.05, 0.45, 0.45, 0.08),
            "Address",     new Rect2d(0.35, 0.60, 0.50, 0.10),
            "Validity",    new Rect2d(0.55, 0.55, 0.40, 0.08)
    );

    public static Map<String, Mat> extractFields(Mat warpedCard, Size targetSize) {
        Mat resized = new Mat();
        Imgproc.resize(warpedCard, resized, targetSize);
        Map<String, Mat> rois = new LinkedHashMap<>();
        int W = (int) targetSize.width, H = (int) targetSize.height;

        for (var e : FIELD_MAP.entrySet()) {
            Rect2d rel = e.getValue();
            Rect abs = new Rect(
                    (int)(rel.x * W),
                    (int)(rel.y * H),
                    (int)(rel.width * W),
                    (int)(rel.height * H)
            );
            rois.put(e.getKey(), new Mat(resized, abs));
        }
        return rois;
    }

    /**
     * Convert an OpenCV Mat to a BufferedImage (for Tess4J).
     */
    public static BufferedImage matToBufferedImage(Mat mat) {
        MatOfByte mob = new MatOfByte();
        Imgcodecs.imencode(".png", mat, mob);
        try (ByteArrayInputStream in = new ByteArrayInputStream(mob.toArray())) {
            return ImageIO.read(in);
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }

    /**
     * (Optional) If you want to extract *all* words rather than fixed fields:
     */
    public static Map<String, Mat> extractAllWords(Mat warpedCard, String tessDataPath) {
        BufferedImage bi = matToBufferedImage(warpedCard);

        Tesseract tess = new Tesseract();
        tess.setDatapath(tessDataPath);
        tess.setLanguage("eng+ron");

        List<Word> words;
        words = tess.getWords(bi, ITessAPI.TessPageIteratorLevel.RIL_WORD);

        Map<String, Mat> rois = new LinkedHashMap<>();
        for (Word w : words) {
            Rectangle r = w.getBoundingBox();
            int x  = Math.max(0, r.x),
                    y  = Math.max(0, r.y),
                    w0 = Math.min(warpedCard.width()  - x, r.width),
                    h0 = Math.min(warpedCard.height() - y, r.height);
            if (w0 <= 0 || h0 <= 0) continue;
            Mat wordRoi = new Mat(warpedCard, new Rect(x, y, w0, h0));
            Mat pre     = ImagePreprocessor.preprocessForOcr(wordRoi);
            rois.put(w.getText(), pre);
        }
        return rois;
    }
}
