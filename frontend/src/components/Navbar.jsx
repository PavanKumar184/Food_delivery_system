import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { items } = useCart();
    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

    const navItemClasses =
        "text-gray-700 hover:text-blue-600 transition font-medium";

    const activeClasses =
        "text-blue-600 font-semibold border-b-2 border-blue-600 pb-1";

    return (
        <nav className="bg-white shadow sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

                {/* LEFT: LOGO */}
                <Link to="/" className="text-2xl font-bold text-blue-600">
                    FoodXpress
                </Link>

                {/* DESKTOP MENU */}
                <div className="hidden md:flex items-center gap-8">

                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            isActive ? activeClasses : navItemClasses
                        }
                    >
                        Home
                    </NavLink>

                    <NavLink
                        to="/order-status"
                        className={({ isActive }) =>
                            isActive ? activeClasses : navItemClasses
                        }
                    >
                        Track Order
                    </NavLink>

                    <NavLink
                        to="/delivery-status"
                        className={({ isActive }) =>
                            isActive ? activeClasses : navItemClasses
                        }
                    >
                        Delivery Status
                    </NavLink>

                    <NavLink
                        to="/admin"
                        className={({ isActive }) =>
                            isActive ? activeClasses : navItemClasses
                        }
                    >
                        Admin
                    </NavLink>

                    {/* CART ICON */}
                    <NavLink
                        to="/cart"
                        className="relative flex items-center"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-7 h-7 text-gray-700 hover:text-blue-600 transition"
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

                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-2 bg-blue-600 text-white text-xs rounded-full px-1.5">
                {cartCount}
              </span>
                        )}
                    </NavLink>
                </div>

                {/* MOBILE MENU BUTTON */}
                <button
                    className="md:hidden"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <svg
                        className="w-7 h-7 text-gray-700"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        {menuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* MOBILE MENU DROPDOWN */}
            {menuOpen && (
                <div className="md:hidden bg-white shadow-lg px-4 py-3 space-y-3">

                    <NavLink
                        to="/"
                        onClick={() => setMenuOpen(false)}
                        className={({ isActive }) =>
                            isActive ? activeClasses : navItemClasses
                        }
                    >
                        Home
                    </NavLink>

                    <NavLink
                        to="/order-status"
                        onClick={() => setMenuOpen(false)}
                        className={({ isActive }) =>
                            isActive ? activeClasses : navItemClasses
                        }
                    >
                        Track Order
                    </NavLink>

                    <NavLink
                        to="/delivery-status"
                        onClick={() => setMenuOpen(false)}
                        className={({ isActive }) =>
                            isActive ? activeClasses : navItemClasses
                        }
                    >
                        Delivery Status
                    </NavLink>

                    <NavLink
                        to="/admin"
                        onClick={() => setMenuOpen(false)}
                        className={({ isActive }) =>
                            isActive ? activeClasses : navItemClasses
                        }
                    >
                        Admin
                    </NavLink>

                    {/* CART BUTTON MOBILE */}
                    <NavLink
                        to="/cart"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
                    >
                        Cart ({cartCount})
                    </NavLink>
                </div>
            )}
        </nav>
    );
}