import { useNavigate } from "react-router-dom";

export default function AdminHome() {
    const navigate = useNavigate();

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Admin Dashboard</h2>
            <p className="text-gray-600 mb-6">
                Manage restaurants, menus, orders, and deliveries from a single place.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                    className="bg-white rounded-xl shadow border p-4 cursor-pointer hover:shadow-lg"
                    onClick={() => navigate("/admin/restaurants")}
                >
                    <h3 className="text-lg font-semibold mb-1">Restaurants & Menu</h3>
                    <p className="text-gray-500 text-sm">
                        Create, update, delete restaurants and manage their menus.
                    </p>
                </div>

                <div
                    className="bg-white rounded-xl shadow border p-4 cursor-pointer hover:shadow-lg"
                    onClick={() => navigate("/admin/orders")}
                >
                    <h3 className="text-lg font-semibold mb-1">Orders</h3>
                    <p className="text-gray-500 text-sm">
                        View all orders, filter by customer or restaurant, and update status.
                    </p>
                </div>

                <div
                    className="bg-white rounded-xl shadow border p-4 cursor-pointer hover:shadow-lg"
                    onClick={() => navigate("/admin/deliveries")}
                >
                    <h3 className="text-lg font-semibold mb-1">Deliveries</h3>
                    <p className="text-gray-500 text-sm">
                        Manage deliveries and update their status.
                    </p>
                </div>
            </div>
        </div>
    );
}
