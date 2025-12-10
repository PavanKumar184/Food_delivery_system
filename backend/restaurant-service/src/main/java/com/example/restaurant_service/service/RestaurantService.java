package com.example.restaurant_service.service;



import com.example.restaurant_service.dto.MenuItemDto;
import com.example.restaurant_service.dto.RestaurantRequestDto;
import com.example.restaurant_service.dto.RestaurantResponseDto;

import java.util.List;

public interface RestaurantService {

    RestaurantResponseDto createRestaurant(RestaurantRequestDto requestDto);

    RestaurantResponseDto getRestaurantById(Long id);

    List<RestaurantResponseDto> getAllRestaurants();

    List<RestaurantResponseDto> searchByCity(String city);

    List<RestaurantResponseDto> searchByCuisine(String cuisineType);

    List<RestaurantResponseDto> searchByName(String namePart);

    RestaurantResponseDto updateRestaurant(Long id, RestaurantRequestDto requestDto);

    void deleteRestaurant(Long id);

    // Menu operations
    List<MenuItemDto> getMenuForRestaurant(Long restaurantId);

    MenuItemDto addMenuItem(Long restaurantId, MenuItemDto menuItemDto);

    MenuItemDto updateMenuItem(Long restaurantId, Long menuItemId, MenuItemDto menuItemDto);

    void deleteMenuItem(Long restaurantId, Long menuItemId);
}
