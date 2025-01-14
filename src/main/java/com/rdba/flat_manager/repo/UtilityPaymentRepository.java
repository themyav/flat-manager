package com.rdba.flat_manager.repo;

import com.rdba.flat_manager.entity.UtilityPayment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UtilityPaymentRepository extends JpaRepository<UtilityPayment, Long> {
    Optional<UtilityPayment> findUtilityPaymentByUtilityId(Long id);
}
