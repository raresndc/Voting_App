package com.app.component;

import java.net.InetAddress;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.app.entity.ElRouter;
import com.app.repository.ElRouterRepository;
import com.app.service.PingService;
import com.app.service.TeltonikaSmsService;
import com.auth.config.UsersRoles;
import com.auth.entity.User;
import com.auth.repository.UserRepository;

@Component
public class RouterPingScheduler {

//	 @Autowired
//	    private PingService pingService;
//	 
//	 @Autowired
//		TeltonikaSmsService teltonikaSmsService;
//
//	    @Autowired
//	    private ElRouterRepository routerRepository;
//
//	    @Scheduled(fixedDelay = 30000) 
//	    public void pingRouters() {
//	        List<ElRouter> routers = routerRepository.findAll();
//	        for (ElRouter router : routers) {
//	            boolean isReachable = pingService.isRouterReachable(router.getRouterIp());
//
//	            router.setStatus(isReachable ? "Reachable" : "Unreachable");
//	            
//	    		
//
//	            routerRepository.save(router);
//	        }
//	    }
	
	
	
	// goooood ---------------------------------------------------------------------------------------------
	
	
	
	
//	@Autowired
//	private PingService pingService;
//
//	@Autowired
//	private TeltonikaSmsService teltonikaSmsService;
//
//	@Autowired
//	private ElRouterRepository routerRepository;
//
//	@Autowired
//	private UserRepository userRepository;
//
//	@Scheduled(fixedDelay = 30000)
//	public void pingRouters() {
//		List<ElRouter> routers = routerRepository.findAll();
//		for (ElRouter router : routers) {
//			boolean isReachable = pingService.isRouterReachable(router.getRouterIp());
//
//			router.setStatus(isReachable ? "Reachable" : "Unreachable");
//
//			if (!isReachable) {
//				// Get reachable router IP
//				String reachableRouterIp = getReachableRouterIp();
//
//				// Find users with roles SISTEM_ADMIN, SUPER_USER, or ADMIN_USERS
//				List<User> users = userRepository.findByRolesIn(
//						Arrays.asList(UsersRoles.SISTEM_ADMIN, UsersRoles.SUPER_USER, UsersRoles.ADMIN_USERS));
//
//				// Send SMS to users
//				for (User user : users) {
//					try {
//						teltonikaSmsService.sendSms(user.getPhoneNumberString(), "Un router este defect. Verificati aplicatia pentru a vedea mai multe detalii.", reachableRouterIp);
//					} catch (Exception e) {
//						// Handle the exception
//					}
//				}
//			}
//
//			routerRepository.save(router);
//		}
//	}
//
//	private String getReachableRouterIp() {
//		List<ElRouter> routers = routerRepository.findByStatus("Reachable");
//	    if (!routers.isEmpty()) {
//	        return routers.get(0).getRouterIp(); // Return the first reachable router IP
//	    }
//	    return null; // Handle the case when no reachable router is found
//	}
	
	
	
	
	
	
	
	
	
	

	
	
	
	
	
	
	
	
//	@Autowired
//    private PingService pingService;
//
//    @Autowired
//    private TeltonikaSmsService teltonikaSmsService;
//
//    @Autowired
//    private ElRouterRepository routerRepository;
//
//    @Autowired
//    private UserRepository userRepository;
//
//    private Set<String> unreachableRouters = new HashSet<>();
//
//    @Scheduled(fixedDelay = 5000)
//    public void pingRouters() {
//        List<ElRouter> routers = routerRepository.findAll();
//        for (ElRouter router : routers) {
//            boolean isReachable = pingService.isRouterReachable(router.getRouterIp()) || ;
//
//            if (!isReachable && !unreachableRouters.contains(router.getRouterIp())) {
//                String reachableRouterIp = getReachableRouterIp();
//
//                List<User> users = userRepository.findByRolesIn(
//                        Arrays.asList(UsersRoles.SISTEM_ADMIN, UsersRoles.SUPER_USER, UsersRoles.ADMIN_USERS));
//
//                for (User user : users) {
//                    try {
//                        String smsText = String.format("Router '%s' with IP '%s' is unreachable. Check the application for more details.",
//                                router.getRouterName(), router.getRouterIp());
//                        teltonikaSmsService.sendSms(user.getPhoneNumberString(), smsText, reachableRouterIp);
//                    } catch (Exception e) {
//                        // Handle the exception
//                    }
//                }
//
//                unreachableRouters.add(router.getRouterIp());
//            }
//
//            String status = isReachable ? "Reachable" : "Unreachable";
//            if (status.equals("Reachable") && unreachableRouters.contains(router.getRouterIp())) {
//                unreachableRouters.remove(router.getRouterIp());
//            }
//
//            router.setStatus(status);
//            routerRepository.save(router);
//        }
//    }
//
//    private String getReachableRouterIp() {
//        List<ElRouter> routers = routerRepository.findByStatus("Reachable");
//        if (!routers.isEmpty()) {
//            return routers.get(0).getRouterIp();
//        }
//        return null;
//    }
//	
	
	
	
	
	
	   @Autowired
	    private PingService pingService;

	    @Autowired
	    private TeltonikaSmsService teltonikaSmsService;

	    @Autowired
	    private ElRouterRepository routerRepository;

	    @Autowired
	    private UserRepository userRepository;

	    // Store the previous state of the routers
	    private Map<Integer, String> previousRouterStates = new HashMap<>();

	    @Scheduled(fixedDelay = 1000)
	    public void pingRouters() {
	        List<ElRouter> routers = routerRepository.findAll();
	        for (ElRouter router : routers) {
	            boolean isReachable = pingService.isRouterReachable(router.getRouterIp()) ;

	            String currentState = isReachable ? "Reachable" : "Unreachable";
	            String previousState = previousRouterStates.getOrDefault(router.getId(), "");

	            router.setStatus(currentState);
	            routerRepository.save(router);
	            
	            if (!isReachable && !currentState.equals(previousState)) {
	                // Get reachable router IP
	                String reachableRouterIp = getReachableRouterIp();

	                // Find users with roles SISTEM_ADMIN, SUPER_USER, or ADMIN_USERS
	                List<User> users = userRepository.findByRolesIn(
	                        Arrays.asList(UsersRoles.SISTEM_ADMIN, UsersRoles.SUPER_USER, UsersRoles.ADMIN_USERS));

	                // Send SMS to users
	                for (User user : users) {
	                    try {
	                        String smsText = String.format("Router '%s' with IP '%s' is unreachable. Check the application for more details.",
	                                router.getRouterName(), router.getRouterIp());
	                        teltonikaSmsService.sendSms(user.getPhoneNumberString(), smsText, reachableRouterIp);
	                    } catch (Exception e) {
	                        // Handle the exception
	                    }
	                }
	            }

	            previousRouterStates.put(router.getId(), currentState);
	        }
	    }

	    private String getReachableRouterIp() {
	        List<ElRouter> routers = routerRepository.findByStatus("Reachable");
	        if (!routers.isEmpty()) {
	            return routers.get(0).getRouterIp(); // Return the first reachable router IP
	        }
	        return null; // Handle the case when no reachable router is found
	        
	       
	        
	    }
	
	
	
	
}
