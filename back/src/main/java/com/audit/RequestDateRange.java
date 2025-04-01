package com.audit;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

public class RequestDateRange {

	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
	public Date start;
	
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
	public Date stop;
	
	public String entityName;
	
}
