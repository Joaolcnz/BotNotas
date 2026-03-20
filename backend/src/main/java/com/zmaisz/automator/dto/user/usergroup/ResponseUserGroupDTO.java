package com.zmaisz.automator.dto.user.usergroup;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResponseUserGroupDTO {
    private Long id;
    private String name;
    private String locality;
    private boolean active;
}
