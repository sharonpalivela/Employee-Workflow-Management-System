package com.sharon.workflow_system.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sharon.workflow_system.entity.AuditLog;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

}