import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { restaurantApi } from "../api/restaurantApi";
import { useCart } from "../context/CartContext";

export default function RestaurantMenu() {
    const { id } = useParams();
    const { addItem } = useCart();

    const [restaurant, setRestaurant] = useState(null);
    const [menu, setMenu] = useState([]);

    useEffect(() => {
        restaurantApi.getRestaurant(id).then((res) => setRestaurant(res.data));
        restaurantApi.getMenu(id).then((res) => setMenu(res.data));
    }, [id]);

    if (!restaurant) return <p className="p-6">Loading...</p>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
            <p className="text-gray-600 mb-4">{restaurant.cuisineType} • {restaurant.city}</p>

            <hr className="mb-6" />

            <h2 className="text-2xl font-semibold mb-4">Menu</h2>
            <div className="space-y-4">
                {menu.map((item) => (
                    <div key={item.id} className="bg-white p-4 rounded-xl border shadow flex justify-between">
                        <div>
                            <h3 className="text-lg font-bold">{item.itemName}</h3>
                            <p className="text-gray-500">{item.description}</p>
                        </div>

                        <div className="text-right">
                            <p className="font-bold text-lg">₹{item.price}</p>
                            <button
                                onClick={() => addItem(item, restaurant)}
                                className="bg-green-600 text-white px-4 py-1 rounded mt-2"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                ))}

                {menu.length === 0 && <p>No items available.</p>}
            </div>
        </div>
    );
}
