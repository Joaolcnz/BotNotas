package com.zmaisz.automator.service.user.usergroup;

import org.springframework.stereotype.Service;

import com.zmaisz.automator.exception.user.usergrop.UserGroupNotFoundException;
import com.zmaisz.automator.model.user.usergroup.UserGroup;
import com.zmaisz.automator.repository.user.usergroup.UserGroupRepository;

@Service
public class DisableUserGroupUseCase {

    private final UserGroupRepository userGroupRepository;

    public DisableUserGroupUseCase(UserGroupRepository userGroupRepository) {
        this.userGroupRepository = userGroupRepository;
    }

    public UserGroup execute(Long id) {
        UserGroup existingUserGroup = userGroupRepository.findById(id)
                .orElseThrow(() -> new UserGroupNotFoundException("User group not found"));
        existingUserGroup.disable();
        return userGroupRepository.save(existingUserGroup);
    }

}
