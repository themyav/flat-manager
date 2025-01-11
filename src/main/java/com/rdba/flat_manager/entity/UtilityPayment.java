package com.rdba.flat_manager.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;

@Entity
@Table(name = "utilityPayment")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UtilityPayment {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(name = "payment_url")
    private String paymentUrl;
    @Column
    private Integer price;
    @Column(name = "id_paid")
    private Boolean isPaid;
    @Column
    private ZonedDateTime date;
    @ManyToOne
    @JoinColumn(name = "utility_id")
    private Utility utility;
}
