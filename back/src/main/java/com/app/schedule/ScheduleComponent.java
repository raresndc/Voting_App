package com.app.schedule;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import com.ElectraApplication;
import com.app.service.ElSmsReceivedService;

@Component
public class ScheduleComponent {


    @Autowired
    private ElSmsReceivedService elSmsMessageService;

    @Scheduled(fixedDelay = 10000, initialDelay = 2000)
    public void makeRequest() {
        try {
            elSmsMessageService.processMsg();
        } catch (Exception e) {
        	if(ElectraApplication.logger != null) {
        		ElectraApplication.logger.error("The error is: ", e);
        	}
       
        }
    }
}
