package com.rdba.flat_manager.service;

import com.rdba.flat_manager.entity.Utility;
import com.rdba.flat_manager.entity.UtilityPayment;
import com.rdba.flat_manager.repo.UtilityPaymentRepository;
import com.rdba.flat_manager.repo.UtilityRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UtilityPaymentService {
    private final UtilityPaymentRepository utilityPaymentRepository;

    public UtilityPaymentService(UtilityPaymentRepository utilityPaymentRepository) {
        this.utilityPaymentRepository = utilityPaymentRepository;
    }

    public List<UtilityPayment> getAllUtilityPayments() {
        return utilityPaymentRepository.findAll();
    }

    public List<UtilityPayment> getAllUtilityPaymentsByDate(String date) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy");
        LocalDate localDate = LocalDate.parse(date, formatter);

        ZoneId zoneId = ZoneId.systemDefault();
        ZonedDateTime startOfDay = localDate.atStartOfDay(zoneId);
        ZonedDateTime endOfDay = localDate.plusDays(1).atStartOfDay(zoneId).minusNanos(1);

        return utilityPaymentRepository.findAll().stream()
                .filter(utilityPayment -> !utilityPayment.getDate().isBefore(startOfDay) && !utilityPayment.getDate().isAfter(endOfDay))
                .collect(Collectors.toList());    }


    public UtilityPayment createUtilityPayment(UtilityPayment utility) {
        return utilityPaymentRepository.save(utility);
    }

    public void deleteUtilityPayment(UtilityPayment utility) {
        utilityPaymentRepository.delete(utility);
    }

    public void deleteUtilityPaymentById(Long id) {
        utilityPaymentRepository.deleteById(id);
    }

    public Optional<UtilityPayment> getUtilityPaymentById(Long id) {
        return utilityPaymentRepository.findById(id);
    }

}
