package com.example.order_service.controller;

import com.example.order_service.dto.CreateOrderRequestDto;
import com.example.order_service.dto.OrderResponseDto;
import com.example.order_service.dto.UpdateOrderStatusRequestDto;
import com.example.order_service.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderResponseDto> createOrder(
            @Valid @RequestBody CreateOrderRequestDto requestDto) {
        return ResponseEntity.ok(orderService.createOrder(requestDto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponseDto> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @GetMapping
    public ResponseEntity<List<OrderResponseDto>> getOrders(
            @RequestParam(required = false) String customerPhone,
            @RequestParam(required = false) Long restaurantId
    ) {
        if (customerPhone != null) {
            return ResponseEntity.ok(orderService.getOrdersByCustomerPhone(customerPhone));
        } else if (restaurantId != null) {
            return ResponseEntity.ok(orderService.getOrdersByRestaurant(restaurantId));
        } else {
            return ResponseEntity.ok(orderService.getAllOrders());
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<OrderResponseDto> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateOrderStatusRequestDto statusRequest) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, statusRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }
}
