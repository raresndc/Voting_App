package com.auth.service;

import com.auth.dto.UserInfoDto;
import com.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository repo;

    public Optional<UserInfoDto> findByUsername(String username) {
        return repo.findByUsername(username)
                .map(u -> new UserInfoDto(
                        u.getAge(),
                        u.getCitizenship(),
                        u.getDob(),
                        u.getGender(),
                        u.getLastName(),
                        u.getFirstName(),
                        u.getIDseries(),
                        u.isVerified(),
                        u.getPersonalIdNo(),
                        u.getPhoneNo(),
                        u.getCreatedDate(),
                        u.getUsername(),
                        u.isTwoFactorEnabled()
                ));
    }
}
