package com.sharon.workflow_system.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sharon.workflow_system.entity.User;
public interface UserRepository extends JpaRepository<User, Long> {
  Optional<User> findByEmail(String email);
}