package com.auth.controller;

import java.io.IOException;
import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Component;

import com.app.entity.ElDescription;
import com.app.repository.ElDescriptionRepository;
import com.auth.config.DatabaseInit;
import com.auth.model.AccesToken;
import com.auth.model.AccesTokenDetails;
import com.auth.repository.OauthRefreshTokenRepository;
import com.auth.util.Utils;
import com.google.gson.Gson;

import okhttp3.MultipartBody;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

@Component
public class RoleVerification {

	@Autowired
	OauthRefreshTokenRepository refreshTokenRepository;

	@Autowired
	ElDescriptionRepository elDescriptionRepository;

	@Transactional
	public AccesToken checkToken(String _accesToken, String _refreshToken, int _port) throws IOException {

		AccesToken accesToken = new AccesToken();

		AccesTokenDetails accesTokenDetails = checkAccesToken(_accesToken, _port);

		accesToken.accesTokenDetails = accesTokenDetails;

		if(accesTokenDetails.responseCode != 200) {

			accesToken = checkRefreshToken(_refreshToken, _port);

			if(accesToken.accesTokenDetails != null) {
				accesToken.responseCode = accesToken.accesTokenDetails.responseCode;
				accesToken.errorMessage = accesToken.accesTokenDetails.errorMessage;
			} else {
				accesToken.responseCode = 401;
			}

		} else {
			accesToken.responseCode = 200;
			accesToken.access_token = _accesToken;
			accesToken.refresh_token = _refreshToken;
		}

		return accesToken;
	}

	@Transactional
	public AccesTokenDetails checkAccesToken(String token, int port) throws IOException {

		OkHttpClient client = UnsafeOkHttp.getUnsafeOkHttpClient();

		MultipartBody body = new MultipartBody.Builder().setType(MultipartBody.FORM)
				.addFormDataPart("_", "_")
				.build();

		String url = "https://localhost:" + port + "/oauth/check_token?token=" + token;

		ElDescription id = elDescriptionRepository.findById(1).orElseThrow(() -> new IllegalArgumentException("Can't find it."));
		String info1 = id.getInfo1();
		String info2 = id.getInfo2();

		Request request = new Request.Builder()
				.url(url)
				.method("POST", body)
				.addHeader("Content-Type", "application/json")
				//				.addHeader("Authorization", Utils.getBasicAuth(DatabaseInit.USER_APP, DatabaseInit.SECRET_APP))
				.addHeader("Authorization", Utils.getBasicAuth(info1, info2))

				.addHeader("Cookie", "JSESSIONID=DA82AD843CF7351F826BAC529EB59ED1")
				.build();
		Response response = client.newCall(request).execute();

		if(response.code() != 200) {
			AccesTokenDetails resp = new AccesTokenDetails();
			resp.responseCode = response.code();
			resp.errorMessage = response.body() != null ? response.body().string() : null;
			return resp;
		}

		Gson gson = new Gson();

		String strBody = response.body().string();

		AccesTokenDetails responseCheckToken = gson.fromJson(strBody, AccesTokenDetails.class);
		responseCheckToken.responseCode = 200;

		return responseCheckToken;
	}

	@Transactional
	public AccesToken checkRefreshToken(String refreshToken, int port) throws IOException {

		OkHttpClient client = UnsafeOkHttp.getUnsafeOkHttpClient();

		MultipartBody body = new MultipartBody.Builder().setType(MultipartBody.FORM)
				.addFormDataPart("grant_type", "refresh_token")
				.addFormDataPart("refresh_token", refreshToken)
				.build();

		ElDescription id = elDescriptionRepository.findById(1).orElseThrow(() -> new IllegalArgumentException("Can't find it."));
		
		String info1 = id.getInfo1();
		String info2 = id.getInfo2();

		Request request = new Request.Builder()
				.url("https://localhost:" + port + "/oauth/token")
				.method("POST", body)
				.addHeader("Content-Type", "application/json")
				.addHeader("Authorization", Utils.getBasicAuth(info1, info2))
				.addHeader("Cookie", "JSESSIONID=DA82AD843CF7351F826BAC529EB59ED1")
				.build();

		Response response = client.newCall(request).execute();

		if(response.code() != 200) {
			if(response.code() == 500) {
				AccesToken tokenResp = new AccesToken();
				tokenResp.responseCode = 500;
				tokenResp.errorMessage = "";
				return tokenResp;
			} else {
				AccesToken tokenResp = new AccesToken();
				tokenResp.responseCode = response.code();
				tokenResp.errorMessage = response.body() != null ? response.body().string() : null;
				return tokenResp;
			}
		}

		Gson gson = new Gson();

		AccesToken accesToken = gson.fromJson(response.body().string(), AccesToken.class);

		accesToken.accesTokenDetails = checkAccesToken(accesToken.access_token, port);

		if(accesToken.accesTokenDetails.responseCode != 200) {
			accesToken.responseCode = accesToken.accesTokenDetails.responseCode;
			accesToken.errorMessage = accesToken.accesTokenDetails.errorMessage;
		}

		return accesToken;
	}

	@Transactional
	public String checkUserRole(String access_token, String refresh_token,int port, String... roles) throws Exception {

		if(access_token == null && refresh_token == null) {
			throw new Exception("MISSING ACCES TOKEN OR REFRESH TOKEN!");
		}

		AccesToken accessToken = checkToken(access_token, refresh_token, port);

		if(accessToken.responseCode != 200) {
			throw new Exception(accessToken.errorMessage);
		}

		for(String role : roles) {

			if(accessToken.accesTokenDetails.authorities.get(0).equals(role)) {
				return role;
			}
		}

		throw new Exception("NU AI PERMISIUNEA!");
	}


	@Transactional
	public String information1() {

		ElDescription id = elDescriptionRepository.findById(1).orElseThrow(() -> new IllegalArgumentException("Can't find it."));

		return id.getInfo1();
	} 

	@Transactional
	public String information2() {

		ElDescription id = elDescriptionRepository.findById(1).orElseThrow(() -> new IllegalArgumentException("Can't find it."));

		return id.getInfo2();
	} 
}







