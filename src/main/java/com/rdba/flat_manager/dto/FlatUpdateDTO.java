package com.rdba.flat_manager.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FlatUpdateDTO {
    private String name;
    private String address;
    private Long userId;
}
