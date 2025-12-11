import { useState } from "react";
import { orderApi } from "../api/orderApi";

export default function OrderStatus() {
    const [orderId, setOrderId] = useState("");
    const [order, setOrder] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!orderId.trim()) return;

        setLoading(true);
        setError("");
        setOrder(null);

        try {
            const res = await orderApi.getOrder(orderId);
            setOrder(res.data);
        } catch (err) {
            setError("Order not found. Double-check the ID.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Track Your Order
            </h2>

            {/* Search Bar */}
            <form
                onSubmit={handleSearch}
                className="bg-white shadow-md border rounded-xl p-5 flex gap-3"
            >
                <input
                    type="text"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="Enter Order ID"
                    className="flex-1 border rounded-lg px-3 py-2"
                />

                <button
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    {loading ? "Searching..." : "Check"}
                </button>
            </form>

            {error && (
                <p className="text-red-600 text-sm mt-3 bg-red-50 border p-2 rounded-lg">
                    {error}
                </p>
            )}

            {/* Order Details */}
            {order && (
                <div className="mt-6 bg-white shadow-md rounded-xl border p-6">
                    <h3 className="text-xl font-semibold text-gray-700 mb-3">
                        Order #{order.id}
                    </h3>

                    <div className="text-sm text-gray-700 space-y-1">
                        <p><strong>Customer:</strong> {order.customerName}</p>
                        <p><strong>Phone:</strong> {order.customerPhone}</p>
                        <p><strong>Restaurant ID:</strong> {order.restaurantId}</p>
                        <p><strong>Address:</strong> {order.deliveryAddress}</p>

                        <p>
                            <strong>Status:</strong>{" "}
                            <span
                                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                    order.status === "DELIVERED"
                                        ? "bg-green-100 text-green-700"
                                        : order.status === "CANCELLED"
                                            ? "bg-red-100 text-red-700"
                                            : "bg-yellow-100 text-yellow-800"
                                }`}
                            >
                {order.status}
              </span>
                        </p>
                    </div>

                    {/* Items */}
                    <h4 className="text-lg font-semibold mt-4 mb-2">Items</h4>

                    <ul className="divide-y text-sm">
                        {order.items?.map((it) => (
                            <li key={it.id} className="flex justify-between py-2">
                                <span>{it.itemName} × {it.quantity}</span>
                                <span className="font-medium">₹{it.subTotal}</span>
                            </li>
                        ))}
                    </ul>

                    <div className="flex justify-between items-center mt-4 border-t pt-3">
                        <strong>Total</strong>
                        <span className="text-xl font-bold text-blue-700">
              ₹{order.totalAmount}
            </span>
                    </div>
                </div>
            )}
        </div>
    );
}