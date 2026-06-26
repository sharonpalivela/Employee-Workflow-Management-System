package com.sharon.workflow_system.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.sharon.workflow_system.dto.CreateRequestRequest;
import com.sharon.workflow_system.dto.RequestResponse;
import com.sharon.workflow_system.entity.Request;
import com.sharon.workflow_system.entity.User;
import com.sharon.workflow_system.enums.RequestStatus;
import com.sharon.workflow_system.enums.RequestType;
import com.sharon.workflow_system.exception.ResourceNotFoundException;
import com.sharon.workflow_system.repository.RequestRepository;
import com.sharon.workflow_system.repository.UserRepository;

@Service
public class RequestService {

    private final RequestRepository requestRepository;
    private final UserRepository userRepository;

    public RequestService(RequestRepository requestRepository, UserRepository userRepository) {
        this.requestRepository = requestRepository;
        this.userRepository = userRepository;
    }

    public RequestResponse createRequest(CreateRequestRequest requestDto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Request request = new Request();

        request.setTitle(requestDto.getTitle());
        request.setDescription(requestDto.getDescription());
        request.setType(requestDto.getType());
        request.setStatus(RequestStatus.PENDING);
        request.setCreatedBy(user);
        request.setCreatedAt(LocalDateTime.now());
        request.setUpdatedAt(LocalDateTime.now());

        Request savedRequest = requestRepository.save(request);

        return mapToResponse(savedRequest);
    }

    public Page<RequestResponse> getAllRequests(Pageable pageable) {
        return requestRepository.findAll(pageable)
                .map(this::mapToResponse);
    }

    public List<RequestResponse> getRequestsByStatus(RequestStatus status) {
        return requestRepository.findByStatus(status)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<RequestResponse> getRequestsByType(RequestType type) {
        return requestRepository.findByType(type)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<RequestResponse> getMyRequests() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return requestRepository.findByCreatedBy(user)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public RequestResponse approveRequest(Long id) {
        Request request = requestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));

        request.setStatus(RequestStatus.APPROVED);
        request.setUpdatedAt(LocalDateTime.now());

        Request savedRequest = requestRepository.save(request);

        return mapToResponse(savedRequest);
    }

    public RequestResponse rejectRequest(Long id) {
        Request request = requestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));

        request.setStatus(RequestStatus.REJECTED);
        request.setUpdatedAt(LocalDateTime.now());

        Request savedRequest = requestRepository.save(request);

        return mapToResponse(savedRequest);
    }

    private RequestResponse mapToResponse(Request request) {
        RequestResponse response = new RequestResponse();

        response.setId(request.getId());
        response.setTitle(request.getTitle());
        response.setDescription(request.getDescription());
        response.setType(request.getType());
        response.setStatus(request.getStatus());
        response.setCreatedAt(request.getCreatedAt());
        response.setUpdatedAt(request.getUpdatedAt());

        if (request.getCreatedBy() != null) {
            response.setCreatedBy(request.getCreatedBy().getName());
        }

        return response;
    }
}