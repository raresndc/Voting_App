package com.documentsvc.service;

import nu.pattern.OpenCV;
import org.apache.pdfbox.cos.COSName;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDResources;
import org.apache.pdfbox.pdmodel.graphics.PDXObject;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.opencv.core.*;
import org.opencv.imgcodecs.Imgcodecs;
import org.opencv.imgproc.Imgproc;
import org.opencv.objdetect.CascadeClassifier;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.awt.image.DataBufferByte;
import java.io.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;

@Service
public class PhotoExtractionService {

    private final CascadeClassifier faceDetector;

    public PhotoExtractionService() throws IOException {
        // unpack & load the native bits
        OpenCV.loadLocally();

        // grab the XML off the classpath
        ClassPathResource res = new ClassPathResource("haarcascade_frontalface_alt.xml");
        File tmp = File.createTempFile("haarcascade_", ".xml");
        try (InputStream in = res.getInputStream();
             OutputStream out = new FileOutputStream(tmp)) {
            in.transferTo(out);
        }

        // now load it from disk
        faceDetector = new CascadeClassifier(tmp.getAbsolutePath());
        if (faceDetector.empty()) {
            throw new IllegalStateException("Failed to load cascade from " + tmp.getAbsolutePath());
        }
    }

    public byte[] extractPhoto(MultipartFile upload) throws IOException {
        BufferedImage source = null;

        if ("application/pdf".equals(upload.getContentType())) {
            // pull first image from PDF
            try (PDDocument doc = PDDocument.load(upload.getBytes())) {
                PDPage page = doc.getPage(0);
                PDResources res = page.getResources();
                for (COSName name : res.getXObjectNames()) {
                    PDXObject xobj = res.getXObject(name);
                    if (xobj instanceof PDImageXObject) {
                        source = ((PDImageXObject) xobj).getImage();
                        break;
                    }
                }
            }
        } else {
            source = ImageIO.read(upload.getInputStream());
        }

        if (source == null) {
            throw new IOException("No image found in upload");
        }

        // face‐detect & crop
        Mat mat = bufferedImageToMat(source);
        MatOfRect faceDetections = new MatOfRect();
// the simplest overload; you can also pass scaleFactor, minNeighbors, flags, minSize, maxSize
        faceDetector.detectMultiScale(
                mat,               // input image
                faceDetections,    // output detections
                1.1,               // scaleFactor
                3,                 // minNeighbors
                0,                 // flags
                new Size(30, 30),  // min face size
                new Size()         // max face size (empty = no limit)
        );

        Rect[] faces = faceDetections.toArray();
        if (faces.length > 0) {
            Rect r = faces[0];
            // clamp bounds just in case
            int x = Math.max(0, r.x), y = Math.max(0, r.y);
            int w = Math.min(source.getWidth() - x, r.width),
                    h = Math.min(source.getHeight() - y, r.height);
            BufferedImage faceImg = source.getSubimage(x, y, w, h);
            return bufferedImageToPngBytes(faceImg);
        }

        // fallback: return the full original image
        return bufferedImageToPngBytes(source);
    }

    public Mat bufferedImageToMat(BufferedImage bi) {
        // ensure TYPE_3BYTE_BGR
        BufferedImage converted = new BufferedImage(
                bi.getWidth(), bi.getHeight(),
                BufferedImage.TYPE_3BYTE_BGR
        );
        Graphics2D g = converted.createGraphics();
        g.drawImage(bi, 0, 0, null);
        g.dispose();

        byte[] pixels = ((DataBufferByte) converted.getRaster()
                .getDataBuffer())
                .getData();
        Mat mat = new Mat(converted.getHeight(), converted.getWidth(), CvType.CV_8UC3);
        mat.put(0, 0, pixels);
        return mat;
    }

    private byte[] bufferedImageToPngBytes(BufferedImage img) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(img, "png", baos);
        return baos.toByteArray();
    }

    public BufferedImage loadAsBufferedImage(MultipartFile upload) throws IOException {
        BufferedImage source = null;

        if ("application/pdf".equals(upload.getContentType())) {
            try (PDDocument doc = PDDocument.load(upload.getBytes())) {
                PDPage page = doc.getPage(0);
                PDResources res = page.getResources();
                for (COSName name : res.getXObjectNames()) {
                    PDXObject xobj = res.getXObject(name);
                    if (xobj instanceof PDImageXObject) {
                        source = ((PDImageXObject) xobj).getImage();
                        break;
                    }
                }
            }
        } else {
            source = ImageIO.read(upload.getInputStream());
        }

        if (source == null) {
            throw new IOException("No image found in upload");
        }
        return source;
    }

    /**
     * Detects the four corners of the card and warps it to a flat 800×520 output.
     */
    public Mat warpToCard(Mat src) {
        // 1) gray + blur + edge
        Mat gray = new Mat();
        Imgproc.cvtColor(src, gray, Imgproc.COLOR_BGR2GRAY);
        Imgproc.GaussianBlur(gray, gray, new Size(5,5), 0);
        Mat edges = new Mat();
        Imgproc.Canny(gray, edges, 75, 200);

        // 2) find contours
        List<MatOfPoint> contours = new ArrayList<>();
        Imgproc.findContours(edges, contours, new Mat(), Imgproc.RETR_LIST, Imgproc.CHAIN_APPROX_SIMPLE);
        contours.sort((c1,c2) -> Double.compare(Imgproc.contourArea(c2), Imgproc.contourArea(c1)));

        // 3) look for 4-point polygon
        MatOfPoint2f approx = new MatOfPoint2f(), largest = null;
        for (MatOfPoint c : contours) {
            MatOfPoint2f c2f = new MatOfPoint2f(c.toArray());
            double peri = Imgproc.arcLength(c2f, true);
            Imgproc.approxPolyDP(c2f, approx, 0.02 * peri, true);
            if (approx.total() == 4) { largest = approx; break; }
        }
        if (largest == null) return src;

        // 4) order points
        Point[] pts = largest.toArray();
        Arrays.sort(pts, Comparator.comparingDouble(p -> p.x + p.y));
        Point tl = pts[0], br = pts[3];
        Arrays.sort(pts, Comparator.comparingDouble(p -> p.y - p.x));
        Point tr = pts[0], bl = pts[3];

        MatOfPoint2f srcPts = new MatOfPoint2f(tl, tr, br, bl);
        MatOfPoint2f dstPts = new MatOfPoint2f(
                new Point(0,0),
                new Point(800,0),
                new Point(800,520),
                new Point(0,520)
        );

        // 5) warp
        Mat M = Imgproc.getPerspectiveTransform(srcPts, dstPts);
        Mat warped = new Mat();
        Imgproc.warpPerspective(src, warped, M, new Size(800, 520));
        return warped;
    }
}
