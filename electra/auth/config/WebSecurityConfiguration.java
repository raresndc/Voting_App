package com.auth.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.header.writers.StaticHeadersWriter;

import javax.servlet.http.HttpServletResponse;

@Configuration
public class WebSecurityConfiguration extends WebSecurityConfigurerAdapter {

	@Autowired
	private UserDetailsService userDetailsService;

	@Bean
	public PasswordEncoder passwordEncoder() {
		return PasswordEncoderFactories.createDelegatingPasswordEncoder();
	}

	@Bean
	@Override
	public AuthenticationManager authenticationManagerBean() throws Exception {
		return super.authenticationManagerBean();
	}

	@Override
	public void configure(HttpSecurity http) throws Exception {
		
		http.csrf().disable().exceptionHandling()
				.authenticationEntryPoint(
						(request, response, authException) -> response.sendError(HttpServletResponse.SC_UNAUTHORIZED))
				.and().authorizeRequests().antMatchers("/login").permitAll()
				.and().authorizeRequests().antMatchers("/genPwd").permitAll()
				.and().authorizeRequests().antMatchers("/changePassword").permitAll()
				.and().authorizeRequests().antMatchers("/createUser").permitAll()
				.and().authorizeRequests().antMatchers("/getAllUsers").permitAll()
				.and().authorizeRequests().antMatchers("/deleteUser").permitAll()
				.and().authorizeRequests().antMatchers("/tokens/revoke").permitAll()
				.and().authorizeRequests().antMatchers("/getAllRoles").permitAll()
				.and().authorizeRequests().antMatchers("/createRole").permitAll()
				.and().authorizeRequests().antMatchers("/createUserByRole").permitAll()
				.and().authorizeRequests().antMatchers("/getAllPermissions").permitAll()
				.and().authorizeRequests().antMatchers("/getAllUsersWithRoles").permitAll()
				.and().authorizeRequests().antMatchers("/**").permitAll();
		
		http.headers().addHeaderWriter(new StaticHeadersWriter("X-Content-Security-Policy","script-src 'self'"));
	}

	@Override
	public void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth.userDetailsService(userDetailsService);//.passwordEncoder(passwordEncoder());
	}
	
}