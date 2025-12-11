import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { restaurantApi } from "../api/restaurantApi";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
export default function RestaurantMenu() {
    const { id } = useParams();
    const { addItem } = useCart();
    const { showToast } = useToast();

    const [restaurant, setRestaurant] = useState(null);
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const [restaurantRes, menuRes] = await Promise.all([
                    restaurantApi.getRestaurant(id),
                    restaurantApi.getMenu(id),
                ]);

                setRestaurant(restaurantRes.data);
                setMenu(menuRes.data);
            } catch (err) {
                console.error("Failed to load menu", err);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [id]);

    if (loading) {
        return (
            <p className="text-gray-600 text-center mt-10">Loading restaurant...</p>
        );
    }

    if (!restaurant) {
        return (
            <div className="max-w-xl mx-auto mt-10 bg-white p-6 shadow rounded-xl text-center border">
                <h2 className="text-xl font-semibold mb-2">Restaurant Not Found</h2>
                <p className="text-gray-600">Try going back to the home page.</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Restaurant Header Card */}
            <div className="bg-white shadow-md border rounded-xl p-5">
                <h1 className="text-2xl font-semibold text-gray-800">{restaurant.name}</h1>
                <p className="text-gray-600 text-sm mt-1">
                    {restaurant.cuisineType || "Cuisine"} • {restaurant.city}
                </p>
                <p className="text-gray-500 text-xs mt-1">{restaurant.address}</p>
            </div>

            {/* Menu List */}
            <div className="bg-white shadow-md border rounded-xl p-5">
                <h2 className="text-xl font-semibold mb-3 text-gray-800">Available Dishes</h2>

                {menu.length === 0 ? (
                    <p className="text-gray-600">No menu items available.</p>
                ) : (
                    <div className="space-y-4">
                        {menu.map((item) => (
                            <div
                                key={item.id}
                                className="flex justify-between items-start border-b pb-3 last:border-b-0"
                            >
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">
                                        {item.itemName}
                                    </h3>
                                    {item.description && (
                                        <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                                    )}
                                </div>

                                <div className="text-right">
                                    <p className="text-lg font-semibold text-blue-700">
                                        ₹{item.price}
                                    </p>
                                    <button
                                        onClick={() => {addItem(item, restaurant)
                                        showToast("Item added to cart");
                                        }}

                                        className="mt-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 transition"
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}