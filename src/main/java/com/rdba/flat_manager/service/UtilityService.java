package com.rdba.flat_manager.service;

import com.rdba.flat_manager.dto.UtilityUpdateDTO;
import com.rdba.flat_manager.entity.Flat;
import com.rdba.flat_manager.entity.Utility;
import com.rdba.flat_manager.entity.UtilityPayment;
import com.rdba.flat_manager.exception.FlatNotFound;
import com.rdba.flat_manager.exception.UtilityNotFound;
import com.rdba.flat_manager.repo.FlatRepository;
import com.rdba.flat_manager.repo.UtilityPaymentRepository;
import com.rdba.flat_manager.repo.UtilityRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
public class UtilityService {
    private final UtilityRepository utilityRepository;
    private final UtilityPaymentRepository utilityPaymentRepository;
    private final FlatRepository flatRepository;

    public UtilityService(UtilityRepository utilityRepository, FlatRepository flatRepository, UtilityPaymentRepository utilityPaymentRepository) {
        this.utilityRepository = utilityRepository;
        this.flatRepository = flatRepository;
        this.utilityPaymentRepository = utilityPaymentRepository;
    }

    public List<Utility> getAllUtility() {
        return utilityRepository.findAll();
    }

    @Transactional
    public Utility createUtility(Utility utilityDTO) {
        Utility utility = utilityRepository.save(utilityDTO);

        UtilityPayment utilityPayment = new UtilityPayment();
        utilityPayment.setUtility(utility);
        utilityPayment.setDate(ZonedDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0));
        utilityPayment.setIsPaid(false);
        utilityPayment.setPrice(utilityDTO.getPrice());
        utilityPaymentRepository.save(utilityPayment);
        return utility;
    }

    @Transactional
    public void deleteUtilityById(Long id) {
        utilityPaymentRepository.deleteAllByUtilityId(id);
        utilityRepository.deleteById(id);
    }

    public Optional<Utility> getUtilityById(Long id) {
        return utilityRepository.findById(id);
    }


    @Transactional
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
        DateTimeFormatter formatter = DateTimeFormatter.ISO_ZONED_DATE_TIME;
        return ZonedDateTime.parse(date, formatter);
    }
}
