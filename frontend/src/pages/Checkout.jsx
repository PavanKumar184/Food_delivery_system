import { useState } from "react";
import { useCart } from "../context/CartContext";
import { orderApi } from "../api/orderApi";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
    const { restaurant, items, clearCart } = useCart();
    const navigate = useNavigate();

    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [loading, setLoading] = useState(false);
    const [orderResponse, setOrderResponse] = useState(null);
    const [error, setError] = useState("");

    const total = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    if (!restaurant || items.length === 0) {
        return (
            <div className="p-6 max-w-3xl mx-auto">
                <h2 className="text-2xl font-semibold mb-4">Checkout</h2>
                <p className="text-gray-600 mb-4">Your cart is empty.</p>
                <button
                    onClick={() => navigate("/")}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Browse Restaurants
                </button>
            </div>
        );
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const payload = {
                restaurantId: restaurant.id,
                customerName,
                customerPhone,
                deliveryAddress,
                items: items.map((item) => ({
                    menuItemId: item.menuItemId,
                    quantity: item.quantity,
                })),
            };

            const res = await orderApi.createOrder(payload);
            setOrderResponse(res.data);
            clearCart();
        } catch (err) {
            console.error("Failed to create order", err);
            if (err.response && err.response.data) {
                console.log("Backend error response:", err.response.data);
                const backendMessage =
                    err.response.data.message ||
                    err.response.data.error ||
                    JSON.stringify(err.response.data);
                setError(backendMessage);
            } else {
                setError("Network error while creating order.");
            }
        } finally {
            setLoading(false);
        }
    }

    if (orderResponse) {
        return (
            <div className="p-6 max-w-3xl mx-auto">
                <h2 className="text-2xl font-semibold mb-4">Order Placed Successfully!</h2>
                <p className="mb-2">Your Order ID is: </p>
                <p className="text-2xl font-bold text-green-700 mb-4">
                    #{orderResponse.id}
                </p>

                <button
                    onClick={() => navigate("/order-status")}
                    className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
                >
                    Go to Order Status
                </button>
                <button
                    onClick={() => navigate("/")}
                    className="bg-gray-200 px-4 py-2 rounded"
                >
                    Back to Home
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Checkout</h2>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Order Summary */}
                <div className="bg-white rounded-xl shadow border p-4">
                    <h3 className="text-xl font-semibold mb-2">
                        Restaurant: {restaurant.name}
                    </h3>
                    <ul className="divide-y">
                        {items.map((item) => (
                            <li
                                key={item.menuItemId}
                                className="flex justify-between py-2 text-sm"
                            >
                <span>
                  {item.itemName} × {item.quantity}
                </span>
                                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-4 flex justify-between font-semibold">
                        <span>Total</span>
                        <span>₹{total.toFixed(2)}</span>
                    </div>
                </div>

                {/* Customer Form */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-xl shadow border p-4 space-y-3"
                >
                    <h3 className="text-xl font-semibold mb-2">Customer Details</h3>

                    <div>
                        <label className="block text-sm mb-1">Name</label>
                        <input
                            type="text"
                            required
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Phone</label>
                        <input
                            type="tel"
                            required
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Delivery Address</label>
                        <textarea
                            required
                            value={deliveryAddress}
                            onChange={(e) => setDeliveryAddress(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                            rows={3}
                        />
                    </div>

                    {error && (
                        <p className="text-red-600 text-sm">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-green-600 text-white px-4 py-2 rounded w-full mt-2 disabled:opacity-60"
                    >
                        {loading ? "Placing order..." : "Place Order"}
                    </button>
                </form>
            </div>
        </div>
    );
}
