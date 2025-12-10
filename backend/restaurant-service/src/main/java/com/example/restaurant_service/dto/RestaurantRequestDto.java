package com.example.restaurant_service.dto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantRequestDto {

    @NotBlank(message = "Restaurant name is required")
    private String name;

    @NotBlank(message = "Address is required")
    private String address;

    private String city;

    @NotBlank(message = "Cuisine type is required")
    private String cuisineType;

    @NotBlank(message = "Contact number is required")
    @Pattern(regexp = "^[0-9+\\-]{8,15}$", message = "Invalid contact number format")
    private String contactNumber;

    private Boolean active = true;

    // Optional: create restaurant along with menu items
    private List<MenuItemDto> menuItems;
}
