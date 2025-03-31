package com.audit;

import org.springframework.data.domain.Pageable;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.List;
import javax.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

@Service
public class AuditService {

	@Autowired
	private AuditRepository appLogsRepository;
	
	@Transactional
	public void createLogSucces(String acces,
			String event,
			String eventContent,
			String entity,
			String entityIdentifier,
			String username,
			String clientIp) {
		
		Audit log = new Audit();
		
		log.setAcces(acces);
		log.setEvent(event);
		log.setEventContent(eventContent);
		log.setEntity(entity);
		log.setEntityIdentifier(entityIdentifier);
		log.setUsername(username);
		log.setIp(clientIp);
		
//        Date date = new Date();  
//        Timestamp ts= new Timestamp(date.getTime());  
//        String tString = new SimpleDateFormat("MM-dd-yyyy hh:mm:ss").format(ts);
//        
//		log.setDate(ts);
		
		ZoneId bucharestZone = ZoneId.of("Europe/Bucharest");
		ZonedDateTime bucharestTime = ZonedDateTime.of(LocalDateTime.now(), bucharestZone);
//		Timestamp ts = Timestamp.valueOf(bucharestTime.toLocalDateTime());
		
		Timestamp ts = Timestamp.valueOf(LocalDateTime.now(ZoneId.of("UTC+3")));
		log.setDate(ts);

		appLogsRepository.saveAndFlush(log);
	} 
	
	@Transactional
	public List<Audit> getAudit(RequestDateRange req) {
		return appLogsRepository.findAll(req.start, req.stop, req.entityName);
	}

	@Transactional
	public Page<Audit> getAuditPaginated(RequestDateRange req, Pageable page) {
		return appLogsRepository.findAllPaginated(req.start, req.stop, req.entityName, page);
	}

}











