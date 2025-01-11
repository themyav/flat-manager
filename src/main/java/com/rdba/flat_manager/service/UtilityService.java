package com.rdba.flat_manager.service;

import com.rdba.flat_manager.dto.FlatUpdateDTO;
import com.rdba.flat_manager.dto.UtilityUpdateDTO;
import com.rdba.flat_manager.entity.Flat;
import com.rdba.flat_manager.entity.User;
import com.rdba.flat_manager.entity.Utility;
import com.rdba.flat_manager.exception.FlatNotFound;
import com.rdba.flat_manager.exception.UserNotFound;
import com.rdba.flat_manager.exception.UtilityNotFound;
import com.rdba.flat_manager.repo.FlatRepository;
import com.rdba.flat_manager.repo.UtilityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
public class UtilityService {
    private final UtilityRepository utilityRepository;
    private final FlatRepository flatRepository;

    public UtilityService(UtilityRepository utilityRepository, FlatRepository flatRepository) {
        this.utilityRepository = utilityRepository;
        this.flatRepository = flatRepository;
    }

    public List<Utility> getAllUtility() {
        return utilityRepository.findAll();
    }

    public Utility createUtility(Utility utility) {
        return utilityRepository.save(utility);
    }

    public void deleteUtilityById(Long id) {
        utilityRepository.deleteById(id);
    }

    public Optional<Utility> getUtilityById(Long id) {
        return utilityRepository.findById(id);
    }


    public Utility updateUtility(Long id, UtilityUpdateDTO utilityUpdateDTO) {
        Utility utility = utilityRepository.findById(id).orElse(null);
        if (utility != null) {
            utility.setName(utilityUpdateDTO.getName());
            utility.setPrice(utilityUpdateDTO.getPrice());
            utility.setDate(getZonedDateTime(utilityUpdateDTO.getDate()));

            Flat flat = flatRepository.findById(utilityUpdateDTO.getFlatId()).orElse(null);
            if (flat != null) utility.setFlat(flat);
            else throw new FlatNotFound("updateUtility");

            return utilityRepository.save(utility);
        } else throw new UtilityNotFound("updateUtility");
    }

    public List<Utility> getAllUtilities() {
        return utilityRepository.findAll();
    }

    public ZonedDateTime getZonedDateTime(String date) {
        if (date == null || date.isEmpty()) {
            throw new IllegalArgumentException("Дата не может быть пустой");
        }
        // Формат строки даты, например: "2024-01-11T15:30:00+03:00"
        DateTimeFormatter formatter = DateTimeFormatter.ISO_ZONED_DATE_TIME;
        return ZonedDateTime.parse(date, formatter);
    }
}
