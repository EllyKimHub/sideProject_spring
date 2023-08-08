package com.example.app.mapper;

import com.example.app.dto.UserDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserMapper {
    public void insert(UserDto userDto);

    public Long selectUserNumber(@Param("userId")String userId, @Param("userPassword")String userPassword);


}
