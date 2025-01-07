package com.rdba.flat_manager.controller;

import com.rdba.flat_manager.entity.Utility;
import com.rdba.flat_manager.service.UtilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/utilities")
public class UtilityController {
    @Autowired
    private final UtilityService utilityService;

    public UtilityController(UtilityService utilityService) {
        this.utilityService = utilityService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Utility createFlat(@RequestBody Utility utility) {
        return utilityService.createUtility(utility);
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Optional<Utility> getFlatById(@PathVariable Long id) {
        return utilityService.getUtilityById(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public void deleteFlatById(@PathVariable Long id) {
        utilityService.deleteUtilityById(id);
    }
}
