package com.example.order_service.service;

import com.example.order_service.dto.CreateOrderRequestDto;
import com.example.order_service.dto.OrderResponseDto;
import com.example.order_service.dto.UpdateOrderStatusRequestDto;

import java.util.List;

public interface OrderService {

    OrderResponseDto createOrder(CreateOrderRequestDto requestDto);

    OrderResponseDto getOrderById(Long id);

    List<OrderResponseDto> getAllOrders();

    List<OrderResponseDto> getOrdersByCustomerPhone(String phone);

    List<OrderResponseDto> getOrdersByRestaurant(Long restaurantId);

    OrderResponseDto updateOrderStatus(Long orderId, UpdateOrderStatusRequestDto statusRequest);

    void deleteOrder(Long orderId);
}
