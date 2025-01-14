package com.rdba.flat_manager.dto;

import com.rdba.flat_manager.entity.Flat;
import lombok.Data;

import java.time.ZonedDateTime;

@Data
public class UtilityDTO {
    private String name;
    private Integer price;
    private ZonedDateTime date;
    private String paymentUrl;
    private Flat flat;
}
