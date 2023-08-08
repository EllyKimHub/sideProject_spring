package com.example.app.mapper;

import com.example.app.dto.FileDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.*;


@Transactional
@SpringBootTest

class FileMapperTest {

    @Autowired
    private FileMapper fileMapper;
    private FileDto fileDto;

    @BeforeEach
    void setUp(){
        fileDto = new FileDto();
        fileDto.setFileName("aaa");
        fileDto.setFileUuid("testUUID");
        fileDto.setFileUploadPath("/23/02/02");
        fileDto.setBoardNumber(23L);
    }


    @Test
    void insert() {
        fileMapper.insert(fileDto);
        assertThat(fileMapper.selectList(fileDto.getBoardNumber()).size()).isEqualTo(0);
    }

    @Test
    void delete() {
        fileMapper.insert(fileDto);
        fileMapper.delete(fileDto.getBoardNumber());
        assertThat(fileMapper.selectList(fileDto.getBoardNumber()).size()).isEqualTo(0);

    }

    @Test
    void selectList() {
    }
}