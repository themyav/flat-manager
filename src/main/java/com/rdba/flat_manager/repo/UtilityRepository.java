package com.rdba.flat_manager.repo;

import com.rdba.flat_manager.entity.Flat;
import com.rdba.flat_manager.entity.Utility;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UtilityRepository extends JpaRepository<Utility, Long> {
    Utility findByFlat(Flat flat);

    List<Utility> findAllByFlat(Flat flat);
}
