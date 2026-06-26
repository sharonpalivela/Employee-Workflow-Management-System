package com.sharon.workflow_system.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sharon.workflow_system.entity.Request;
import com.sharon.workflow_system.entity.User;
import com.sharon.workflow_system.enums.RequestStatus;
import com.sharon.workflow_system.enums.RequestType;

public interface RequestRepository extends JpaRepository<Request, Long> {

    List<Request> findByCreatedBy(User user);

    List<Request> findByStatus(RequestStatus status);

    List<Request> findByType(RequestType type);
}