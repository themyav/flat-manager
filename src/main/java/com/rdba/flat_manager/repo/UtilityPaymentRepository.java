package com.rdba.flat_manager.repo;

import com.rdba.flat_manager.entity.Utility;
import com.rdba.flat_manager.entity.UtilityPayment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

public interface UtilityPaymentRepository extends JpaRepository<UtilityPayment, Long> {

    Optional<UtilityPayment> findUtilityPaymentByUtilityId(Long id);

    List<UtilityPayment> findUtilityPaymentsByDateBetweenAndUtility(
            ZonedDateTime startDate,
            ZonedDateTime endDate,
            Utility utility
    );


    List<UtilityPayment> findUtilityPaymentsByDateBetweenAndUtilityIn(
            ZonedDateTime startDate,
            ZonedDateTime endDate,
            List<Utility> utilities
    );
}