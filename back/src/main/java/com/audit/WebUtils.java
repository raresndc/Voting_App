package com.audit;

import javax.servlet.http.HttpServletRequest;

public class WebUtils {

    private static final String[] IP_HEADERS = {
            "X-Forwarded-For",
            "Proxy-Client-IP",
            "WL-Proxy-Client-IP",
            "HTTP_X_FORWARDED_FOR",
            "HTTP_X_FORWARDED",
            "HTTP_X_CLUSTER_CLIENT_IP",
            "HTTP_CLIENT_IP",
            "HTTP_FORWARDED_FOR",
            "HTTP_FORWARDED",
            "HTTP_VIA",
            "REMOTE_ADDR"
        };

        public static String getRequestIP(HttpServletRequest request) {
            for (String header: IP_HEADERS) {
                String value = request.getHeader(header);
                if (value == null || value.isEmpty()) {
                    continue;
                }
                String[] parts = value.split("\\s*,\\s*");
                return parts[0];
            }
            return request.getRemoteAddr();
        }
        
    	@SuppressWarnings("deprecation")
    	public static RequestDateRange validateDaterange(RequestDateRange req, boolean startDateSetted, boolean endDateSetted) throws Exception {
    		
    		if(req.start == null) {
    			throw new Exception("Starting daterange is NULL!");
    		}
    		
    		if(req.stop == null) {
    			throw new Exception("Stop daterange is NULL!");
    		}
    		
    		if((req.stop.getTime() - req.start.getTime()) < 0) {
    			throw new Exception("Stop time is before Start time!");
    		}
    		
    		if(!startDateSetted) {
        		req.start.setHours(0);
        		req.start.setMinutes(1);
        		req.start.setSeconds(0);
    		}

    		if(!endDateSetted) {
        		req.stop.setHours(23);
        		req.stop.setMinutes(59);
        		req.stop.setSeconds(59);
    		}

    		
    		return req;
    	}
	
}
