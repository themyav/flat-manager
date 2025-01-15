package com.rdba.flat_manager.repo;

import com.rdba.flat_manager.entity.Flat;
import com.rdba.flat_manager.entity.Utility;
import com.rdba.flat_manager.entity.UtilityPayment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.ZonedDateTime;
import java.util.List;

public interface UtilityRepository extends JpaRepository<Utility, Long> {
    Utility findByFlat(Flat flat);

    List<Utility> findAllByFlat(Flat flat);

    List<Utility> findUtilitiesByDateBetween(ZonedDateTime from, ZonedDateTime to);
}
