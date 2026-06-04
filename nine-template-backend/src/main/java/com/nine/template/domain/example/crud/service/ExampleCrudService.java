package com.nine.template.domain.example.crud.service;

import com.ninelab.ai.mvc.mapper.CommonMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@RequiredArgsConstructor
@Service("exampleCrudService")
public class ExampleCrudService {

    private final CommonMapper dao;
    private final String QUERY = "com.nine-template.domain.example.crud.mapper.";

    public Map<String, Object> selectList(Map<String, Object> body) throws Exception {
        return Map.of("list", dao.selectList(QUERY + "selectList", body));
    }

    public Map<String, Object> selectOne(Map<String, Object> body) throws Exception {
        return dao.selectOne(QUERY + "selectOne", body);
    }

    public Map<String, Object> insert(Map<String, Object> body) throws Exception {
        return Map.of("cnt", dao.insert(QUERY + "insert", body));
    }

    public Map<String, Object> update(Map<String, Object> body) throws Exception {
        return Map.of("cnt", dao.update(QUERY + "update", body));
    }

    public Map<String, Object> delete(Map<String, Object> body) throws Exception {
        return Map.of("cnt", dao.delete(QUERY + "delete", body));
    }
}