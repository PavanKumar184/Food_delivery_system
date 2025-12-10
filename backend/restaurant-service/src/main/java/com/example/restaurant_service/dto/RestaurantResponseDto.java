package com.example.restaurant_service.dto;


import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantResponseDto {

    private Long id;
    private String name;
    private String address;
    private String city;
    private String cuisineType;
    private String contactNumber;
    private Boolean active;

    private List<MenuItemDto> menuItems;
}
