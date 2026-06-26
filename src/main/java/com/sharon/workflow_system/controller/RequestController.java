package com.sharon.workflow_system.controller;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sharon.workflow_system.dto.CreateRequestRequest;
import com.sharon.workflow_system.dto.RequestResponse;
import com.sharon.workflow_system.enums.RequestStatus;
import com.sharon.workflow_system.enums.RequestType;
import com.sharon.workflow_system.service.RequestService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/requests")
public class RequestController {

    private final RequestService requestService;

    public RequestController(RequestService requestService) {
        this.requestService = requestService;
    }

    @PostMapping
    public RequestResponse createRequest(@Valid @RequestBody CreateRequestRequest requestDto) {
        return requestService.createRequest(requestDto);
    }

    @GetMapping
    public Object getRequests(
            @RequestParam(required = false) RequestStatus status,
            @RequestParam(required = false) RequestType type,
            Pageable pageable) {

        if (status != null) {
            return requestService.getRequestsByStatus(status);
        }

        if (type != null) {
            return requestService.getRequestsByType(type);
        }

        return requestService.getAllRequests(pageable);
    }

    @GetMapping("/my")
    public List<RequestResponse> getMyRequests() {
        return requestService.getMyRequests();
    }

    @PutMapping("/{id}/approve")
    public RequestResponse approveRequest(@PathVariable Long id) {
        return requestService.approveRequest(id);
    }

    @PutMapping("/{id}/reject")
    public RequestResponse rejectRequest(@PathVariable Long id) {
        return requestService.rejectRequest(id);
    }
}