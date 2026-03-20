package com.zmaisz.automator.dto.user.usergroup;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateUserGroupDTO {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Locality is required")
    private String locality;

    @NotBlank(message = "Frotaflex user is required")
    private String frotaflexUser;

    @NotBlank(message = "Frotaflex password is required")
    private String frotaflexPassword;

}
