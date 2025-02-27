package com.auth.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "oauth_client_details")
public class OauthClientDetails {

	@Id
	@Column(name="CLIENT_ID")
	private String clientId;
	
	@Column(name="CLIENT_SECRET")
	private String clientSecret;
	
	@Column(name="RESOURCE_IDS")
	private String resouceIds;
	
	@Column(name="SCOPE")
	private String scope;
	
	@Column(name="AUTHORIZED_GRANT_TYPES")
	private String authorizedGrantType;
	
	@Column(name="WEB_SERVER_REDIRECT_URI")
	private String webServerRedirectUri;
	
	@Column(name="AUTHORITIES")
	private String authorities;
	
	@Column(name="ACCESS_TOKEN_VALIDITY")
	private int accesTokenValidity;
	
	@Column(name="REFRESH_TOKEN_VALIDITY")
	private int refreshTokenValidity;
	
	@Column(name="ADDITIONAL_INFORMATION")
	private String additionalInformation;
	
	@Column(name="AUTOAPPROVE")
	private String autoapprove;

	public String getClientId() {
		return clientId;
	}

	public void setClientId(String clientId) {
		this.clientId = clientId;
	}

	public String getClientSecret() {
		return clientSecret;
	}

	public void setClientSecret(String clientSecret) {
		this.clientSecret = clientSecret;
	}

	public String getResouceIds() {
		return resouceIds;
	}

	public void setResouceIds(String resouceIds) {
		this.resouceIds = resouceIds;
	}

	public String getScope() {
		return scope;
	}

	public void setScope(String scope) {
		this.scope = scope;
	}

	public String getAuthorizedGrantType() {
		return authorizedGrantType;
	}

	public void setAuthorizedGrantType(String authorizedGrantType) {
		this.authorizedGrantType = authorizedGrantType;
	}

	public String getWebServerRedirectUri() {
		return webServerRedirectUri;
	}

	public void setWebServerRedirectUri(String webServerRedirectUri) {
		this.webServerRedirectUri = webServerRedirectUri;
	}

	public String getAuthorities() {
		return authorities;
	}

	public void setAuthorities(String authorities) {
		this.authorities = authorities;
	}

	public int getAccesTokenValidity() {
		return accesTokenValidity;
	}

	public void setAccesTokenValidity(int accesTokenValidity) {
		this.accesTokenValidity = accesTokenValidity;
	}

	public int getRefreshTokenValidity() {
		return refreshTokenValidity;
	}

	public void setRefreshTokenValidity(int refreshTokenValidity) {
		this.refreshTokenValidity = refreshTokenValidity;
	}

	public String getAdditionalInformation() {
		return additionalInformation;
	}

	public void setAdditionalInformation(String additionalInformation) {
		this.additionalInformation = additionalInformation;
	}

	public String getAutoapprove() {
		return autoapprove;
	}

	public void setAutoapprove(String autoapprove) {
		this.autoapprove = autoapprove;
	}
}
