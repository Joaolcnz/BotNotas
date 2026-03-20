package com.zmaisz.automator.service.user.usergroup;

import org.springframework.stereotype.Service;

import com.zmaisz.automator.dto.user.usergroup.CreateUserGroupDTO;
import com.zmaisz.automator.exception.user.usergrop.UserGroupAlreadyExistsException;
import com.zmaisz.automator.model.user.usergroup.UserGroup;
import com.zmaisz.automator.repository.user.usergroup.UserGroupRepository;

@Service
public class CreateUserGroupUseCase {

    private final UserGroupRepository userGroupRepository;

    public CreateUserGroupUseCase(UserGroupRepository userGroupRepository) {
        this.userGroupRepository = userGroupRepository;
    }

    public UserGroup execute(CreateUserGroupDTO createUserGroupDTO) {
        if (userGroupRepository.existsByName(createUserGroupDTO.getName())) {
            throw new UserGroupAlreadyExistsException("User group already exists");
        }
        UserGroup userGroup = new UserGroup();
        userGroup.setName(createUserGroupDTO.getName());
        userGroup.setLocality(createUserGroupDTO.getLocality());
        userGroup.setFrotaflexUser(createUserGroupDTO.getFrotaflexUser());
        userGroup.setFrotaflexPassword(createUserGroupDTO.getFrotaflexPassword());
        return userGroupRepository.save(userGroup);
    }

}
