package com.nine.template.domain.auth.service;

import com.nine.template.domain.auth.dto.LoginRequest;
import com.nine.template.domain.auth.dto.LoginResponse;
import org.springframework.stereotype.Service;

@Service
public class AuthService { // 🎯 인터페이스 껍데기 벗겨내고 바로 서비스 클래스로 정의

    public LoginResponse login(LoginRequest loginRequest) {
        // 🎯 TODO: 나중에 실제 DB 회원 검증 및 토큰 발행 로직이 들어올 자리
        return LoginResponse.builder()
                .accessToken("mock-temporary-access-token-xyz")
                .tokenType("Bearer")
                .username(loginRequest.getUsername())
                .build();
    }

    public void logout(String token) {
        // 🎯 TODO: 토큰 만료 또는 세션 제거 로직이 들어올 자리
    }
}