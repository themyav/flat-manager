package com.rdba.flat_manager.service;

import com.rdba.flat_manager.entity.Utility;
import com.rdba.flat_manager.entity.UtilityPayment;
import com.rdba.flat_manager.repo.UtilityPaymentRepository;
import com.rdba.flat_manager.repo.UtilityRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.ArrayList;
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
    private final UtilityRepository utilityRepository;

    public UtilityPaymentService(UtilityPaymentRepository utilityPaymentRepository, UtilityRepository utilityRepository) {
        this.utilityPaymentRepository = utilityPaymentRepository;
        this.utilityRepository = utilityRepository;
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
                .collect(Collectors.toList());
    }


    public UtilityPayment createUtilityPayment(UtilityPayment utility) {
        return utilityPaymentRepository.save(utility);
    }

    public void deleteUtilityPaymentById(Long id) {
        utilityPaymentRepository.deleteById(id);
    }

    public Optional<UtilityPayment> getUtilityPaymentById(Long id) {
        return utilityPaymentRepository.findById(id);
    }

    public Optional<UtilityPayment> getUtilityPaymentByUtilityId(Long utilityId) {
        return utilityPaymentRepository.findUtilityPaymentByUtilityId(utilityId);
    }

    public UtilityPayment updateUtilityPayment(UtilityPayment utilityPayment) {
        return utilityPaymentRepository.save(utilityPayment);
    }

    @Transactional
    public void createMonthlyUtilityPayments() {
        List<Utility> utilities = utilityRepository.findAll();
        List<UtilityPayment> payments = new ArrayList<>();

        ZonedDateTime now = ZonedDateTime.now();
        ZonedDateTime firstDayOfNextMonth = now.plusMonths(1).withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);

        for (Utility utility : utilities) {
            UtilityPayment payment = new UtilityPayment();
            payment.setUtility(utility);
            payment.setPrice(utility.getPrice());
            payment.setIsPaid(false);
            payment.setDate(firstDayOfNextMonth);  // Устанавливаем дату следующего месяца
            payments.add(payment);
        }

        utilityPaymentRepository.saveAll(payments);
        System.out.println("Создано " + payments.size() + " платежей за коммунальные услуги на " + firstDayOfNextMonth);
    }


}
