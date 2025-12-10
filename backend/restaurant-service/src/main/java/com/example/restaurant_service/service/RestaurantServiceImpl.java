package com.example.restaurant_service.service;



import com.example.restaurant_service.dto.MenuItemDto;
import com.example.restaurant_service.dto.RestaurantRequestDto;
import com.example.restaurant_service.dto.RestaurantResponseDto;
import com.example.restaurant_service.exception.MenuItemNotFoundException;
import com.example.restaurant_service.exception.RestaurantNotFoundException;
import com.example.restaurant_service.model.MenuItem;
import com.example.restaurant_service.model.Restaurant;
import com.example.restaurant_service.repository.MenuItemRepository;
import com.example.restaurant_service.repository.RestaurantRepository;
import com.example.restaurant_service.service.RestaurantService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class RestaurantServiceImpl implements RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final MenuItemRepository menuItemRepository;

    @Override
    public RestaurantResponseDto createRestaurant(RestaurantRequestDto requestDto) {
        Restaurant restaurant = mapToEntity(requestDto);
        if (requestDto.getMenuItems() != null) {
            requestDto.getMenuItems().forEach(itemDto -> {
                MenuItem item = mapToEntity(itemDto);
                restaurant.addMenuItem(item);
            });
        }
        Restaurant saved = restaurantRepository.save(restaurant);
        return mapToResponseDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public RestaurantResponseDto getRestaurantById(Long id) {
        Restaurant restaurant = findRestaurantOrThrow(id);
        return mapToResponseDto(restaurant);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RestaurantResponseDto> getAllRestaurants() {
        return restaurantRepository.findAll()
                .stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<RestaurantResponseDto> searchByCity(String city) {
        return restaurantRepository.findByCityIgnoreCase(city)
                .stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<RestaurantResponseDto> searchByCuisine(String cuisineType) {
        return restaurantRepository.findByCuisineTypeIgnoreCase(cuisineType)
                .stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<RestaurantResponseDto> searchByName(String namePart) {
        return restaurantRepository.findByNameContainingIgnoreCase(namePart)
                .stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public RestaurantResponseDto updateRestaurant(Long id, RestaurantRequestDto requestDto) {
        Restaurant restaurant = findRestaurantOrThrow(id);
        restaurant.setName(requestDto.getName());
        restaurant.setAddress(requestDto.getAddress());
        restaurant.setCity(requestDto.getCity());
        restaurant.setCuisineType(requestDto.getCuisineType());
        restaurant.setContactNumber(requestDto.getContactNumber());
        restaurant.setActive(requestDto.getActive());

        // We are not updating menu here to keep it explicit via the menu API
        Restaurant updated = restaurantRepository.save(restaurant);
        return mapToResponseDto(updated);
    }

    @Override
    public void deleteRestaurant(Long id) {
        Restaurant restaurant = findRestaurantOrThrow(id);
        restaurantRepository.delete(restaurant);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MenuItemDto> getMenuForRestaurant(Long restaurantId) {
        findRestaurantOrThrow(restaurantId); // ensure exists
        return menuItemRepository.findByRestaurantId(restaurantId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public MenuItemDto addMenuItem(Long restaurantId, MenuItemDto menuItemDto) {
        Restaurant restaurant = findRestaurantOrThrow(restaurantId);
        MenuItem item = mapToEntity(menuItemDto);
        restaurant.addMenuItem(item);
        MenuItem saved = menuItemRepository.save(item);
        return mapToDto(saved);
    }

    @Override
    public MenuItemDto updateMenuItem(Long restaurantId, Long menuItemId, MenuItemDto menuItemDto) {
        Restaurant restaurant = findRestaurantOrThrow(restaurantId);
        MenuItem item = menuItemRepository.findById(menuItemId)
                .orElseThrow(() -> new MenuItemNotFoundException("Menu item not found with id: " + menuItemId));

        if (!item.getRestaurant().getId().equals(restaurant.getId())) {
            throw new MenuItemNotFoundException("Menu item does not belong to this restaurant");
        }

        item.setItemName(menuItemDto.getItemName());
        item.setPrice(menuItemDto.getPrice());
        item.setDescription(menuItemDto.getDescription());
        item.setAvailable(menuItemDto.getAvailable());

        MenuItem updated = menuItemRepository.save(item);
        return mapToDto(updated);
    }

    @Override
    public void deleteMenuItem(Long restaurantId, Long menuItemId) {
        Restaurant restaurant = findRestaurantOrThrow(restaurantId);
        MenuItem item = menuItemRepository.findById(menuItemId)
                .orElseThrow(() -> new MenuItemNotFoundException("Menu item not found with id: " + menuItemId));

        if (!item.getRestaurant().getId().equals(restaurant.getId())) {
            throw new MenuItemNotFoundException("Menu item does not belong to this restaurant");
        }

        restaurant.removeMenuItem(item);
        menuItemRepository.delete(item);
    }

    // ==================== Helper methods ====================

    private Restaurant findRestaurantOrThrow(Long id) {
        return restaurantRepository.findById(id)
                .orElseThrow(() -> new RestaurantNotFoundException("Restaurant not found with id: " + id));
    }

    private Restaurant mapToEntity(RestaurantRequestDto dto) {
        return Restaurant.builder()
                .name(dto.getName())
                .address(dto.getAddress())
                .city(dto.getCity())
                .cuisineType(dto.getCuisineType())
                .contactNumber(dto.getContactNumber())
                .active(dto.getActive())
                .build();
    }

    private MenuItem mapToEntity(MenuItemDto dto) {
        return MenuItem.builder()
                .itemName(dto.getItemName())
                .price(dto.getPrice())
                .description(dto.getDescription())
                .available(dto.getAvailable())
                .build();
    }

    private RestaurantResponseDto mapToResponseDto(Restaurant restaurant) {
        List<MenuItemDto> menuItemDtos = restaurant.getMenuItems()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        return RestaurantResponseDto.builder()
                .id(restaurant.getId())
                .name(restaurant.getName())
                .address(restaurant.getAddress())
                .city(restaurant.getCity())
                .cuisineType(restaurant.getCuisineType())
                .contactNumber(restaurant.getContactNumber())
                .active(restaurant.getActive())
                .menuItems(menuItemDtos)
                .build();
    }

    private MenuItemDto mapToDto(MenuItem item) {
        return MenuItemDto.builder()
                .id(item.getId())
                .itemName(item.getItemName())
                .price(item.getPrice())
                .description(item.getDescription())
                .available(item.getAvailable())
                .build();
    }
}
