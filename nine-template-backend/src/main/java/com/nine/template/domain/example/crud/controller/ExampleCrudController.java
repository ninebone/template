package com.nine.template.domain.example.crud.controller;

import com.nine.template.domain.auth.dto.LoginRequest;
import com.nine.template.domain.auth.dto.LoginResponse;
import com.nine.template.domain.auth.service.AuthService;
import com.nine.template.domain.example.crud.service.ExampleCrudService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController("exampleCrudController")
@RequestMapping("/example/crud")
@RequiredArgsConstructor
public class ExampleCrudController {

    private final ExampleCrudService service;

    @PostMapping("/selectList")
    public Map<String, Object> selectList(@RequestBody Map<String, Object> body) throws Exception {
        return service.selectList(body);
    }

    @PostMapping("/selectOne")
    public Map<String, Object> selectOne(@RequestBody Map<String, Object> body) throws Exception {
        return service.selectOne(body);
    }

    @PostMapping("/insert")
    public Map<String, Object> insert(@RequestBody Map<String, Object> body) throws Exception {
        return service.insert(body);
    }

    @PostMapping("/update")
    public Map<String, Object> update(@RequestBody Map<String, Object> body) throws Exception {
        return service.update(body);
    }

    @PostMapping("/delete")
    public Map<String, Object> delete(@RequestBody Map<String, Object> body) throws Exception {
        return service.delete(body);
    }
}