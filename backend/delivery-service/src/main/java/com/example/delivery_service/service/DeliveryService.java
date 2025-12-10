package com.example.delivery_service.service;

import com.example.delivery_service.dto.DeliveryRequestDto;
import com.example.delivery_service.dto.DeliveryStatusUpdateDto;
import com.example.delivery_service.model.Delivery;

import java.util.List;

public interface DeliveryService {

    Delivery createDelivery(DeliveryRequestDto request);

    Delivery getDelivery(Long id);

    List<Delivery> getAllDeliveries();

    Delivery updateStatus(Long id, DeliveryStatusUpdateDto statusDto);

    void deleteDelivery(Long id);
}
