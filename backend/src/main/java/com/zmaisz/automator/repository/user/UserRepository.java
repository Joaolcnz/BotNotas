package com.zmaisz.automator.repository.user;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.zmaisz.automator.model.user.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByGroupId(Long id);

    boolean existsByEmail(String email);

    boolean existsByName(String name);

    Optional<User> findByName(String name);
}
