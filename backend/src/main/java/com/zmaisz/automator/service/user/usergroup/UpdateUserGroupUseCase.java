package com.zmaisz.automator.service.user.usergroup;

import org.springframework.stereotype.Service;

import com.zmaisz.automator.dto.user.usergroup.UpdateUserGroupDTO;
import com.zmaisz.automator.exception.user.usergrop.UserGroupNotFoundException;
import com.zmaisz.automator.model.user.usergroup.UserGroup;
import com.zmaisz.automator.repository.user.usergroup.UserGroupRepository;

@Service
public class UpdateUserGroupUseCase {

    private final UserGroupRepository userGroupRepository;

    public UpdateUserGroupUseCase(UserGroupRepository userGroupRepository) {
        this.userGroupRepository = userGroupRepository;
    }

    public UserGroup execute(Long id, UpdateUserGroupDTO updateUserGroupDTO) {
        UserGroup existingUserGroup = userGroupRepository.findById(id)
                .orElseThrow(() -> new UserGroupNotFoundException("User group not found"));
        existingUserGroup.setName(updateUserGroupDTO.getName());
        existingUserGroup.setLocality(updateUserGroupDTO.getLocality());
        existingUserGroup.setFrotaflexUser(updateUserGroupDTO.getFrotaflexUser());
        existingUserGroup.setFrotaflexPassword(updateUserGroupDTO.getFrotaflexPassword());
        return userGroupRepository.save(existingUserGroup);
    }

}
