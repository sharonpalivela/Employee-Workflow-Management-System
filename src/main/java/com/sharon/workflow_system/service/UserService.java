package com.sharon.workflow_system.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.sharon.workflow_system.entity.User;
import com.sharon.workflow_system.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}