package com.example.spring_authorization_with_metamask.model;

public class User {
    private final String address;
    private Integer nonce;

    public User(String address) {
        this.address = address;
        this.nonce = (int) (Math.random() * 1000000);
    }
    public String getAddress() {
        return address;
    }

    public Integer getNonce() {
        return nonce;
    }
}