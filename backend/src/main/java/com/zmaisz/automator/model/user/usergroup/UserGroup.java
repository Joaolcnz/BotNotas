package com.zmaisz.automator.model.user.usergroup;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "user_groups")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String locality;

    @Column(nullable = false)
    private String frotaflexUser;

    @Column(nullable = false)
    private String frotaflexPassword;

    @Column(nullable = false)
    private boolean active = true;

    public void activate() {
        this.active = true;
    }

    public void disable() {
        this.active = false;
    }

}
