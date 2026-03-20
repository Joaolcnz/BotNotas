package com.zmaisz.automator.service.user;

import org.springframework.stereotype.Service;

import com.zmaisz.automator.dto.user.UpdateUserDTO;
import com.zmaisz.automator.exception.user.UserAlreadyExistsException;
import com.zmaisz.automator.exception.user.UserNotFoundException;
import com.zmaisz.automator.model.user.User;
import com.zmaisz.automator.repository.user.UserRepository;
import com.zmaisz.automator.service.user.usergroup.UserGroupQueryService;

@Service
public class UpdateUserUseCase {

    private final UserRepository userRepository;
    private final UserGroupQueryService userGroupQueryService;

    public UpdateUserUseCase(UserRepository userRepository, UserGroupQueryService userGroupQueryService) {
        this.userRepository = userRepository;
        this.userGroupQueryService = userGroupQueryService;
    }

    public User execute(Long id, UpdateUserDTO updateUserDTO) {
        User user = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException("User not found"));
        if (userRepository.existsByEmail(updateUserDTO.getEmail())
                || userRepository.existsByName(updateUserDTO.getName())) {
            throw new UserAlreadyExistsException("User already exists");
        }
        user.setName(updateUserDTO.getName());
        user.setEmail(updateUserDTO.getEmail());
        user.setPassword(updateUserDTO.getPassword());
        user.setGroup(userGroupQueryService.findById(updateUserDTO.getGroupId()));
        return userRepository.save(user);
    }

}
