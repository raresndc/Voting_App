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
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.time.temporal.ChronoField;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DocumentOcrService {

    private final PhotoExtractionService photoSvc;
    private final DocumentRepository repo;

    private static final Pattern DATE_RANGE = Pattern.compile(
            // issue can be either 2 or 4 year‐digits:
            "(\\d{2}\\.\\d{2}\\.(?:\\d{2}|\\d{4}))" +
                    "-" +
                    // expiry **only** 4‐digit year
                    "(\\d{2}\\.\\d{2}\\.\\d{4})"
    );
    // for parsing 2-digit years as 2000–2099
    private static final DateTimeFormatter TWO_DIGIT_YEAR = new DateTimeFormatterBuilder()
            .appendPattern("dd.MM.")
            .appendValueReduced(ChronoField.YEAR, 2, 2, 2000)
            .toFormatter();

    // for parsing full 4-digit years
    private static final DateTimeFormatter FOUR_DIGIT_YEAR =
            DateTimeFormatter.ofPattern("dd.MM.yyyy");

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

        String IDtext = tailChars(ocrText, 74);

        doc.setNationality(IDtext.substring(2, 5));
        doc.setLastName(extractLastName(IDtext));
        doc.setFirstName(extractFirstName(IDtext));
        doc.setSeries(IDtext.substring(37, 45));
        doc.setSex(IDtext.substring(57, 58));

        //valid
        String dateText = tailChars(ocrText, 94);
        LocalDate[] dates = extractDates(dateText);
        LocalDate issueDate = dates[0];
        LocalDate expiryDate = dates[1];

        doc.setIssueDate(issueDate.atStartOfDay());
        doc.setExpiryDate(expiryDate.atStartOfDay());

        if(expiryDate.atStartOfDay().isAfter(LocalDateTime.now())
                && issueDate.atStartOfDay().isBefore(LocalDateTime.now())) {
            doc.setValid(true);
        } else {
            doc.setValid(false);
        }

        return repo.save(doc);
    }

    public String extractLastName(String line) {
        int start = 5;
        int end = line.indexOf("<");
        if(end < 0) {
            end = line.length();
        }
        return line.substring(start, end);
    }

    public static String extractFirstName(String fullLine) {
        if (fullLine == null) return "";

        // 0) MRZ lines are always exactly 36 chars long
        String mrz = fullLine.length() > 36
                ? fullLine.substring(0, 36)
                : fullLine;

        // 1) Drop everything up through the first double-chevron
        int sep = mrz.indexOf("<<");
        if (sep < 0 || sep + 2 >= mrz.length()) return "";
        String tail = mrz.substring(sep + 2);

        // 2) Remove all trailing '<' filler
        tail = tail.replaceFirst("<+$", "");

        // 3) Turn any remaining '<' into spaces
        tail = tail.replace('<', ' ');

        // 4) (Optional) turn hyphens into spaces, collapse whitespace, trim
        tail = tail.replace('-', ' ')
                .replaceAll("\\s+", " ")
                .trim();

        return tail;
    }

    public static LocalDate[] extractDates(String fullText) {
        String firstLine = fullText.split("\\R", 2)[0];

        Matcher m = DATE_RANGE.matcher(firstLine);
        if (!m.find()) {
            throw new IllegalArgumentException("No date‐range found in:\n" + firstLine);
        }

        String start = m.group(1);
        String end   = m.group(2);

        LocalDate issue  = parseDate(start, TWO_DIGIT_YEAR);
        LocalDate expiry = parseDate(end, FOUR_DIGIT_YEAR);
        return new LocalDate[]{ issue, expiry };
    }

    private static LocalDate parseDate(String s, DateTimeFormatter formatter) {
        // choose formatter by length of year
        return LocalDate.parse(s, formatter);
    }

    public String tailChars(String text, int noOfChars) {
        if(text == null) {
            return "";
        } else {
            int len = text.length();
            return text.substring(Math.max(0, len-noOfChars));
        }
    }
}