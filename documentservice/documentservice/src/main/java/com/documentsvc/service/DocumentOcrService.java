package com.documentsvc.service;

import com.documentsvc.client.AuthUser;
import com.documentsvc.model.Document;
import com.documentsvc.repository.AuthUserRepository;
import com.documentsvc.repository.DocumentRepository;
import com.documentsvc.service.util.MrzUtils;
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
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.*;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class DocumentOcrService {

    private final PhotoExtractionService photoSvc;
    private final DocumentRepository repo;
    private final AuthUserRepository authUserRepo;

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

        Document doc = repo
                .findTopByUploadedByOrderByUploadedAtDesc(username)
                .orElseGet(Document::new);

        doc.setFilename(file.getOriginalFilename());
        doc.setContentType(file.getContentType());
        doc.setData(file.getBytes());
        doc.setTextContent(ocrText);
        doc.setUploadedBy(username);
        doc.setUploadedAt(LocalDateTime.now());

        String IDtext = MrzUtils.tailChars(ocrText, 74);

        doc.setNationality(IDtext.substring(2, 5));
        doc.setLastName(MrzUtils.extractLastName(IDtext));
        doc.setFirstName(MrzUtils.extractFirstName(IDtext));
        doc.setSeries(IDtext.substring(37, 45));
        doc.setSex(IDtext.substring(57, 58));
//        if(IDtext.substring(57, 58).equals("M")) {
//            doc.setSex("Male");
//        } else {
//            doc.setSex("Female");
//        }

        //dob
        String[] lines = IDtext.split("\\R", 2);
        if (lines.length < 2) {
            throw new IllegalArgumentException("MRZ must be two lines");
        }
        String line2 = lines[1];
        LocalDate dob = MrzUtils.parseDobFromMrz2(line2);
        doc.setDateOfBirth(LocalDate.from(dob.atStartOfDay()));
        doc.setAge(Period.between(dob, LocalDate.now()).getYears());

        //valid
        String dateText = MrzUtils.tailChars(ocrText, 94);
        LocalDate[] dates = MrzUtils.extractDates(dateText);
        LocalDate issueDate = dates[0];
        LocalDate expiryDate = dates[1];

        doc.setIssueDate(issueDate.atStartOfDay());
        doc.setExpiryDate(expiryDate.atStartOfDay());

        int age = Period.between(dob, LocalDate.now()).getYears();
        if(expiryDate.atStartOfDay().isAfter(LocalDateTime.now())
                && issueDate.atStartOfDay().isBefore(LocalDateTime.now()) && age >= 18) {
            doc.setValid(true);
        } else {
            doc.setValid(false);
        }

        //match info with auth
        doc.setVerifiedInfo(false);

        AuthUser user = authUserRepo.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("No such user: " + username));

        boolean matches =
                user.getAge() == doc.getAge()
                && Objects.equals(user.getCitizenship(), doc.getNationality())
//                && user.getDateOfBirth() == doc.getDateOfBirth()
                && Objects.equals(user.getGender(), doc.getSex())
                && Objects.equals(user.getLastName(), doc.getLastName())
                && Objects.equals(user.getFirstName(), doc.getFirstName())
                && Objects.equals(user.getIdSeries(), doc.getSeries());
        doc.setVerifiedInfo(matches);

        return repo.save(doc);
    }


}