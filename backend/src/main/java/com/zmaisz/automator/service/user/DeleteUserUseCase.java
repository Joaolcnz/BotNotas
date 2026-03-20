package com.zmaisz.automator.service.user;

import org.springframework.stereotype.Service;

import com.zmaisz.automator.exception.user.UserNotFoundException;
import com.zmaisz.automator.model.user.User;
import com.zmaisz.automator.repository.user.UserRepository;

@Service
public class DeleteUserUseCase {

    private final UserRepository userRepository;

    public DeleteUserUseCase(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User execute(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException("User not found"));
        userRepository.delete(user);
        return user;
    }

}
