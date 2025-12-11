import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { orderApi } from "../api/orderApi";

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
        (sum, item) => sum + Number(item.price) * Number(item.quantity),
        0
    );

    if (!restaurant || items.length === 0) {
        return (
            <div className="min-h-[60vh] flex items-start justify-center py-12">
                <div className="max-w-2xl w-full bg-white rounded-lg shadow p-6">
                    <h2 className="text-2xl font-semibold mb-3">Checkout</h2>
                    <p className="text-gray-600 mb-4">Your cart is empty.</p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => navigate("/")}
                            className="px-4 py-2 rounded bg-blue-600 text-white"
                        >
                            Browse Restaurants
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);

        // Basic front-end validation
        if (!customerName || !customerPhone || !deliveryAddress) {
            setError("Please fill all the customer details.");
            setLoading(false);
            return;
        }

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
            // Read backend error message if present
            if (err?.response?.data) {
                const backend = err.response.data;
                // backend might return different shapes; try to show meaningful message
                if (backend.message) setError(backend.message);
                else if (backend.errors) {
                    // join validation errors
                    const list = Object.entries(backend.errors)
                        .map(([k, v]) => `${k}: ${v}`)
                        .join(" • ");
                    setError(list);
                } else setError(JSON.stringify(backend));
            } else {
                setError("Network error — failed to place order. Check server logs.");
            }
        } finally {
            setLoading(false);
        }
    }

    if (orderResponse) {
        return (
            <div className="min-h-[60vh] flex items-start justify-center py-12">
                <div className="max-w-2xl w-full bg-white rounded-lg shadow p-6">
                    <h2 className="text-2xl font-semibold mb-3">Order Placed</h2>
                    <p className="text-gray-700 mb-4">
                        Your order was placed successfully.
                    </p>

                    <div className="bg-gray-50 border rounded p-4 mb-4">
                        <p className="text-gray-600">Order ID</p>
                        <p className="text-xl font-semibold">#{orderResponse.id}</p>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => navigate("/order-status")}
                            className="px-4 py-2 rounded bg-blue-600 text-white"
                        >
                            Track Order
                        </button>
                        <button
                            onClick={() => navigate("/")}
                            className="px-4 py-2 rounded border"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[70vh] py-8">
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Order summary */}
                <aside className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-3">Order Summary</h3>

                    <p className="text-sm text-gray-600 mb-4">
                        Restaurant: <span className="font-medium">{restaurant.name}</span>
                    </p>

                    <ul className="divide-y">
                        {items.map((it) => (
                            <li key={it.menuItemId} className="py-3 flex justify-between">
                                <div>
                                    <div className="font-medium">{it.itemName}</div>
                                    <div className="text-xs text-gray-500">
                                        Qty: {it.quantity}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-medium">₹{(it.price * it.quantity).toFixed(2)}</div>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-4 border-t pt-4 flex justify-between items-center">
                        <div className="text-sm text-gray-600">Total</div>
                        <div className="text-xl font-semibold">₹{total.toFixed(2)}</div>
                    </div>
                </aside>

                {/* Customer form */}
                <section className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-3">Customer Details</h3>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Name</label>
                            <input
                                type="text"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                className="w-full border rounded px-3 py-2"
                                placeholder="Full name"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Phone</label>
                            <input
                                type="tel"
                                value={customerPhone}
                                onChange={(e) => setCustomerPhone(e.target.value)}
                                className="w-full border rounded px-3 py-2"
                                placeholder="9876543210"
                                required
                            />
                            <p className="text-xs text-gray-400 mt-1">
                                Enter digits only (backend validation may apply).
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Delivery address</label>
                            <textarea
                                value={deliveryAddress}
                                onChange={(e) => setDeliveryAddress(e.target.value)}
                                className="w-full border rounded px-3 py-2"
                                rows={4}
                                placeholder="House / Street / Area"
                                required
                            />
                        </div>

                        {error && (
                            <div className="text-sm text-red-600 bg-red-50 border border-red-100 p-2 rounded">
                                {error}
                            </div>
                        )}

                        <div className="flex gap-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-blue-600 text-white rounded"
                            >
                                {loading ? "Placing order..." : `Place Order • ₹${total.toFixed(2)}`}
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate("/cart")}
                                className="px-4 py-2 rounded border"
                            >
                                Back to Cart
                            </button>
                        </div>
                    </form>
                </section>
            </div>
        </div>
    );
}
