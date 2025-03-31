package com.app.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@CrossOrigin(origins = "${web.client.domain}", allowCredentials = "true", maxAge = 360000)
@Controller
public class ViewController {

	@GetMapping({"/v1/**", "/dashboard/**", "/sign-in"})
	public String index() {
		return "forward:/index.html";
	}
	
}