package com.zmaisz.automator.repository.user.usergroup;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.zmaisz.automator.model.user.usergroup.UserGroup;

@Repository
public interface UserGroupRepository extends JpaRepository<UserGroup, Long> {

    boolean existsByName(String name);

}
