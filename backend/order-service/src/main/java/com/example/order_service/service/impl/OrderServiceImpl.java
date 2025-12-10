package com.example.order_service.service.impl;

import com.example.order_service.client.RestaurantServiceClient;
import com.example.order_service.dto.*;
import com.example.order_service.exception.OrderNotFoundException;
import com.example.order_service.model.Order;
import com.example.order_service.model.OrderItem;
import com.example.order_service.model.OrderStatus;
import com.example.order_service.repository.OrderRepository;
import com.example.order_service.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final RestaurantServiceClient restaurantServiceClient;

    @Override
    public OrderResponseDto createOrder(CreateOrderRequestDto requestDto) {
        // Validate restaurant exists
        RestaurantInfoDto restaurant = restaurantServiceClient.getRestaurantById(requestDto.getRestaurantId());

        if (Boolean.FALSE.equals(restaurant.getActive())) {
            throw new IllegalStateException("Restaurant is not accepting orders currently");
        }

        // Build Order entity
        Order order = Order.builder()
                .restaurantId(requestDto.getRestaurantId())
                .customerName(requestDto.getCustomerName())
                .customerPhone(requestDto.getCustomerPhone())
                .deliveryAddress(requestDto.getDeliveryAddress())
                .status(OrderStatus.CREATED)
                .createdAt(LocalDateTime.now())
                .totalAmount(BigDecimal.ZERO)
                .build();

        BigDecimal total = BigDecimal.ZERO;

        // For each item, fetch menu item info from restaurant-service and compute subtotal
        for (OrderItemRequestDto itemReq : requestDto.getItems()) {
            MenuItemInfoDto menuItem = restaurantServiceClient.getMenuItemForRestaurant(
                    requestDto.getRestaurantId(), itemReq.getMenuItemId());

            if (Boolean.FALSE.equals(menuItem.getAvailable())) {
                throw new IllegalStateException(
                        "Menu item " + menuItem.getItemName() + " is not available right now");
            }

            BigDecimal price = BigDecimal.valueOf(menuItem.getPrice());
            BigDecimal subTotal = price.multiply(BigDecimal.valueOf(itemReq.getQuantity()));

            OrderItem orderItem = OrderItem.builder()
                    .menuItemId(menuItem.getId())
                    .itemName(menuItem.getItemName())
                    .price(price)
                    .quantity(itemReq.getQuantity())
                    .subTotal(subTotal)
                    .build();

            order.addItem(orderItem);
            total = total.add(subTotal);
        }

        order.setTotalAmount(total);

        Order saved = orderRepository.save(order);
        return mapToResponseDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponseDto getOrderById(Long id) {
        Order order = findOrderOrThrow(id);
        return mapToResponseDto(order);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponseDto> getAllOrders() {
        return orderRepository.findAll()
                .stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponseDto> getOrdersByCustomerPhone(String phone) {
        return orderRepository.findByCustomerPhone(phone)
                .stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponseDto> getOrdersByRestaurant(Long restaurantId) {
        return orderRepository.findByRestaurantId(restaurantId)
                .stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public OrderResponseDto updateOrderStatus(Long orderId, UpdateOrderStatusRequestDto statusRequest) {
        Order order = findOrderOrThrow(orderId);
        order.setStatus(statusRequest.getStatus());
        Order updated = orderRepository.save(order);
        return mapToResponseDto(updated);
    }

    @Override
    public void deleteOrder(Long orderId) {
        Order order = findOrderOrThrow(orderId);
        orderRepository.delete(order);
    }

    // ============== Helper methods ==============

    private Order findOrderOrThrow(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with id: " + id));
    }

    private OrderResponseDto mapToResponseDto(Order order) {
        List<OrderItemResponseDto> items = order.getItems()
                .stream()
                .map(this::mapToItemResponseDto)
                .collect(Collectors.toList());

        return OrderResponseDto.builder()
                .id(order.getId())
                .restaurantId(order.getRestaurantId())
                .customerName(order.getCustomerName())
                .customerPhone(order.getCustomerPhone())
                .deliveryAddress(order.getDeliveryAddress())
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .createdAt(order.getCreatedAt())
                .items(items)
                .build();
    }

    private OrderItemResponseDto mapToItemResponseDto(OrderItem item) {
        return OrderItemResponseDto.builder()
                .id(item.getId())
                .menuItemId(item.getMenuItemId())
                .itemName(item.getItemName())
                .price(item.getPrice())
                .quantity(item.getQuantity())
                .subTotal(item.getSubTotal())
                .build();
    }
}
