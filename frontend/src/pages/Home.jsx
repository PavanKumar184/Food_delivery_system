import { useEffect, useState } from "react";
import { restaurantApi } from "../api/restaurantApi";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function load() {
            try {
                const res = await restaurantApi.getRestaurants();
                setRestaurants(res.data);
            } catch (err) {
                console.error("Failed to load restaurants", err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    return (
        <div className="max-w-6xl mx-auto">
            {/* Page Title */}
            <div className="mb-6">
                <h2 className="text-3xl font-semibold text-gray-800">
                    Discover Restaurants
                </h2>
                <p className="text-gray-600 mt-1">
                    Browse and order delicious food from nearby restaurants.
                </p>
            </div>

            {/* Loading State */}
            {loading && (
                <p className="text-gray-600 mt-10 text-center">Loading restaurants...</p>
            )}

            {/* Restaurant Grid */}
            {!loading && restaurants.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {restaurants.map((r) => (
                        <div
                            key={r.id}
                            onClick={() => navigate(`/restaurant/${r.id}`)}
                            className="bg-white border rounded-xl shadow hover:shadow-lg hover:border-blue-400 transition cursor-pointer"
                        >
                            {/* Restaurant Image Placeholder */}
                            <div className="h-36 bg-gradient-to-r from-blue-100 to-blue-200 rounded-t-xl flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-lg">
                  {r.name.charAt(0)}
                </span>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-gray-900">{r.name}</h3>
                                <p className="text-gray-600 text-sm mt-1">
                                    {r.cuisineType || "Cuisine Type"}
                                </p>
                                <p className="text-gray-500 text-xs mt-1">
                                    {r.city} • {r.address}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!loading && restaurants.length === 0 && (
                <div className="bg-white p-6 rounded-xl shadow text-center border mt-6">
                    <h3 className="text-lg font-semibold text-gray-800">No restaurants found</h3>
                    <p className="text-gray-600 text-sm mt-1">
                        Add restaurants from the Admin Panel to get started.
                    </p>
                </div>
            )}
        </div>
    );
}