package com.zmaisz.automator.service.user.usergroup;

import org.springframework.stereotype.Service;

import com.zmaisz.automator.exception.user.usergrop.UserGroupIsNotEmptyException;
import com.zmaisz.automator.exception.user.usergrop.UserGroupNotFoundException;
import com.zmaisz.automator.model.user.usergroup.UserGroup;
import com.zmaisz.automator.repository.user.UserRepository;
import com.zmaisz.automator.repository.user.usergroup.UserGroupRepository;

@Service
public class DeleteUserGroupUseCase {

    private final UserGroupRepository userGroupRepository;
    private final UserRepository userRepository;

    public DeleteUserGroupUseCase(UserGroupRepository userGroupRepository, UserRepository userRepository) {
        this.userGroupRepository = userGroupRepository;
        this.userRepository = userRepository;
    }

    public UserGroup execute(Long id) {
        UserGroup existingUserGroup = userGroupRepository.findById(id)
                .orElseThrow(() -> new UserGroupNotFoundException("User group not found"));
        if (userRepository.existsByGroupId(id)) {
            throw new UserGroupIsNotEmptyException("User group is not empty");
        }
        userGroupRepository.delete(existingUserGroup);
        return existingUserGroup;
    }

}
