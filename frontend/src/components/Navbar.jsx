import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <header className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow">
            <h1 className="font-bold text-xl">Food Delivery System</h1>
            <nav className="flex gap-4 text-sm md:text-base flex-wrap">
                <Link to="/" className="hover:underline">Home</Link>
                <Link to="/cart" className="hover:underline">Cart</Link>
                <Link to="/order-status" className="hover:underline">Order Status</Link>
                <Link to="/delivery-status" className="hover:underline">Delivery</Link>
                <Link to="/admin" className="hover:underline font-semibold">Admin</Link>
            </nav>
        </header>
    );
}
