package com.nine.template.domain.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class LoginResponse {
    private String accessToken; // JWT든 세션 토큰이든 담아 보낼 껍데기
    private String tokenType;   // 예: "Bearer"
    private String username;
}