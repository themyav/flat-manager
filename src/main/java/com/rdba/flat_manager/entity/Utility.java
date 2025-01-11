package com.rdba.flat_manager.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;

@Entity
@Table(name = "utility")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Utility {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column
    private String name;
    @Column
    private Integer price;
    @Column
    private ZonedDateTime date;
    @ManyToOne
    @JoinColumn(name = "flat_id")
    private Flat flat;
}
