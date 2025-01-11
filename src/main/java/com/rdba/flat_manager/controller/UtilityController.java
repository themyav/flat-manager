package com.rdba.flat_manager.controller;

import com.rdba.flat_manager.dto.UtilityUpdateDTO;
import com.rdba.flat_manager.entity.User;
import com.rdba.flat_manager.entity.Utility;
import com.rdba.flat_manager.service.UtilityService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/utilities")
@Tag(name = "Utility API", description = "Контроллер управления услугами")
public class UtilityController {
    @Autowired
    private final UtilityService utilityService;

    public UtilityController(UtilityService utilityService) {
        this.utilityService = utilityService;
    }

    @GetMapping
    @ResponseStatus(HttpStatus.CREATED)
    public List<Utility> createFlat() {
        return utilityService.getAllUtilities();
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

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Utility deleteFlatById(@PathVariable Long id, @RequestBody UtilityUpdateDTO utility) {
        return utilityService.updateUtility(id, utility);
    }
}
