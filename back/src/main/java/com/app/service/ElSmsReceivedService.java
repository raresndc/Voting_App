package com.app.service;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.sql.Date;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.tomcat.util.ExceptionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.ElectraApplication;
import com.app.entity.ElDevice;
import com.app.entity.ElRouter;
import com.app.entity.ElSmsReceived;
import com.app.entity.ElSmsSend;
import com.app.repository.ElDeviceRepository;
import com.app.repository.ElRouterRepository;
import com.app.repository.ElSmsReceivedRepository;
import com.audit.AuditFormats;
import com.audit.AuditService;
import com.audit.WebUtils;
import com.auth.entity.User;
import com.auth.repository.UserRepository;

import javax.persistence.EntityNotFoundException;
import javax.persistence.PostPersist;
import javax.servlet.http.HttpServletRequest;
import javax.transaction.Transactional;

@Service
public class ElSmsReceivedService {

	@Value("${elsms.username}")
	private String username;

	@Value("${elsms.password}")
	private String password;

	@Autowired
	private ElRouterRepository elRouterRepository;

	@Autowired
	private ElSmsReceivedRepository elSmsReceivedRepository;
	@Autowired
	private ElDeviceRepository elDeviceRepository;

	@Autowired
	private TeltonikaSmsService teltonikaSmsService;

	@Transactional
	public List<String> importMessages() throws UnsupportedEncodingException {

		List<String> ssmallStrings = new ArrayList<>();

		List<ElRouter> routers = elRouterRepository.findByCommunicationDeviceRouter(true);
		for (ElRouter router : routers) {
			String url = "http://" + router.getRouterIp() + "/cgi-bin/sms_list?username=" + username + "&password=" + password;
			String baseUrl = "http://" + router.getRouterIp() + "/cgi-bin/sms_delete?username=" + username + "&password=" + password + "&number=%d";
			System.out.println("IMPORT URL IS:  " + url);
			System.out.println("DELETE URL IS:  " + baseUrl);

			RestTemplate restTemplate = new RestTemplate();
			HttpHeaders headers = new HttpHeaders();
			headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
			HttpEntity<String> entity = new HttpEntity<>("parameters", headers);
			ResponseEntity<String> response = null;
			try {
				response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
			} catch (Exception e) {
				ElectraApplication.logger.error("An error occurred: " + e);
				continue;
			}

			String responseBody = response.getBody();
			if (responseBody == null) {

				continue;
			}

			String[] split = responseBody.split("\\n------------------------------\\n");
			ssmallStrings.addAll(Arrays.asList(split));

			System.out.println("Response body: ");
			System.out.println(responseBody);

			for (String smallString : ssmallStrings) {
				String[] lines = smallString.split("\\n");
				int index = -1;
				for (String line : lines) {
					if (line.startsWith("Index: ")) {
						index = Integer.parseInt(line.substring("Index: ".length()));
						break;
					}
				}

				ElectraApplication.logger.info("Deleting messages one by one ...");

				if (index > 0) {
					String url2 = String.format(baseUrl, index);
					RestTemplate restTemplate1 = new RestTemplate();
					restTemplate1.getForObject(url2, String.class);
					System.out.println("Message with index " + index + " deleted.");
				}
			}
			ElectraApplication.logger.info("Clearing the array ... ");
		}

		return ssmallStrings;
	}


	@Transactional
	public List<ElSmsReceived> saveElSmsMessage(List<String> contentList) throws UnsupportedEncodingException {
		ElectraApplication.logger.info("Starting to save the messages ...");
		List<ElSmsReceived> savedMessages = new ArrayList<>();

		Date date = new Date(System.currentTimeMillis());  
		Timestamp importDate= new Timestamp(date.getTime());  

		for (String content : contentList) {
			ElSmsReceived contentElSmsMessage = new ElSmsReceived();
			String[] lines = content.split("\\n");

			StringBuilder extractedInfo = new StringBuilder();
			for (String line : lines) {
				if (line.startsWith("Date:")) {
					contentElSmsMessage.setMsgDate(line.substring("Date:".length()).trim());
				} else if (line.startsWith("Text:") || line.startsWith("Temp control:") || line.startsWith("Schedule control:") || line.startsWith("Delay control") ||
						line.startsWith("Temp alert") || line.startsWith("Range:")) {
					extractedInfo.append(line.replaceFirst("^Text:", "")).append("\n");
					contentElSmsMessage.setContent(extractedInfo.toString());
				} else if (line.startsWith("Status:")) {
					contentElSmsMessage.setStatusMsg(line.substring("Status:".length()).trim());
				} 

			}
			contentElSmsMessage.setImportDate(importDate);

			String sender = getSenderFromContent(content);
			System.out.println("sender " + sender);

			if (sender != null) {
				ElDevice device = elDeviceRepository.findByDevicePhone(sender);

				if(contentElSmsMessage.getContent().contains("Welcome! The password is")) {
					if(device.getElRouter() != null) {
						device.setMasterActivated(true);

						String msg = URLEncoder.encode("#06#" + device.getElRouter().getRouterPhone() + "#", StandardCharsets.UTF_8.toString());
						System.out.print("123: " + device.getElRouter().getRouterPhone());

						try {
							teltonikaSmsService.sendSms(device.getDeviceMsisdn(), msg, device.getMasterRouter().getRouterIp());
						} catch (Exception e) {
							ElectraApplication.logger.error(e.getMessage(), e);   
						}
					} else device.setMasterActivated(true);

					elDeviceRepository.saveAndFlush(device);
					
				}

				if(contentElSmsMessage.getContent().contains("User number") &&
						contentElSmsMessage.getContent().contains("- registered.")) {
					device.setUserActivated(true);
					elDeviceRepository.saveAndFlush(device);
				}
				
				if(contentElSmsMessage.getContent().contains("Mains power - LOST")) {
					device.setStatus("LOST");
					elDeviceRepository.saveAndFlush(device);
				}
				
				if(contentElSmsMessage.getContent().contains("Mains power - RESTORED")) {
					device.setStatus("ACTIVE");
					elDeviceRepository.saveAndFlush(device);
				}

				if(contentElSmsMessage.getContent().contains("User number") &&
						contentElSmsMessage.getContent().contains("- deleted")) {
					device.setUserActivated(false);
					device.setElRouter(null);
					elDeviceRepository.saveAndFlush(device);
				}

				if(contentElSmsMessage.getContent().contains("Reset to default settings - completed")) {
					device.setUserActivated(false);
					device.setMasterActivated(false);
					device.setElRouter(null);
					device.setMasterRouter(null);
					device = elDeviceRepository.saveAndFlush(device);
				}

				if (device != null) {
					ElDevice deviceId = elDeviceRepository.findById(device.getId()).orElse(null);

					if (deviceId != null) {
						contentElSmsMessage.setElDevice(deviceId);
					}

				}

			}



			savedMessages.add(elSmsReceivedRepository.save(contentElSmsMessage));
		}
		return savedMessages;
	}

	@Transactional
	private String getSenderFromContent(String content) {
		ElectraApplication.logger.info("Starting fetching the number from messages ...");
		String[] lines = content.split("\\n");
		for (String line : lines) {
			if (line.startsWith("Sender:")) {
				String sender = line.substring(8).trim();
				if (sender.startsWith("+")) {
					String[] senderArray = sender.split("\\+");
					String senderNumber = senderArray[1];
					return senderNumber;
				}
			}
		}
		return null;
	}

	@Transactional
	private String getPassFromContent(String content) {
		ElectraApplication.logger.info("Starting fetching the number from messages ...");
		String[] lines = content.split("\\n");
		for (String line : lines) {
			if (line.startsWith("Text: New password is")) {
				String pass = line.substring(20).trim();
				String password = pass.replaceAll("\\.$", "");
				String[] senderArray = password.split("\\ ");
				String senderPass = senderArray[1];
				return senderPass;

			}
		}
		return null;
	}

	@Transactional
	public 	List<ElSmsReceived> getAllElements() {
		return elSmsReceivedRepository.findAll();
	}

	@Transactional
	public void processMsg() throws UnsupportedEncodingException {

		List<String> ssmallStrings = importMessages();

		if(ssmallStrings.size() > 0) {
			saveElSmsMessage(ssmallStrings);

		}

	}

	@Transactional
	public Page<ElSmsReceived> getSmsMessage(Pageable pageable){
		return elSmsReceivedRepository.findAllByOrderByImportDateDesc(pageable);

	}

	@Transactional
	public Page<ElSmsReceived> listSmsReceivedByDevice(int id, Pageable pageable) throws Exception {		

		//TODO de verificat daca userul are acces la acest device
		return elSmsReceivedRepository.findAllReceivedMessagesByDevice(id, pageable);
	}

}
