package com.example.order_service.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MenuItemInfoDto {

    private Long id;
    private String itemName;
    private Double price;
    private String description;
    private Boolean available;
}
