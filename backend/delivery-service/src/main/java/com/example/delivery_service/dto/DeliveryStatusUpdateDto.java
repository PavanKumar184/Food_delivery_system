package com.example.delivery_service.dto;

import com.example.delivery_service.model.DeliveryStatus;
import lombok.Data;

@Data
public class DeliveryStatusUpdateDto {
    private DeliveryStatus status;
}
