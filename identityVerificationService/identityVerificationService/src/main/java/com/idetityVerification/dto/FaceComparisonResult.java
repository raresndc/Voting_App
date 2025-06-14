package com.idetityVerification.dto;

public class FaceComparisonResult {
    private String userId;
    private boolean match;
    private double confidence;
    private double threshold;

    public FaceComparisonResult(String userId, boolean match, double confidence, double threshold) {
        this.userId    = userId;
        this.match     = match;
        this.confidence= confidence;
        this.threshold = threshold;
    }

    public String getUserId()     { return userId; }
    public boolean isMatch()      { return match; }
    public double getConfidence() { return confidence; }
    public double getThreshold()  { return threshold; }

    public void setUserId(String userId)         { this.userId = userId; }
    public void setMatch(boolean match)          { this.match = match; }
    public void setConfidence(double confidence) { this.confidence = confidence; }
    public void setThreshold(double threshold)   { this.threshold = threshold; }
}
