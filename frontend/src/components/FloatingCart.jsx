import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function FloatingCart() {
    const { items } = useCart();
    const location = useLocation();

    // Hide on cart page
    if (location.pathname === "/cart") return null;

    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
    const totalAmount = items
        .reduce((sum, i) => sum + i.price * i.quantity, 0)
        .toFixed(2);

    if (totalItems === 0) return null;

    return (
        <Link
            to="/cart"
            className="
        fixed bottom-6 right-6 z-50
        bg-blue-600 hover:bg-blue-700
        shadow-xl rounded-full text-white
        px-5 py-3 flex items-center gap-3
        transition-transform transform hover:scale-105
      "
        >
            {/* Cart Icon */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m12-9l2 9m-6-9v9"
                />
            </svg>

            {/* Info */}
            <div className="text-sm">
                <p className="font-semibold">{totalItems} item(s)</p>
                <p className="text-white/80">₹{totalAmount}</p>
            </div>
        </Link>
    );
}