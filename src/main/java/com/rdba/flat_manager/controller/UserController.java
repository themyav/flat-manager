package com.rdba.flat_manager.controller;

import com.rdba.flat_manager.entity.User;
import com.rdba.flat_manager.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PutMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public User registerUser(@RequestBody User user) {
        return userService.createUser(user);
    }

    @PutMapping("/login")
    public String loginUser(@RequestParam String username, @RequestParam String password) {
        Optional<User> user = userService.loginUser(username, password);
        return user.isPresent() ? "Login successful" : "Invalid credentials";
    }

    @GetMapping("/{username}")
    public Optional<User> getUserInfo(@PathVariable String username) {
        return userService.getUserInfo(username);
    }

    @GetMapping("/id/{id}")
    public Optional<User> getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }
}
