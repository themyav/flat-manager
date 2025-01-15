package com.rdba.flat_manager.controller;

import com.rdba.flat_manager.dto.UserDTO;
import com.rdba.flat_manager.entity.Flat;
import com.rdba.flat_manager.entity.User;
import com.rdba.flat_manager.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@Tag(name = "User API", description = "Контроллер управления пользователями")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    @ResponseStatus(HttpStatus.CREATED)
    public List<User> createFlat() {
        return userService.getAllUsers();
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        User created = userService.createUser(user);
        if (created != null) {
            return ResponseEntity.ok(created);

        } else
            return ResponseEntity.badRequest().body("Юзер с такими данным уже существует. Логин, почта и телефон должны быть уникальными");
    }

    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody UserDTO userDTO) {
        Optional<User> user = userService.loginUser(userDTO.getUsername(), userDTO.getPassword());
        if (user.isPresent()) {
            return ResponseEntity.ok("Регистрация успешна");
        } else return ResponseEntity.badRequest().body("Некорректные данные");
    }

    @GetMapping("/{username}")
    public Optional<User> getUserInfo(@PathVariable String username) {
        return userService.getUserInfo(username);
    }

    @GetMapping("/id/{id}")
    public Optional<User> getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @PutMapping("/id/{id}")
    public User updateUserById(@PathVariable Long id, @RequestBody User user) {
        return userService.updateUser(id, user);
    }

    @GetMapping("/flats/{id}")
    @ResponseStatus(HttpStatus.OK)
    public List<Flat> getFlatsByUserId(@PathVariable Long id) {
        return userService.getFlatsByUserId(id);
    }

}
