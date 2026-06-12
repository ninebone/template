package com.nine.template.global.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // API 요청(/api/**)이나 확장자가 있는 정적 파일(.js, .css 등)을 제외하고,
        // 주소창으로 직접 들어오는 1단계 및 깊은 하위 라우팅 주소들을
        // 톰캣이 404 내지 않고 index.html로 안전하게 넘겨주도록 포워딩합니다.

        // 1단계 주소 대응 (예: /editor, /board)
        registry.addViewController("/{path:[^\\.]*}")
                .setViewName("forward:/index.html");

        // 2단계 이상의 주소 대응 (예: /accounts/login)
        registry.addViewController("/**/{path:[^\\.]*}")
                .setViewName("forward:/index.html");
    }
}