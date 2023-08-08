package com.example.app.service;

import com.example.app.dto.UserDto;
import com.example.app.mapper.UserMapper;
import lombok.extern.slf4j.Slf4j;
import static org.assertj.core.api.Assertions.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
@Slf4j
@Transactional
class UserServiceTest {

    @Mock
    private UserMapper userMapper;

    @InjectMocks
    private UserService userService;
    private UserDto userDto;

    @BeforeEach
    void setUp(){
        userDto = new UserDto();
        userDto.setUserId("aaa");
        userDto.setUserPassword("1234");
        userDto.setUserGender("M");
        userDto.setUserEmail("aaa@email.com");
        userDto.setUserAddress("강남구");
    }

    @Test
    @DisplayName("회원 등록")
    void register() {
//        스터빙
        doNothing().when(userMapper).insert(any(UserDto.class));
//        doNothing() : void로 선언된 메소드에 when()을 걸고 싶을 때 사용하는 메소드
//        when() : 특정 목 객체를 만들었다면 이 객체로부터 특정한 조건을 지정
//        실행 상황
        userService.register(userDto);
//        verify(userMapper, times(1)).insert(any(UserDto.class));
//        검증
        verify(userMapper, times(1)).insert(userDto);
//        verify() : 해당 구문이 호출되었는지 체크, 단순 호출뿐만 아니라 횟수나 타임아웃시간까지 지정하여 체크 가능
    }

    @Test
    @DisplayName("회원 번호 조회 : 존재하지 않는 회원 예외 검사")
    void findUserNumberException(){
        doReturn(null).when(userMapper).selectUserNumber(any(String.class), any(String.class));

        assertThatThrownBy(() -> userService.findUserNumber("a","a"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("존재하지");
    }


    @Test
    @DisplayName("회원 번호 조회")
    void findUserNumber() {
//        스터빙
        doReturn(1L).when(userMapper).selectUserNumber(any(String.class), any(String.class));
//        실행 상황
        Long userNumber = userService.findUserNumber("aaa","1234");
//        검증
        assertThat(userNumber).isEqualTo(1L);

    }
}