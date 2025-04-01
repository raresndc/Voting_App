package com.auth.config;

import java.util.Collection;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.security.oauth2.common.OAuth2RefreshToken;
import org.springframework.security.oauth2.provider.ClientDetails;
import org.springframework.security.oauth2.provider.ClientDetailsService;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.TokenRequest;
import org.springframework.security.oauth2.provider.request.DefaultOAuth2RequestFactory;
import org.springframework.security.oauth2.provider.token.TokenStore;

public class CustomOauth2RequestFactory extends DefaultOAuth2RequestFactory {
	
	@Autowired
	private TokenStore tokenStore;
	
	@Autowired
	private UserDetailsService userDetailsService;

	public CustomOauth2RequestFactory(ClientDetailsService clientDetailsService) {
		super(clientDetailsService);
	}

	@Override
	public TokenRequest createTokenRequest(Map<String, String> requestParameters, ClientDetails authenticatedClient) {
		
		if (requestParameters.get("grant_type").equals("refresh_token")) {
			
			OAuth2RefreshToken refreshToken = tokenStore.readRefreshToken(requestParameters.get("refresh_token"));
			
			if(refreshToken != null) {
				OAuth2Authentication authentication = tokenStore.readAuthenticationForRefreshToken(refreshToken);
				
				SecurityContextHolder
					.getContext()
					.setAuthentication(new UsernamePasswordAuthenticationToken(authentication.getName(), null,userDetailsService.loadUserByUsername(authentication.getName()).getAuthorities()));
				
				Collection<OAuth2AccessToken> oldTokens = tokenStore.findTokensByClientIdAndUserName(authenticatedClient.getClientId(), authentication.getName());
				
				for(OAuth2AccessToken token : oldTokens) {
					tokenStore.removeAccessToken(token);
				}
			}
		} 			
		return super.createTokenRequest(requestParameters, authenticatedClient);	
	}
}


