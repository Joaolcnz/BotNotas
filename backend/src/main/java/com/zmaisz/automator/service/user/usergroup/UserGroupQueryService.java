package com.zmaisz.automator.service.user.usergroup;

import java.util.List;

import org.springframework.stereotype.Service;

import com.zmaisz.automator.exception.user.usergrop.UserGroupNotFoundException;
import com.zmaisz.automator.model.user.usergroup.UserGroup;
import com.zmaisz.automator.repository.user.usergroup.UserGroupRepository;

@Service
public class UserGroupQueryService {

    private final UserGroupRepository userGroupRepository;

    public UserGroupQueryService(UserGroupRepository userGroupRepository) {
        this.userGroupRepository = userGroupRepository;
    }

    public List<UserGroup> findAll() {
        return userGroupRepository.findAll();
    }

    public UserGroup findById(Long id) {
        return userGroupRepository.findById(id)
                .orElseThrow(() -> new UserGroupNotFoundException("User group not found"));
    }

}
