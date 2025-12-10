package com.example.restaurant_service.controller;



import com.example.restaurant_service.dto.MenuItemDto;
import com.example.restaurant_service.dto.RestaurantRequestDto;
import com.example.restaurant_service.dto.RestaurantResponseDto;
import com.example.restaurant_service.service.RestaurantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
@RequiredArgsConstructor
public class RestaurantController {

    private final RestaurantService restaurantService;

    // ========== Restaurant CRUD ==========

    @PostMapping
    public ResponseEntity<RestaurantResponseDto> createRestaurant(
            @Valid @RequestBody RestaurantRequestDto requestDto) {
        return ResponseEntity.ok(restaurantService.createRestaurant(requestDto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RestaurantResponseDto> getRestaurant(@PathVariable Long id) {
        return ResponseEntity.ok(restaurantService.getRestaurantById(id));
    }

    @GetMapping
    public ResponseEntity<List<RestaurantResponseDto>> getAllRestaurants(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String cuisine,
            @RequestParam(required = false) String name
    ) {
        if (city != null) {
            return ResponseEntity.ok(restaurantService.searchByCity(city));
        } else if (cuisine != null) {
            return ResponseEntity.ok(restaurantService.searchByCuisine(cuisine));
        } else if (name != null) {
            return ResponseEntity.ok(restaurantService.searchByName(name));
        } else {
            return ResponseEntity.ok(restaurantService.getAllRestaurants());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<RestaurantResponseDto> updateRestaurant(
            @PathVariable Long id,
            @Valid @RequestBody RestaurantRequestDto requestDto) {
        return ResponseEntity.ok(restaurantService.updateRestaurant(id, requestDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRestaurant(@PathVariable Long id) {
        restaurantService.deleteRestaurant(id);
        return ResponseEntity.noContent().build();
    }

    // ========== Menu operations ==========

    @GetMapping("/{restaurantId}/menu")
    public ResponseEntity<List<MenuItemDto>> getMenu(@PathVariable Long restaurantId) {
        return ResponseEntity.ok(restaurantService.getMenuForRestaurant(restaurantId));
    }

    @PostMapping("/{restaurantId}/menu")
    public ResponseEntity<MenuItemDto> addMenuItem(
            @PathVariable Long restaurantId,
            @Valid @RequestBody MenuItemDto menuItemDto) {
        return ResponseEntity.ok(restaurantService.addMenuItem(restaurantId, menuItemDto));
    }

    @PutMapping("/{restaurantId}/menu/{menuItemId}")
    public ResponseEntity<MenuItemDto> updateMenuItem(
            @PathVariable Long restaurantId,
            @PathVariable Long menuItemId,
            @Valid @RequestBody MenuItemDto menuItemDto) {
        return ResponseEntity.ok(restaurantService.updateMenuItem(restaurantId, menuItemId, menuItemDto));
    }

    @DeleteMapping("/{restaurantId}/menu/{menuItemId}")
    public ResponseEntity<Void> deleteMenuItem(
            @PathVariable Long restaurantId,
            @PathVariable Long menuItemId) {
        restaurantService.deleteMenuItem(restaurantId, menuItemId);
        return ResponseEntity.noContent().build();
    }
}

