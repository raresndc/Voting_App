package com.auth.dto;

public class ChallengeRequest {
    private String blinded;

    public ChallengeRequest() { }

    public ChallengeRequest(String blinded) {
        this.blinded = blinded;
    }

    public String getBlinded() {
        return blinded;
    }

    public void setBlinded(String blinded) {
        this.blinded = blinded;
    }
}
