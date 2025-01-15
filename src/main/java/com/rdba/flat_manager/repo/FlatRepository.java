package com.rdba.flat_manager.repo;

import com.rdba.flat_manager.entity.Flat;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FlatRepository extends JpaRepository<Flat, Long> {
}
