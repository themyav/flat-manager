package com.rdba.flat_manager.controller;

import com.rdba.flat_manager.dto.FlatUpdateDTO;
import com.rdba.flat_manager.entity.Flat;
import com.rdba.flat_manager.entity.Utility;
import com.rdba.flat_manager.entity.UtilityPayment;
import com.rdba.flat_manager.service.FlatService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/flats")
@Tag(name = "Flat API", description = "Контроллер управления квартирами")
public class FlatController {
    @Autowired
    private final FlatService flatService;

    public FlatController(FlatService flatService) {
        this.flatService = flatService;
    }

    @GetMapping
    @ResponseStatus(HttpStatus.CREATED)
    public List<Flat> getFlats() {
        return flatService.getAllFlats();
    }


    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Flat createFlat(@RequestBody Flat flat) {
        return flatService.createFlat(flat);
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Optional<Flat> getFlatById(@PathVariable Long id) {
        return flatService.getFlatById(id);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Flat updateFlatById(@PathVariable Long id, @RequestBody FlatUpdateDTO flat) {
        return flatService.updateFlat(id, flat);
    }

    @GetMapping("/utilities/{id}")
    @ResponseStatus(HttpStatus.OK)
    public List<Utility> getUtilitiesByFlatId(@PathVariable Long id) {
        return flatService.getUtilitiesByFlatId(id);
    }

    @GetMapping("/utilities/payments/{id}")
    @ResponseStatus(HttpStatus.OK)
    public List<UtilityPayment> getUtilityPayments(@PathVariable Long id, @RequestParam final String date) {
        return flatService.getUtilityPaymentsByFlatId(id, date);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public void deleteFlatById(@PathVariable Long id) {
        flatService.deleteFlatById(id);
    }
}
