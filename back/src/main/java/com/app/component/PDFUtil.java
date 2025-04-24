//package com.app.component;
//
//import java.io.IOException;
//
//import org.apache.pdfbox.pdmodel.PDDocument;
//import org.apache.pdfbox.text.PDFTextStripper;
//
//import java.io.ByteArrayInputStream;
//import java.io.InputStream;
//
//public class PDFUtil {
//
//    public static String extractTextFromPDF(byte[] pdfBytes) throws IOException {
//        try (InputStream inputStream = new ByteArrayInputStream(pdfBytes)) {
//            PDDocument document = PDDocument.load(inputStream);
//            PDFTextStripper stripper = new PDFTextStripper();
//            String text = stripper.getText(document);
//            document.close();
//            return text;
//        }
//    }
//}
