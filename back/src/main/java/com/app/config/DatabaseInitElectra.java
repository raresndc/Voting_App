package com.app.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;

import com.ElectraApplication;
import com.app.entity.ElCmd;
import com.app.entity.ElDeviceType;
import com.app.repository.ElCmdRepository;
import com.app.repository.ElDeviceTypeRepository;

import java.util.List;

import javax.annotation.PostConstruct;

@Configuration
public class DatabaseInitElectra {

	@Autowired
	ElDeviceTypeRepository elDeviceTypeRepository;

	@Autowired
	ElCmdRepository elCmdRepository;

	@PostConstruct
	public void initElectra() {

		try {

			if(elDeviceTypeRepository.findAll().size() == 0) {
				ElDeviceType deviceType = new ElDeviceType();
				deviceType.setDeviceTypeName("PSD");
				deviceType.setDeviceTypeDetails("Partidul Social Democrat");
				deviceType.setIdeologie("Conservatorism social\r\n"
						+ "Naționalism de stânga\r\n"
						+ "Populism de stânga");
				deviceType.setLider("Marcel Ciolacu");
				deviceType.setMembriiCamDdep("86");
				deviceType.setMembriiParlaEuro("11");
				deviceType.setMembriiSenat("36");
				deviceType.setPozitie("Centru-stânga");
				deviceType.setStatut("Coaliție");
				elDeviceTypeRepository.saveAndFlush(deviceType);
			}

			if(elCmdRepository.findAll().size() == 0) {

				ElDeviceType deviceType = elDeviceTypeRepository.findByDeviceTypeName("PSD").get(0);

				ElCmd powerOn = new ElCmd("POWER ON", "#01#0#");
				ElCmd powerOff = new ElCmd("POWER OFF", "#02#0#");
				ElCmd status = new ElCmd("STATUS", "#07#0#");
				ElCmd tempInfo = new ElCmd("TEMP INFO", "#35#0#");
				ElCmd tempWarminInterval = new ElCmd("TEMP WARMING INTERVAL", "#24#0#1#Tmin#Tmax#");
				ElCmd tempCoolingInterval = new ElCmd("TEMP COOLING INTERVAL", "#24#0#2#Tmin#Tmax#");
				ElCmd tempAlertOff = new ElCmd("TEMP ALERT OFF", "#21#0#0#");
				ElCmd tempControlOff = new ElCmd("TEMP WARMING/COOLING OFF", "#23#0#0#");
				ElCmd tempAlertInterval = new ElCmd("TEMP ALERT INTERVAL", "#22#0#Tmin#Tmax#");

				powerOn.setElDevice(deviceType);
				powerOff.setElDevice(deviceType);
				status.setElDevice(deviceType);
				tempInfo.setElDevice(deviceType);
				tempWarminInterval.setElDevice(deviceType);
				tempCoolingInterval.setElDevice(deviceType);
				tempAlertOff.setElDevice(deviceType);
				tempControlOff.setElDevice(deviceType);
				tempAlertInterval.setElDevice(deviceType);

				elCmdRepository.save(powerOn);
				elCmdRepository.save(powerOff);
				elCmdRepository.save(status);
				elCmdRepository.save(tempInfo);
				elCmdRepository.save(tempWarminInterval);
				elCmdRepository.save(tempCoolingInterval);
				elCmdRepository.save(tempAlertOff);
				elCmdRepository.save(tempControlOff);
				elCmdRepository.saveAndFlush(tempAlertInterval);
			}

		} catch (Exception e) {
			ElectraApplication.logger.error("Error init database! " + e.getMessage(), e);
		}
	}
}








