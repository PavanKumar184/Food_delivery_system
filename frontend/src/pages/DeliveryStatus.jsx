import { useState } from "react";
import { deliveryApi } from "../api/deliveryApi";

export default function DeliveryStatus() {
    const [deliveryId, setDeliveryId] = useState("");
    const [delivery, setDelivery] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!deliveryId.trim()) return;

        setLoading(true);
        setError("");
        setDelivery(null);

        try {
            const res = await deliveryApi.getDelivery(deliveryId);
            setDelivery(res.data);
        } catch (err) {
            console.error(err);
            setError("Delivery not found. Please check the ID.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-10">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                Track Delivery Status
            </h2>

            {/* Search Box */}
            <form
                onSubmit={handleSearch}
                className="bg-white shadow-md rounded-xl border p-5 flex flex-col md:flex-row gap-3"
            >
                <input
                    type="text"
                    placeholder="Enter Delivery ID"
                    value={deliveryId}
                    onChange={(e) => setDeliveryId(e.target.value)}
                    className="flex-1 border rounded-lg px-3 py-2 focus:ring-blue-200 text-gray-800"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition"
                >
                    {loading ? "Searching..." : "Check Status"}
                </button>
            </form>

            {/* Error */}
            {error && (
                <p className="text-red-600 text-sm mt-3 bg-red-50 border border-red-100 p-2 rounded-lg">
                    {error}
                </p>
            )}

            {/* Delivery Info */}
            {delivery && (
                <div className="bg-white shadow-md border rounded-xl p-6 mt-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">
                        Delivery #{delivery.id}
                    </h3>

                    {/* Delivery Details */}
                    <div className="text-gray-700 space-y-1 text-sm">
                        <p>
                            <span className="font-medium">Order ID:</span> {delivery.orderId}
                        </p>
                        <p>
                            <span className="font-medium">Delivery Person:</span>{" "}
                            {delivery.deliveryPerson || "Not Assigned"}
                        </p>
                        <p>
                            <span className="font-medium">Delivery Address:</span>{" "}
                            {delivery.deliveryAddress}
                        </p>

                        <p>
                            <span className="font-medium">Status:</span>{" "}
                            <span
                                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                    delivery.status === "DELIVERED"
                                        ? "bg-green-100 text-green-700"
                                        : delivery.status === "ASSIGNED"
                                            ? "bg-blue-100 text-blue-700"
                                            : delivery.status === "CANCELLED"
                                                ? "bg-red-100 text-red-700"
                                                : "bg-yellow-100 text-yellow-800"
                                }`}
                            >
                {delivery.status}
              </span>
                        </p>

                        {delivery.deliveryTime && (
                            <p>
                                <span className="font-medium">Delivered At:</span>{" "}
                                {delivery.deliveryTime}
                            </p>
                        )}
                    </div>

                    {/* Map or Tracking Placeholder */}
                    <div className="mt-5 bg-gray-100 border rounded-xl p-6 text-center text-gray-500 text-sm">
                        Live delivery location tracking coming soon...
                    </div>
                </div>
            )}
        </div>
    );
}