import { useState } from "react";
import { orderApi } from "../api/orderApi";

export default function OrderStatus() {
    const [orderId, setOrderId] = useState("");
    const [order, setOrder] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleCheckStatus(e) {
        e.preventDefault();
        setError("");
        setOrder(null);
        if (!orderId) return;

        setLoading(true);
        try {
            const res = await orderApi.getOrder(orderId);
            setOrder(res.data);
        } catch (err) {
            console.error("Failed to fetch order", err);
            setError("Order not found or server error.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Order Status</h2>

            <form onSubmit={handleCheckStatus} className="flex gap-2 mb-4">
                <input
                    type="number"
                    placeholder="Enter Order ID"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className="border rounded px-3 py-2 flex-1"
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Check
                </button>
            </form>

            {loading && <p>Loading...</p>}
            {error && <p className="text-red-600">{error}</p>}

            {order && (
                <div className="bg-white rounded-xl shadow border p-4 mt-4">
                    <p className="mb-1">
                        <span className="font-semibold">Order ID:</span> #{order.id}
                    </p>
                    <p className="mb-1">
                        <span className="font-semibold">Restaurant ID:</span>{" "}
                        {order.restaurantId}
                    </p>
                    <p className="mb-1">
                        <span className="font-semibold">Customer:</span> {order.customerName}
                    </p>
                    <p className="mb-1">
                        <span className="font-semibold">Phone:</span> {order.customerPhone}
                    </p>
                    <p className="mb-1">
                        <span className="font-semibold">Address:</span>{" "}
                        {order.deliveryAddress}
                    </p>
                    <p className="mb-3">
                        <span className="font-semibold">Status:</span>{" "}
                        <span className="uppercase text-blue-700">{order.status}</span>
                    </p>

                    <h3 className="font-semibold mb-2">Items</h3>
                    <ul className="divide-y text-sm">
                        {order.items?.map((item) => (
                            <li key={item.id} className="flex justify-between py-1">
                <span>
                  {item.itemName} × {item.quantity}
                </span>
                                <span>₹{item.subTotal}</span>
                            </li>
                        ))}
                    </ul>

                    <p className="mt-3 font-semibold">
                        Total: ₹{order.totalAmount}
                    </p>
                </div>
            )}
        </div>
    );
}
