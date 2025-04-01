package com.app.service;

import java.io.IOException;
import java.net.InetAddress;

import org.springframework.stereotype.Service;

@Service
public class PingService {

	public boolean isRouterReachable(String routerIp) {
        try {
            InetAddress inetAddress = InetAddress.getByName(routerIp);
            return inetAddress.isReachable(1000);
        } catch (IOException e) {
       
            return false;
        }
    }
}
