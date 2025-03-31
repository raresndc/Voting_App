package com;


import java.util.Properties;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.EnableScheduling;

import org.springframework.web.client.RestTemplate;

import com.app.service.ElSmsReceivedService;
import org.springframework.mail.javamail.JavaMailSenderImpl;

@SpringBootApplication
@EnableScheduling
public class ElectraApplication {

	public static Logger logger = null;

	@Autowired
	ElSmsReceivedService elSmsMessageService;

	public static void main(String[] args) {
		SpringApplication.run(ElectraApplication.class, args);

		logger = LoggerFactory.getLogger(ElectraApplication.class);
		System.out.println("Compiling.....");
	}

	@Bean
	public RestTemplate restTemplate() {
		return new RestTemplate();
	}
	
//    @Bean
//    public JavaMailSender javaMailSender() {
//        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
//        // Replace these values with your actual mail server details
//        mailSender.setHost("smtp.mail.yahoo.com");
//        mailSender.setPort(465); // Adjust the port as needed
//        mailSender.setUsername("stefanutzstefanutz19@yahoo.com");
//        mailSender.setPassword("Tati1Mami1");
//
//        Properties properties = mailSender.getJavaMailProperties();
//        properties.put("mail.transport.protocol", "smtp");
//        properties.put("mail.smtp.auth", "true");
//        properties.put("mail.smtp.starttls.enable", "true");
//        properties.put("mail.debug", "true");
//
//        return mailSender;
//    }
    
    
    
    @Bean
    public JavaMailSender getJavaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost("smtp.gmail.com");
        mailSender.setPort(587);
        
        mailSender.setUsername("stef.ss96@gmail.com");
        mailSender.setPassword("mnqe hzgn djlr vuaa");
        
        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.debug", "true");
        
        return mailSender;
    }
    
    
}
