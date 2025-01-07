package com.rdba.flat_manager.service;

import com.rdba.flat_manager.entity.Flat;
import com.rdba.flat_manager.entity.User;
import com.rdba.flat_manager.entity.Utility;
import com.rdba.flat_manager.exception.FlatNotFound;
import com.rdba.flat_manager.exception.UserNotFound;
import com.rdba.flat_manager.repo.FlatRepository;
import com.rdba.flat_manager.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FlatService {
    private final FlatRepository flatRepository;
    private final UtilityService utilityService;
    private final UserRepository userRepository;

    public FlatService(FlatRepository flatRepository, UtilityService utilityService, UserRepository userRepository) {
        this.flatRepository = flatRepository;
        this.utilityService = utilityService;
        this.userRepository = userRepository;
    }

    public List<Flat> getAllFlats() {
        return flatRepository.findAll();
    }

    public Flat createFlat(Flat flat) {
        return flatRepository.save(flat);
    }


    public Flat updateFlat(Long id, Flat flat) {
        Flat flat1 = flatRepository.findById(id).orElse(null);
        if (flat1 != null) {
            flat1.setName(flat.getName());
            flat1.setAddress(flat.getAddress());
            User user = userRepository.findById(flat.getUser().getId()).orElse(null);

            if (user != null) flat1.setUser(user);
            else throw new UserNotFound("updateFlat");

            return flatRepository.save(flat1);
        } else throw new FlatNotFound("updateFlat");

    }

    public void deleteFlat(Flat flat) {
        flatRepository.delete(flat);
    }

    public void deleteFlatById(Long id) {
        flatRepository.deleteById(id);
    }

    public Optional<Flat> getFlatById(Long id) {
        return flatRepository.findById(id);
    }


    public List<Utility> getUtilitiesByFlatId(Long id) {
        return utilityService.getAllUtility().stream().filter(utility -> utility.getFlat().getId().equals(id)).toList();
    }

}
