package com.app.service;

import org.springframework.stereotype.Service;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Value;

@Service
public class TeltonikaSmsService {

	@Value("${elsms.username}")
	private String username;

	@Value("${elsms.password}")
	private String password;

	private final OkHttpClient httpClient = new OkHttpClient();

	@Transactional
	public void sendSms(String phoneNumber, String message, String routerIp) throws Exception {


		String url = "http://" + routerIp + "/cgi-bin/sms_send" + "?username=" + username + "&password=" + password
				+ "&number=" + phoneNumber + "&text=" + message;

		System.out.println("url is = " + "  " + url);
		Request request = new Request.Builder().url(url).build();
		Response response = httpClient.newCall(request).execute();
		response.body().close();

		if(response.code() == 200 && response.message().equals("OK"))
			return;

		throw new Exception("Mesajul nu a putut fi transmis!");
	}

}

