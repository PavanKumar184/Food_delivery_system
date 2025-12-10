package com.example.order_service.client;

import com.example.order_service.dto.MenuItemInfoDto;
import com.example.order_service.dto.RestaurantInfoDto;
import com.example.order_service.exception.MenuItemNotFoundException;
import com.example.order_service.exception.RestaurantNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class RestaurantServiceClient {

    private final RestTemplate restTemplate;

    @Value("${restaurant.service.base-url}")
    private String restaurantServiceBaseUrl;

    public RestaurantInfoDto getRestaurantById(Long restaurantId) {
        String url = restaurantServiceBaseUrl + "/api/restaurants/" + restaurantId;
        try {
            return restTemplate.getForObject(url, RestaurantInfoDto.class);
        } catch (HttpClientErrorException.NotFound e) {
            throw new RestaurantNotFoundException("Restaurant not found with id: " + restaurantId);
        }
    }

    @SuppressWarnings("unchecked")
    public List<MenuItemInfoDto> getMenuForRestaurant(Long restaurantId) {
        String url = restaurantServiceBaseUrl + "/api/restaurants/" + restaurantId + "/menu";
        try {
            MenuItemInfoDto[] response = restTemplate.getForObject(url, MenuItemInfoDto[].class);
            return response != null ? Arrays.asList(response) : List.of();
        } catch (HttpClientErrorException.NotFound e) {
            throw new RestaurantNotFoundException("Restaurant or menu not found for restaurantId: " + restaurantId);
        }
    }

    public MenuItemInfoDto getMenuItemForRestaurant(Long restaurantId, Long menuItemId) {
        List<MenuItemInfoDto> menu = getMenuForRestaurant(restaurantId);
        return menu.stream()
                .filter(item -> item.getId().equals(menuItemId))
                .findFirst()
                .orElseThrow(() -> new MenuItemNotFoundException(
                        "Menu item with id " + menuItemId + " not found for restaurant " + restaurantId
                ));
    }
}
