package com.rdba.flat_manager.controller;

import com.rdba.flat_manager.entity.UtilityPayment;
import com.rdba.flat_manager.service.StatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stats")
public class StatisticsController {

    @Autowired
    private StatisticsService statisticsService;

    @GetMapping("/pyament-status/{flat_id}")
    public ResponseEntity<?> getPaymentStatus(
            @PathVariable("flat_id") Long flatId,
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate) {
        ZoneId zoneId = ZoneId.systemDefault();
        ZonedDateTime start = parseStringToZonedDateTime(startDate, zoneId);
        ZonedDateTime end = parseStringToZonedDateTime(endDate, zoneId);

        Map<String, Object> stats = statisticsService.getPaymentStatus(flatId, start, end);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/price-history/{flat_id}")
    public ResponseEntity<?> getPriceHistory(
            @PathVariable("flat_id") Long flatId,
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate) {
        ZoneId zoneId = ZoneId.systemDefault();
        ZonedDateTime start = parseStringToZonedDateTime(startDate, zoneId);
        ZonedDateTime end = parseStringToZonedDateTime(endDate, zoneId);

        Map<String, List<Map<String, Object>>> stats = statisticsService.getPriceHistory(flatId, start, end);
        return ResponseEntity.ok(stats);
    }

    public static ZonedDateTime parseStringToZonedDateTime(String dateString, ZoneId zoneId) {
        String[] parts = dateString.split("-");
        if (parts.length != 2) {
            throw new IllegalArgumentException("Неверный формат строки даты. Ожидается 'yyyy-MM'.");
        }
        int year = Integer.parseInt(parts[0]);
        int month = Integer.parseInt(parts[1]);
        LocalDate localDate = LocalDate.of(year, month, 1);
        return localDate.atStartOfDay(zoneId);
    }

}
