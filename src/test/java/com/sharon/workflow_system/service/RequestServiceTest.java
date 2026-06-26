package com.sharon.workflow_system.service;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.sharon.workflow_system.dto.RequestResponse;
import com.sharon.workflow_system.entity.Request;
import com.sharon.workflow_system.entity.User;
import com.sharon.workflow_system.enums.RequestStatus;
import com.sharon.workflow_system.repository.RequestRepository;
import com.sharon.workflow_system.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class RequestServiceTest {

    @Mock
    private RequestRepository requestRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private RequestService requestService;

    @Test
    void approveRequest_shouldApproveSuccessfully() {

        // Arrange
        Request request = new Request();
        request.setId(1L);
        request.setStatus(RequestStatus.PENDING);

        User user = new User();
        user.setName("Tester User");
        request.setCreatedBy(user);

        when(requestRepository.findById(1L))
                .thenReturn(Optional.of(request));

        when(requestRepository.save(any(Request.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        RequestResponse response = requestService.approveRequest(1L);

        // Assert
        assertEquals(RequestStatus.APPROVED, response.getStatus());
        assertEquals("Tester User", response.getCreatedBy());

        verify(requestRepository).findById(1L);
        verify(requestRepository).save(any(Request.class));
    }
}