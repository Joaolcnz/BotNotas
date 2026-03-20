package com.zmaisz.automator.service.user;

import org.springframework.stereotype.Service;

import com.zmaisz.automator.dto.user.CreateUserDTO;
import com.zmaisz.automator.exception.user.UserAlreadyExistsException;
import com.zmaisz.automator.model.user.User;
import com.zmaisz.automator.repository.user.UserRepository;
import com.zmaisz.automator.service.user.usergroup.UserGroupQueryService;

@Service
public class CreateUserUseCase {

    private final UserRepository userRepository;
    private final UserGroupQueryService userGroupQueryService;

    public CreateUserUseCase(UserRepository userRepository, UserGroupQueryService userGroupQueryService) {
        this.userRepository = userRepository;
        this.userGroupQueryService = userGroupQueryService;
    }

    public User execute(CreateUserDTO createUserDTO) {
        if (userRepository.existsByEmail(createUserDTO.getEmail())
                || userRepository.existsByName(createUserDTO.getName())) {
            throw new UserAlreadyExistsException("User already exists");
        }
        User user = new User();
        user.setName(createUserDTO.getName());
        user.setEmail(createUserDTO.getEmail());
        user.setPassword(createUserDTO.getPassword());
        user.setGroup(userGroupQueryService.findById(createUserDTO.getGroupId()));
        return userRepository.save(user);
    }

}
