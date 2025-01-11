package com.rdba.flat_manager.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class MonthlyPaymentScheduler {

    private final UtilityPaymentService utilityPaymentService;

    public MonthlyPaymentScheduler(UtilityPaymentService utilityPaymentService) {
        this.utilityPaymentService = utilityPaymentService;
    }


    @Scheduled(cron = "0 0 0 1 * ?")
//    @Scheduled(cron = "0 * * * * ?")
    public void scheduleMonthlyUtilityPayments() {
        utilityPaymentService.createMonthlyUtilityPayments();
        System.out.println("Автоматическое создание платежей выполнено: " + LocalDateTime.now());
    }
}