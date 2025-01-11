package com.rdba.flat_manager.service;

import com.rdba.flat_manager.entity.Utility;
import com.rdba.flat_manager.entity.UtilityPayment;
import com.rdba.flat_manager.repo.UtilityPaymentRepository;
import com.rdba.flat_manager.repo.UtilityRepository;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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
            payment.setPaymentUrl(generatePaymentUrl(utility));  // Генерация ссылки на оплату (опционально)

            payments.add(payment);
        }

        utilityPaymentRepository.saveAll(payments);
        System.out.println("Создано " + payments.size() + " платежей за коммунальные услуги на " + firstDayOfNextMonth);
    }


    //TODO: изменить
    private String generatePaymentUrl(Utility utility) {
        return "https://payment.service.com/pay?utilityId=" + utility.getId();
    }

}
