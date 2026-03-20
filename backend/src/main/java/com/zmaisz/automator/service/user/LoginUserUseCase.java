package com.zmaisz.automator.service.user;

import org.springframework.stereotype.Service;

import com.zmaisz.automator.dto.user.LoginUserDTO;
import com.zmaisz.automator.exception.user.IncorrectPasswordException;
import com.zmaisz.automator.exception.user.UserNotFoundException;
import com.zmaisz.automator.model.user.User;
import com.zmaisz.automator.repository.user.UserRepository;

@Service
public class LoginUserUseCase {

    private final UserRepository userRepository;

    public LoginUserUseCase(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User execute(LoginUserDTO loginUserDTO) {
        User user = userRepository.findByName(loginUserDTO.getName())
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        if (!user.getPassword().equals(loginUserDTO.getPassword())) {
            throw new IncorrectPasswordException("Incorrect password");
        }
        return user;
    }
}
