package com.example.app.mapper;

import com.example.app.dto.UserDto;
import lombok.extern.slf4j.Slf4j;
import static org.assertj.core.api.Assertions.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Slf4j
@Transactional
class UserMapperTest {

    @Autowired
    private UserMapper userMapper;
    private UserDto userDto;

    @BeforeEach
    void setUp(){
        userDto = new UserDto();
        userDto.setUserId("testId");
        userDto.setUserPassword("1234");
        userDto.setUserGender("M");
        userDto.setUserEmail("test@email.com");
        userDto.setUserAddress("test address");
    }

    @Test
    @DisplayName("회원 저장, 회원 번호 조회")
    void insert() {
        userMapper.insert(userDto);
        assertThat(userMapper.selectUserNumber(userDto.getUserId(), userDto.getUserPassword()))
                .isEqualTo(userDto.getUserNumber());
    }

    @Test
    void selectUserNumber() {
        userMapper.insert(userDto);
        Long num =  userMapper.selectUserNumber(userDto.getUserId(), userDto.getUserPassword());

        assertThat(userDto.getUserNumber()).isEqualTo(num);
    }
}