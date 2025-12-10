package com.example.delivery_service.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AgentRequestDto {

    @NotBlank
    private String name;

    @NotBlank
    private String phone;

    @NotBlank
    private String vehicleNumber;
}
