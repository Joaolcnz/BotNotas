package com.zmaisz.automator.service.user;

import java.util.List;

import org.springframework.stereotype.Service;

import com.zmaisz.automator.exception.user.UserNotFoundException;
import com.zmaisz.automator.model.user.User;
import com.zmaisz.automator.repository.user.UserRepository;

@Service
public class UserQueryService {

    private final UserRepository userRepository;

    public UserQueryService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
    }

}
