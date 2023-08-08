package com.example.app.controller;

import com.example.app.dto.UserDto;
import com.example.app.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.view.RedirectView;

import javax.servlet.http.HttpServletRequest;

@Controller
@RequiredArgsConstructor
@RequestMapping("/user/*")
public class UserController {
    private final UserService userService;

    @GetMapping("/join")
    public void join(){}

    @GetMapping("/login")
    public void login(){}

    @PostMapping("/join")
    public RedirectView join(UserDto userDto){
        userService.register(userDto);
        return new RedirectView("/user/login");
    }

    @PostMapping("/login")
    public RedirectView login(String userId, String userPassword, HttpServletRequest req){
        try {
            Long userNumber = userService.findUserNumber(userId, userPassword);
            req.getSession().setAttribute("userNumber",userNumber);
        } catch (IllegalArgumentException e) {
            e.printStackTrace();
            return new RedirectView("/user/login"); // 로그인 실패 시
        }

        return new RedirectView("/board/list"); // 로그인 성공 시

    }

    @GetMapping("/logout")
    public String logout(HttpServletRequest req){
        req.getSession().invalidate();  // 세션 초기화
        return "user/login";
    }
}
