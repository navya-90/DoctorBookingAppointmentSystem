package com.springboot.clinic.Care.service;

import com.springboot.clinic.Care.dto.AuthRequest;
import com.springboot.clinic.Care.dto.AuthResponse;
import com.springboot.clinic.Care.dto.PasswordChangeRequest;
import com.springboot.clinic.Care.dto.RegisterRequest;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(AuthRequest request);

    void changePassword(PasswordChangeRequest request);
}
