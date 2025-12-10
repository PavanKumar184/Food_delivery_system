import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function Cart() {
    const { restaurant, items, removeItem, updateQuantity, clearCart } = useCart();
    const navigate = useNavigate();

    const total = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    if (!restaurant || items.length === 0) {
        return (
            <div className="p-6 max-w-3xl mx-auto">
                <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>
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

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold mb-2">Your Cart</h2>
            <p className="text-gray-600 mb-4">
                Restaurant: <span className="font-semibold">{restaurant.name}</span>
            </p>

            <div className="bg-white rounded-xl shadow border p-4 mb-4">
                <table className="w-full text-left">
                    <thead>
                    <tr className="border-b">
                        <th className="py-2">Item</th>
                        <th className="py-2">Price</th>
                        <th className="py-2">Quantity</th>
                        <th className="py-2">Subtotal</th>
                        <th className="py-2"></th>
                    </tr>
                    </thead>
                    <tbody>
                    {items.map((item) => {
                        const subTotal = item.price * item.quantity;
                        return (
                            <tr key={item.menuItemId} className="border-b">
                                <td className="py-2">{item.itemName}</td>
                                <td className="py-2">₹{item.price}</td>
                                <td className="py-2">
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
                                        className="w-16 border rounded px-1"
                                    />
                                </td>
                                <td className="py-2">₹{subTotal.toFixed(2)}</td>
                                <td className="py-2 text-right">
                                    <button
                                        onClick={() => removeItem(item.menuItemId)}
                                        className="text-red-600 hover:underline"
                                    >
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>

                <div className="flex justify-between items-center mt-4">
                    <button
                        onClick={clearCart}
                        className="text-sm text-gray-600 hover:underline"
                    >
                        Clear cart
                    </button>
                    <div className="text-right">
                        <p className="text-lg font-semibold">
                            Total: <span className="text-green-700">₹{total.toFixed(2)}</span>
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex justify-between">
                <button
                    onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                    className="bg-gray-200 px-4 py-2 rounded"
                >
                    Back to menu
                </button>
                <button
                    onClick={() => navigate("/checkout")}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                >
                    Proceed to checkout
                </button>
            </div>
        </div>
    );
}
