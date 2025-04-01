package com.app.component;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

import javax.persistence.PostPersist;
import javax.persistence.PrePersist;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.context.support.SpringBeanAutowiringSupport;

import com.ElectraApplication;
import com.app.entity.ElDevice;
import com.app.entity.ElRouter;
import com.app.entity.ElSmsReceived;
import com.app.repository.ElDeviceRepository;
import com.app.repository.ElRouterRepository;
import com.app.service.TeltonikaSmsService;
import com.auth.entity.User;


@Component
public class DataBaseTriggers {

	@Autowired
	static TeltonikaSmsService teltonikaSmsService;
	
	@Autowired
	public void init(TeltonikaSmsService teltonikaSmsService) {
		DataBaseTriggers.teltonikaSmsService = teltonikaSmsService;
	}

	@Autowired
	static ElRouterRepository elRouterRepository;
	
	@Autowired
	public void init(ElRouterRepository elRouterRepository) {
		DataBaseTriggers.elRouterRepository = elRouterRepository;
	}
	
	@Autowired
	ElDeviceRepository elDeviceRepository;
	
	@PrePersist
	public void handleNewElSmsReceived(ElSmsReceived elSmsReceived) {

		try {
						
			String textMsg = elSmsReceived.getContent();
			
			String nameString = elSmsReceived.getElDevice().getDeviceName();
			
			String locatieString = elSmsReceived.getElDevice().getDeviceLocation();
			
			List<ElRouter> notificationRouter = elRouterRepository.findByCommunicationDeviceRouterFalse();

			List<User> users = elSmsReceived.getElDevice().getUsers().stream()
					.filter(User::isNotificationSms)
					.collect(Collectors.toList());;
					for (User user : users) {


						if(notificationRouter == null || notificationRouter.size() == 0) {
							ElectraApplication.logger.error("Nu exista router pentru transmitere notificari!");
						}

						if(notificationRouter.size() == 1) {
							teltonikaSmsService.sendSms("004" + user.getPhoneNumberString(), URLEncoder.encode("Nume device: " + nameString + "\n" + "Locatie: " + locatieString + "\n" + "\n" + textMsg, StandardCharsets.UTF_8.toString()), notificationRouter.get(0).getRouterIp());
						} else {

							Random random = new Random();
							int randomNumber = random.nextInt() % notificationRouter.size();

							teltonikaSmsService.sendSms("004" + user.getPhoneNumberString(), URLEncoder.encode("Nume device: " + nameString +"\n"+ "Locatie: " + locatieString + "\n" + "\n" + textMsg, StandardCharsets.UTF_8.toString()), notificationRouter.get(randomNumber).getRouterIp());
						}
					}
		} catch (Exception e) {
			ElectraApplication.logger.error(e.getMessage(),e);
		}


	}
}
