import { useEffect, useState } from "react";
import { restaurantApi } from "../api/restaurantApi";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const [restaurants, setRestaurants] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        restaurantApi
            .getRestaurants()
            .then((res) => setRestaurants(res.data))
            .catch((err) => console.error("Failed to load restaurants", err));
    }, []);

    return (
        <main className="p-6 max-w-6xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Restaurants</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {restaurants.map((r) => (
                    <div
                        key={r.id}
                        onClick={() => navigate(`/restaurant/${r.id}`)}
                        className="bg-white rounded-xl border shadow p-4 cursor-pointer hover:shadow-lg transition"
                    >
                        <h3 className="text-lg font-bold">{r.name}</h3>
                        <p className="text-gray-500">{r.cuisineType}</p>
                        <p className="text-sm text-gray-400 mt-1">{r.city}</p>
                    </div>
                ))}
                {restaurants.length === 0 && (
                    <p className="text-gray-500">No restaurants found.</p>
                )}
            </div>
        </main>
    );
}
