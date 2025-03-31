package com.app.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.app.controller.dao.CreateCommand;
import com.app.controller.dao.TemperatureInterval;
//import com.app.controller.dao.TemperatureInterval;
import com.app.entity.ElCmd;
import com.app.entity.ElDeviceType;
import com.app.repository.ElCmdRepository;
import com.app.repository.ElDeviceTypeRepository;
import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
public class ElCmdService {

	@Autowired
	ElCmdRepository elCmdRepository;


	@Autowired
	ElDeviceTypeRepository elDeviceTypeRepository;

	@Transactional
	public Page<ElCmd> getCmd(Pageable pageable){
		return elCmdRepository.findAll(pageable);

	}

	@Transactional
	public ElCmd getOne(int id){
		return elCmdRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Command not exist!"));
	}

	@Transactional
	public 	java.util.List<ElCmd> getAllElements() {
		return elCmdRepository.findAll();
	}


	@Transactional
	private void validateEntry(ElCmd entry) {
		if(entry.getCmdName() == null || entry.getCmdName().isEmpty() || 
				entry.getCmdSyntax() == null || entry.getCmdSyntax().isEmpty()) {
			throw new IllegalArgumentException("Unul sau mai multe câmpuri sunt nule sau goale! Va rugam sa inserati corect datele.");
		}
	}


	@Transactional
	public ElCmd insert(ElCmd entry) {

		validateEntry(entry);
		return elCmdRepository.saveAndFlush(entry);
	}

	@Transactional
	public void save(CreateCommand entry) {

		ElDeviceType device = elDeviceTypeRepository.findById(entry.idDevice).orElseThrow(() -> new EntityNotFoundException("Device not found"));

		entry.command.setElDevice(device);

		elCmdRepository.saveAndFlush(entry.command);
	}

	@Transactional
	public ElCmd updateCmd(ElCmd entity) {
		ElCmd cmd = elCmdRepository.findById(entity.getId()).orElseThrow(() -> new EntityNotFoundException("No cmd found"));

		cmd.setCmdName(entity.getCmdName());
		cmd.setCmdSyntax(entity.getCmdSyntax());

		return elCmdRepository.saveAndFlush(cmd);
	}

	@Transactional
	public String getSyntaxByCmdName(String cmdName) {
		ElCmd cmd = elCmdRepository.findByCmdName(cmdName);
		if(cmd == null) {
			return null;
		}
		return cmd.getCmdSyntax();
	}

	@Transactional
	public ElCmd getCmdById(int id) {
		return elCmdRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Comanda nu exista!"));

	}


	@Transactional
	public ElCmd deleteById(ElCmd entity) {
		ElCmd id = elCmdRepository.findById(entity.getId()).orElseThrow(() -> new EntityNotFoundException("Cmd not found"));

		elCmdRepository.delete(id);
		return id;
	}

	@Transactional
	public String getMessageSyntax(TemperatureInterval temperatureInterval, ElCmd dbCmd) throws UnsupportedEncodingException {

		if(dbCmd.getCmdName().equals("TEMP WARMING INTERVAL") ||
				dbCmd.getCmdName().equals("TEMP COOLING INTERVAL") || 
				dbCmd.getCmdName().equals("TEMP ALERT INTERVAL")) {
			String syntax = dbCmd.getCmdSyntax();
			syntax = syntax.replace("Tmin", temperatureInterval.tMin+"");
			syntax = syntax.replace("Tmax", temperatureInterval.tMax+"");
			return URLEncoder.encode(syntax, StandardCharsets.UTF_8.toString());
		}

		return URLEncoder.encode(dbCmd.getCmdSyntax(), StandardCharsets.UTF_8.toString());
	}

}



