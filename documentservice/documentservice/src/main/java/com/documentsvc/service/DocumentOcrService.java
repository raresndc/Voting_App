package com.documentsvc.service;

import com.documentsvc.model.Document;
import com.documentsvc.repository.DocumentRepository;
import com.documentsvc.service.util.RoiExtractor;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import net.sourceforge.tess4j.ITessAPI;
import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import net.sourceforge.tess4j.Word;
import org.opencv.core.Mat;
import org.opencv.core.Size;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DocumentOcrService {

    private final PhotoExtractionService photoSvc;
    private final DocumentRepository repo;

    @Value("${tesseract.datapath}")
    private String tessDataPath;

    private final Tesseract tess = new Tesseract();

    @PostConstruct
    public void initTess() {
        tess.setDatapath(tessDataPath);
        tess.setLanguage("eng+ron");
    }

    @Transactional
    public Document ingest(String username, MultipartFile upload) throws Exception {
        // 1) load & warp
        BufferedImage bi = photoSvc.loadAsBufferedImage(upload);
        Mat mat        = photoSvc.bufferedImageToMat(bi);
        Mat warped     = photoSvc.warpToCard(mat);

        // 2) get each ROI by label
        Map<String,Mat> allWordRois = RoiExtractor.extractAllWords(warped, tessDataPath);

        List<Word> wordObjs = tess.getWords(bi, ITessAPI.TessPageIteratorLevel.RIL_WORD);
        wordObjs.sort(Comparator
                .comparing((Word w) -> w.getBoundingBox().y)
                .thenComparing(w -> w.getBoundingBox().x)
        );
        List<String> words = wordObjs.stream()
                .map(Word::getText)
                .collect(Collectors.toList());

        // 4) Build & save your entity
        Document doc = Document.builder()
                .filename(upload.getOriginalFilename())
                .contentType(upload.getContentType())
                .data(upload.getBytes())
                // join with spaces, or store as JSON if you prefer
                .textContent(String.join(" ", words))
                .uploadedBy(username)
                .build();

        return repo.save(doc);
    }

    private String ocr(Mat roi) throws TesseractException {
        BufferedImage crop = RoiExtractor.matToBufferedImage(roi);
        return tess.doOCR(crop).trim().replaceAll("\\s+", " ");
    }

    public Document saveOcr(MultipartFile file, String ocrText, String username) throws IOException {
        Document doc = new Document();
        doc.setFilename(file.getOriginalFilename());
        doc.setContentType(file.getContentType());
        doc.setData(file.getBytes());
        doc.setTextContent(ocrText);
        doc.setUploadedBy(username);
        doc.setUploadedAt(LocalDateTime.now());
        return repo.save(doc);
    }
}