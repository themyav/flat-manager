package com.rdba.flat_manager.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UtilityUpdateDTO {
    private String name;
    private Integer price;
    private String date;
    private Long flatId;
}
