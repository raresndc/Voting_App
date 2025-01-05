package com.example.auth.service;

import com.twilio.Twilio;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class SMSSenderService {
    @Value("${twilio.account.sid}")
    String account_sid;

    @Value("${twilio.auth.token}")
    String auth_token;

    @Value("${twilio.phone.number}")
    String phone_number;

    @PostConstruct
    private void setup() {
//        log.info("ACCOUNT_SID: " + account_sid);
        Twilio.init(account_sid, auth_token);
    }

    public String sendOtp(String phoneNumber, String otp) {

        return "nothing done";
    }
}
