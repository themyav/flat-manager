package com.rdba.flat_manager.service;

import com.rdba.flat_manager.entity.Utility;
import com.rdba.flat_manager.repo.UtilityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UtilityService {
    @Autowired
    private final UtilityRepository utilityRepository;

    public UtilityService(UtilityRepository utilityRepository) {
        this.utilityRepository = utilityRepository;
    }

    public Utility createUtility(Utility utility) {
        return utilityRepository.save(utility);
    }

    public void deleteUtility(Utility utility) {
        utilityRepository.delete(utility);
    }

    public void deleteUtilityById(Long id) {
        utilityRepository.deleteById(id);
    }

    public Optional<Utility> getUtilityById(Long id) {
        return utilityRepository.findById(id);
    }

}
