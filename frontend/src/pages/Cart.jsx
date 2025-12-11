import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";

export default function Cart() {
    const { restaurant, items, removeItem, updateQuantity, clearCart } = useCart();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const total = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    // Empty Cart Screen
    if (!restaurant || items.length === 0) {
        return (
            <div className="max-w-xl mx-auto mt-12 bg-white rounded-xl shadow-md border p-8 text-center">
                <h2 className="text-2xl font-semibold mb-3">Your Cart is Empty</h2>
                <p className="text-gray-600 mb-5">
                    Add items from any restaurant to see them here.
                </p>
                <button
                    onClick={() => navigate("/")}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition"
                >
                    Browse Restaurants
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto mt-10 space-y-6">
            {/* Cart Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-semibold text-gray-800">Your Cart</h2>
                <button
                    onClick={clearCart}
                    className="text-sm text-red-500 hover:text-red-600 underline"
                >
                    Clear Cart
                </button>
            </div>

            {/* Restaurant Info */}
            <div className="bg-white shadow-sm border rounded-xl p-5">
                <p className="text-gray-700">
                    <span className="font-semibold">Restaurant: </span>
                    {restaurant.name}
                </p>
                <p className="text-gray-500 text-sm mt-1">{restaurant.address}</p>
            </div>

            {/* Cart Items */}
            <div className="bg-white shadow-md border rounded-xl p-5">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Items</h3>

                <div className="divide-y">
                    {items.map((item) => {
                        const subTotal = item.quantity * item.price;

                        return (
                            <div
                                key={item.menuItemId}
                                className="py-4 flex items-center justify-between"
                            >
                                <div>
                                    <h4 className="text-lg font-medium text-gray-900">
                                        {item.itemName}
                                    </h4>
                                    <p className="text-blue-700 font-semibold">
                                        ₹{item.price}
                                    </p>
                                </div>

                                <div className="flex items-center gap-4">
                                    {/* Quantity Input */}
                                    <input
                                        type="number"
                                        min="1"
                                        value={item.quantity}
                                        onChange={(e) =>
                                            updateQuantity(
                                                item.menuItemId,
                                                parseInt(e.target.value || "1", 10)
                                            )
                                        }
                                        className="w-16 border rounded-lg px-2 py-1 text-center"
                                    />

                                    {/* Item Subtotal */}
                                    <span className="font-semibold text-gray-800">
                    ₹{subTotal}
                  </span>

                                    {/* Remove Button */}
                                    <button
                                        onClick={() => {removeItem(item.menuItemId)
                                            showToast("Item removed from cart");
                                    }}
                                        className="text-red-500 text-sm hover:text-red-600 underline"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Total + Checkout */}
            <div className="bg-white shadow-md border rounded-xl p-5 flex items-center justify-between">
                <div>
                    <p className="text-gray-600 text-sm">Total Amount</p>
                    <p className="text-2xl font-bold text-blue-700">₹{total.toFixed(2)}</p>
                </div>

                <button
                    onClick={() => navigate("/checkout")}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition font-semibold"
                >
                    Proceed to Checkout
                </button>
            </div>
        </div>
    );
}