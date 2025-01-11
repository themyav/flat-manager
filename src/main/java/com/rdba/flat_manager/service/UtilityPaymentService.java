package com.rdba.flat_manager.service;

import com.rdba.flat_manager.entity.Utility;
import com.rdba.flat_manager.entity.UtilityPayment;
import com.rdba.flat_manager.repo.UtilityPaymentRepository;
import com.rdba.flat_manager.repo.UtilityRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UtilityPaymentService {
    private final UtilityPaymentRepository utilityPaymentRepository;

    public UtilityPaymentService(UtilityPaymentRepository utilityPaymentRepository) {
        this.utilityPaymentRepository = utilityPaymentRepository;
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

}
