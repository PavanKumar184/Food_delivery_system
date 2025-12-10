package com.example.delivery_service.service.impl;

import com.example.delivery_service.dto.DeliveryRequestDto;
import com.example.delivery_service.dto.DeliveryStatusUpdateDto;
import com.example.delivery_service.model.Delivery;
import com.example.delivery_service.model.DeliveryStatus;
import com.example.delivery_service.repository.DeliveryRepository;
import com.example.delivery_service.service.DeliveryService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DeliveryServiceImpl implements DeliveryService {

    private final DeliveryRepository deliveryRepository;

    @Override
    public Delivery createDelivery(DeliveryRequestDto request) {
        Delivery delivery = Delivery.builder()
                .orderId(request.getOrderId())
                .customerName(request.getCustomerName())
                .customerPhone(request.getCustomerPhone())
                .deliveryAddress(request.getDeliveryAddress())
                .status(DeliveryStatus.ASSIGNED)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return deliveryRepository.save(delivery);
    }

    @Override
    public Delivery getDelivery(Long id) {
        return deliveryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Delivery not found"));
    }

    @Override
    public List<Delivery> getAllDeliveries() {
        return deliveryRepository.findAll();
    }

    @Override
    public Delivery updateStatus(Long id, DeliveryStatusUpdateDto statusDto) {
        Delivery delivery = getDelivery(id);
        delivery.setStatus(statusDto.getStatus());
        delivery.setUpdatedAt(LocalDateTime.now());
        return deliveryRepository.save(delivery);
    }

    @Override
    public void deleteDelivery(Long id) {
        deliveryRepository.deleteById(id);
    }
}
