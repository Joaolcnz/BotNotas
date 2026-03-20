package com.zmaisz.automator.util.mapper;

import com.zmaisz.automator.dto.user.usergroup.ResponseUserGroupDTO;
import com.zmaisz.automator.model.user.usergroup.UserGroup;

public class UserGroupMapper {

    public static ResponseUserGroupDTO toDTO(UserGroup userGroup) {
        return new ResponseUserGroupDTO(
            userGroup.getId(),
            userGroup.getName(),
            userGroup.getLocality(),
            userGroup.isActive()
        );
    }
}
