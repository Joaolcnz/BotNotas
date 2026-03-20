package com.zmaisz.automator.controller.user;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.zmaisz.automator.dto.user.CreateUserDTO;
import com.zmaisz.automator.dto.user.LoginUserDTO;
import com.zmaisz.automator.dto.user.ResponseUserDTO;
import com.zmaisz.automator.dto.user.UpdateUserDTO;
import com.zmaisz.automator.service.user.CreateUserUseCase;
import com.zmaisz.automator.service.user.DeleteUserUseCase;
import com.zmaisz.automator.service.user.LoginUserUseCase;
import com.zmaisz.automator.service.user.UpdateUserUseCase;
import com.zmaisz.automator.service.user.UserQueryService;
import com.zmaisz.automator.util.mapper.UserMapper;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final CreateUserUseCase createUserUseCase;
    private final UpdateUserUseCase updateUserUseCase;
    private final DeleteUserUseCase deleteUserUseCase;
    private final UserQueryService userQueryService;
    private final LoginUserUseCase loginUserUseCase;

    public UserController(CreateUserUseCase createUserUseCase,
            UpdateUserUseCase updateUserUseCase,
            DeleteUserUseCase deleteUserUseCase,
            UserQueryService userQueryService,
            LoginUserUseCase loginUserUseCase) {
        this.createUserUseCase = createUserUseCase;
        this.updateUserUseCase = updateUserUseCase;
        this.deleteUserUseCase = deleteUserUseCase;
        this.userQueryService = userQueryService;
        this.loginUserUseCase = loginUserUseCase;
    }

    @PostMapping
    public ResponseEntity<ResponseUserDTO> createUser(@Valid @RequestBody CreateUserDTO createUserDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(UserMapper.toDTO(createUserUseCase.execute(createUserDTO)));
    }

    @GetMapping
    public ResponseEntity<List<ResponseUserDTO>> getAllUsers() {
        List<ResponseUserDTO> response = userQueryService.findAll()
                .stream()
                .map(UserMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseUserDTO> getUserById(@PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(UserMapper.toDTO(userQueryService.findById(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseUserDTO> updateUser(@PathVariable Long id, @Valid @RequestBody UpdateUserDTO updateUserDTO) {
        return ResponseEntity.status(HttpStatus.OK).body(UserMapper.toDTO(updateUserUseCase.execute(id, updateUserDTO)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseUserDTO> deleteUser(@PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(UserMapper.toDTO(deleteUserUseCase.execute(id)));
    }

    @PostMapping("/login")
    public ResponseEntity<ResponseUserDTO> loginUser(@Valid @RequestBody LoginUserDTO loginUserDTO) {
        return ResponseEntity.status(HttpStatus.OK).body(UserMapper.toDTO(loginUserUseCase.execute(loginUserDTO)));
    }

}
