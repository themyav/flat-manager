package com.rdba.flat_manager.service;

import com.rdba.flat_manager.entity.Flat;
import com.rdba.flat_manager.entity.Utility;
import com.rdba.flat_manager.entity.UtilityPayment;
import com.rdba.flat_manager.repo.FlatRepository;
import com.rdba.flat_manager.repo.UtilityPaymentRepository;
import com.rdba.flat_manager.repo.UtilityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class StatisticsService {

    @Autowired
    private UtilityPaymentRepository utilityPaymentRepository;
    @Autowired
    private UtilityRepository utilityRepository;
    @Autowired
    private FlatRepository flatRepository;


    public Map<String, Object> getPaymentStatus(Long flatId, ZonedDateTime startDate, ZonedDateTime endDate) {
        Flat flat = flatRepository.findById(flatId).orElse(null);
        List<Utility> utilities = utilityRepository.findAllByFlat(flat);

        List<UtilityPayment> payments = utilityPaymentRepository.findUtilityPaymentsByDateBetweenAndUtilityIn(startDate, endDate, utilities);

        Map<String, List<UtilityPayment>> groupedByMonth = payments.stream()
                .collect(Collectors.groupingBy(payment ->
                        payment.getDate().getYear() + "-" +
                                String.format("%02d", payment.getDate().getMonth().getValue())
                ));

        Map<String, Object> stats = new HashMap<>();
        groupedByMonth.forEach((month, monthPayments) -> {
            Map<String, Object> monthStats = new HashMap<>();

            Map<String, Integer> totalAmountByUtility = monthPayments.stream()
                    .collect(Collectors.groupingBy(
                            p -> p.getUtility().getName(),
                            Collectors.summingInt(UtilityPayment::getPrice)
                    ));

            Map<String, Long> paidCountByUtility = monthPayments.stream()
                    .filter(UtilityPayment::getIsPaid)
                    .collect(Collectors.groupingBy(
                            p -> p.getUtility().getName(),
                            Collectors.counting()
                    ));

            Map<String, Long> unpaidCountByUtility = monthPayments.stream()
                    .filter(p -> !p.getIsPaid())
                    .collect(Collectors.groupingBy(
                            p -> p.getUtility().getName(),
                            Collectors.counting()
                    ));



            monthStats.put("totalAmountByUtility", totalAmountByUtility);
            monthStats.put("paidCountByUtility", paidCountByUtility);
            monthStats.put("unpaidCountByUtility", unpaidCountByUtility);
            monthStats.put("totalAmount", monthPayments.stream().mapToInt(UtilityPayment::getPrice).sum());
            monthStats.put("paidCount", monthPayments.stream().filter(UtilityPayment::getIsPaid).count());
            long a = monthPayments.size() - monthPayments.stream().filter(UtilityPayment::getIsPaid).count();
            monthStats.put("unpaidCount", a);

            stats.put(month, monthStats);
        });

        return stats;
    }

    public Map<String, List<Map<String, Object>>> getPriceHistory(Long flatId, ZonedDateTime startDate, ZonedDateTime endDate) {
        Flat flat = flatRepository.findById(flatId).orElse(null);
        List<Utility> utilities = utilityRepository.findAllByFlat(flat);

        List<UtilityPayment> payments = utilityPaymentRepository.findUtilityPaymentsByDateBetweenAndUtilityIn(startDate, endDate, utilities);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");

        Map<String, List<Map<String, Object>>> priceHistory = new HashMap<>();

        payments.stream()
                .collect(Collectors.groupingBy(payment -> payment.getUtility().getName()))
                .forEach((utilityName, utilityPayments) -> {
                    List<Map<String, Object>> history = utilityPayments.stream()
                            .map(payment -> Map.<String, Object>of(
                                    "date", payment.getDate().format(formatter),
                                    "price", payment.getPrice(),
                                    "isPaid", payment.getIsPaid()
                            ))
                            .sorted(Comparator.comparing(map -> (String) map.get("date")))
                            .toList();

                    priceHistory.put(utilityName, history);
                });

        return priceHistory;
    }

}
