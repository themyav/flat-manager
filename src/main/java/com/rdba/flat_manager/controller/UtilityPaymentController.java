package com.rdba.flat_manager.controller;

import com.rdba.flat_manager.entity.UtilityPayment;
import com.rdba.flat_manager.service.UtilityPaymentService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/utility-payments")
public class UtilityPaymentController {
    private final UtilityPaymentService utilityPaymentService;

    public UtilityPaymentController(UtilityPaymentService utilityPaymentService) {
        this.utilityPaymentService = utilityPaymentService;
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<UtilityPayment> getAllFlats() {
        return utilityPaymentService.getAllUtilityPayments();
    }

    @GetMapping("/date")
    @ResponseStatus(HttpStatus.OK)
    public List<UtilityPayment> getFlatsByDate(@RequestParam final String date) {
        return utilityPaymentService.getAllUtilityPaymentsByDate(date);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UtilityPayment createFlat(@RequestBody UtilityPayment utility) {
        return utilityPaymentService.createUtilityPayment(utility);
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Optional<UtilityPayment> getFlatById(@PathVariable Long id) {
        return utilityPaymentService.getUtilityPaymentById(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public void deleteFlatById(@PathVariable Long id) {
        utilityPaymentService.deleteUtilityPaymentById(id);
    }
}
