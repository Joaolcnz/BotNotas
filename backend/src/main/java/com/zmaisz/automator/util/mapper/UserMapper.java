package com.zmaisz.automator.util.mapper;

import com.zmaisz.automator.dto.user.ResponseUserDTO;
import com.zmaisz.automator.model.user.User;

public class UserMapper {

    public static ResponseUserDTO toDTO(User user) {
        return new ResponseUserDTO(user.getId(), user.getName(), user.getEmail(),
                UserGroupMapper.toDTO(user.getGroup()));
    }

}
