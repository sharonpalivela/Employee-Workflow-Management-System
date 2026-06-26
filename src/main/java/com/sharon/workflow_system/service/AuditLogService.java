package com.sharon.workflow_system.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.sharon.workflow_system.entity.AuditLog;
import com.sharon.workflow_system.repository.AuditLogRepository;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLogService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    public List<AuditLog> getAllLogs() {
        return auditLogRepository.findAll();
    }
}