package com.documentsvc.service.util;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.time.temporal.ChronoField;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class MrzUtils {

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

    private static final DateTimeFormatter DOB_FORMAT =
            DateTimeFormatter.ofPattern("yyMMdd");

    public static String extractLastName(String line) {
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

    public static String tailChars(String text, int noOfChars) {
        if(text == null) {
            return "";
        } else {
            int len = text.length();
            return text.substring(Math.max(0, len-noOfChars));
        }
    }

    /**
     * Extracts birth date from the MRZ second line.
     * @param line2 the 36-char MRZ line 2
     * @return the parsed LocalDate of birth
     */
    public static LocalDate parseDobFromMrz2(String line2) {
        if (line2 == null || line2.length() < 29) {
            throw new IllegalArgumentException("MRZ line too short: " + line2);
        }
        // 1) yymmdd at positions 13–18 (0-based)
        String yymmdd = line2.substring(13, 19);
        int yy = Integer.parseInt(yymmdd.substring(0,2));
        int mm = Integer.parseInt(yymmdd.substring(2,4));
        int dd = Integer.parseInt(yymmdd.substring(4,6));

        // 2) century/sex indicator at pos29 (index 28)
        char c = line2.charAt(28);
        int century;
        switch (c) {
            case '1': case '2': century = 1900; break;
            case '3': case '4': century = 1800; break;
            case '5': case '6': century = 2000; break;
            default:
                throw new IllegalArgumentException("Unexpected century code “" + c + "” in MRZ: " + line2);
        }

        return LocalDate.of(century + yy, mm, dd);
    }
}
