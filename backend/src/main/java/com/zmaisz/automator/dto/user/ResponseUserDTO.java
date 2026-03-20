package com.zmaisz.automator.dto.user;

import com.zmaisz.automator.dto.user.usergroup.ResponseUserGroupDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResponseUserDTO {
    private Long id;
    private String name;
    private String email;
    private ResponseUserGroupDTO group;
}
