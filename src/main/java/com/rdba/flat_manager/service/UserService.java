package com.rdba.flat_manager.service;

import com.rdba.flat_manager.dto.FlatUpdateDTO;
import com.rdba.flat_manager.entity.Flat;
import com.rdba.flat_manager.entity.User;
import com.rdba.flat_manager.exception.FlatNotFound;
import com.rdba.flat_manager.exception.UserNotFound;
import com.rdba.flat_manager.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final FlatService flatService;

    public UserService(UserRepository userRepository, FlatService flatService) {
        this.userRepository = userRepository;
        this.flatService = flatService;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public User updateUser(Long id, User user) {
        User user1 = userRepository.findById(id).orElse(null);
        if (user1 != null) {
            user1.setUsername(user.getUsername());
            user1.setPassword(user.getPassword());
            user1.setFirstName(user.getFirstName());
            user1.setLastName(user.getLastName());
            user1.setEmail(user.getEmail());
            user1.setPhoneNumber(user.getPhoneNumber());

            return userRepository.save(user1);
        } else throw new FlatNotFound("updateUser");
    }

    public Optional<User> loginUser(String username, String password) {
        return userRepository.findByUsernameAndPassword(username, password);
    }

    public Optional<User> getUserInfo(String username) {
        return userRepository.findByUsername(username);
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public List<Flat> getFlatsByUserId(Long id) {
        return flatService.getAllFlats().stream().filter(flat -> flat.getUser().getId().equals(id)).toList();
    }

}
