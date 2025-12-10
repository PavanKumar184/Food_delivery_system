package com.example.order_service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateOrderRequestDto {

    @NotNull(message = "restaurantId is required")
    private Long restaurantId;

    @NotBlank(message = "customerName is required")
    private String customerName;

    @NotBlank(message = "customerPhone is required")
    @Pattern(regexp = "^[0-9+\\-]{8,15}$", message = "Invalid phone number")
    private String customerPhone;

    @NotBlank(message = "deliveryAddress is required")
    private String deliveryAddress;

    @NotNull(message = "items are required")
    private List<OrderItemRequestDto> items;
}
