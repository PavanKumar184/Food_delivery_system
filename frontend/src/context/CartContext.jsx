import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [restaurant, setRestaurant] = useState(null); // the restaurant user selected
    const [items, setItems] = useState([]); // cart items

    // Add item to cart
    function addItem(menuItem, selectedRestaurant) {
        // If user changes restaurant, reset cart
        if (restaurant && restaurant.id !== selectedRestaurant.id) {
            if (!window.confirm("Your cart has items from another restaurant. Clear cart?")) {
                return;
            }
            setItems([]);
        }

        setRestaurant(selectedRestaurant);

        setItems((prev) => {
            const existing = prev.find((item) => item.menuItemId === menuItem.id);

            if (existing) {
                return prev.map((item) =>
                    item.menuItemId === menuItem.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            return [
                ...prev,
                {
                    menuItemId: menuItem.id,
                    itemName: menuItem.itemName,
                    price: menuItem.price,
                    quantity: 1,
                },
            ];
        });
    }

    function removeItem(menuItemId) {
        setItems((prev) => prev.filter((item) => item.menuItemId !== menuItemId));
    }

    function updateQuantity(menuItemId, quantity) {
        if (quantity <= 0) {
            removeItem(menuItemId);
            return;
        }

        setItems((prev) =>
            prev.map((item) =>
                item.menuItemId === menuItemId ? { ...item, quantity } : item
            )
        );
    }

    function clearCart() {
        setRestaurant(null);
        setItems([]);
    }

    return (
        <CartContext.Provider
            value={{
                restaurant,
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}
