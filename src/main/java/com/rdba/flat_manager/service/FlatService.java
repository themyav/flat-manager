package com.rdba.flat_manager.service;

import com.rdba.flat_manager.entity.Flat;
import com.rdba.flat_manager.entity.User;
import com.rdba.flat_manager.entity.Utility;
import com.rdba.flat_manager.repo.FlatRepository;
import com.rdba.flat_manager.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FlatService {
    @Autowired
    private final FlatRepository flatRepository;

    public FlatService(FlatRepository flatRepository) {
        this.flatRepository = flatRepository;
    }

    public Flat createFlat(Flat flat) {
        return flatRepository.save(flat);
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
        Optional<Flat> flat = flatRepository.findById(id);
        return flat.map(Flat::getUtilities).orElse(null);
    }

}
