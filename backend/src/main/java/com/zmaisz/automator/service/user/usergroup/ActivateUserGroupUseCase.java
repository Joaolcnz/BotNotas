package com.zmaisz.automator.service.user.usergroup;

import org.springframework.stereotype.Service;

import com.zmaisz.automator.exception.user.usergrop.UserGroupNotFoundException;
import com.zmaisz.automator.model.user.usergroup.UserGroup;
import com.zmaisz.automator.repository.user.usergroup.UserGroupRepository;

@Service
public class ActivateUserGroupUseCase {

    private final UserGroupRepository userGroupRepository;

    public ActivateUserGroupUseCase(UserGroupRepository userGroupRepository) {
        this.userGroupRepository = userGroupRepository;
    }

    public UserGroup execute(Long id) {
        UserGroup existingUserGroup = userGroupRepository.findById(id)
                .orElseThrow(() -> new UserGroupNotFoundException("User group not found"));
        existingUserGroup.activate();
        return userGroupRepository.save(existingUserGroup);
    }

}
