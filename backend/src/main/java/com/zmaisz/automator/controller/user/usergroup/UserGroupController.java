package com.zmaisz.automator.controller.user.usergroup;

import java.util.List;

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

import com.zmaisz.automator.dto.user.usergroup.CreateUserGroupDTO;
import com.zmaisz.automator.dto.user.usergroup.ResponseUserGroupDTO;
import com.zmaisz.automator.dto.user.usergroup.UpdateUserGroupDTO;
import com.zmaisz.automator.service.user.usergroup.ActivateUserGroupUseCase;
import com.zmaisz.automator.service.user.usergroup.CreateUserGroupUseCase;
import com.zmaisz.automator.service.user.usergroup.DeleteUserGroupUseCase;
import com.zmaisz.automator.service.user.usergroup.DisableUserGroupUseCase;
import com.zmaisz.automator.service.user.usergroup.UpdateUserGroupUseCase;
import com.zmaisz.automator.service.user.usergroup.UserGroupQueryService;

import java.util.stream.Collectors;

import jakarta.validation.Valid;

import com.zmaisz.automator.util.mapper.UserGroupMapper;

@RestController
@RequestMapping("/api/group")
public class UserGroupController {

    private final CreateUserGroupUseCase createUserGroupUseCase;
    private final UpdateUserGroupUseCase updateUserGroupUseCase;
    private final DeleteUserGroupUseCase deleteUserGroupUseCase;
    private final UserGroupQueryService userGroupQueryService;
    private final ActivateUserGroupUseCase activateUserGroupUseCase;
    private final DisableUserGroupUseCase disableUserGroupUseCase;

    public UserGroupController(CreateUserGroupUseCase createUserGroupUseCase,
            UpdateUserGroupUseCase updateUserGroupUseCase,
            DeleteUserGroupUseCase deleteUserGroupUseCase,
            UserGroupQueryService userGroupQueryService,
            ActivateUserGroupUseCase activateUserGroupUseCase,
            DisableUserGroupUseCase disableUserGroupUseCase) {
        this.createUserGroupUseCase = createUserGroupUseCase;
        this.updateUserGroupUseCase = updateUserGroupUseCase;
        this.deleteUserGroupUseCase = deleteUserGroupUseCase;
        this.userGroupQueryService = userGroupQueryService;
        this.activateUserGroupUseCase = activateUserGroupUseCase;
        this.disableUserGroupUseCase = disableUserGroupUseCase;
    }

    @PostMapping
    public ResponseEntity<ResponseUserGroupDTO> createUserGroup(@Valid @RequestBody CreateUserGroupDTO createUserGroupDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(UserGroupMapper.toDTO(createUserGroupUseCase.execute(createUserGroupDTO)));
    }

    @GetMapping
    public ResponseEntity<List<ResponseUserGroupDTO>> getAllUserGroups() {
        List<ResponseUserGroupDTO> response = userGroupQueryService.findAll()
                .stream()
                .map(UserGroupMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseUserGroupDTO> getUserGroupById(@PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(UserGroupMapper.toDTO(userGroupQueryService.findById(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseUserGroupDTO> updateUserGroup(@PathVariable Long id,
            @Valid @RequestBody UpdateUserGroupDTO updateUserGroupDTO) {
        return ResponseEntity.status(HttpStatus.OK).body(UserGroupMapper.toDTO(updateUserGroupUseCase.execute(id, updateUserGroupDTO)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseUserGroupDTO> deleteUserGroup(@PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(UserGroupMapper.toDTO(deleteUserGroupUseCase.execute(id)));
    }

    @PutMapping("/{id}/activate")
    public ResponseEntity<Void> activateUserGroup(@PathVariable Long id) {
        activateUserGroupUseCase.execute(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @PutMapping("/{id}/disable")
    public ResponseEntity<Void> disableUserGroup(@PathVariable Long id) {
        disableUserGroupUseCase.execute(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
