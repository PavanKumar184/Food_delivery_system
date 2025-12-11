import { NavLink } from "react-router-dom";

export default function AdminLayout({ children }) {
    const navItem = (to, label) => (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-sm font-medium ${
                    isActive ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                }`
            }
        >
            {label}
        </NavLink>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
                {/* Sidebar */}
                <aside className="w-60 bg-white border rounded-xl p-4 shadow-sm flex-none">
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">Admin</h2>
                        <p className="text-xs text-gray-500">Management console</p>
                    </div>

                    <nav className="space-y-1">
                        {navItem("/admin", "Dashboard")}
                        {navItem("/admin/restaurants", "Restaurants")}
                        {navItem("/admin/orders", "Orders")}
                        {navItem("/admin/deliveries", "Deliveries")}
                    </nav>
                </aside>

                {/* Main */}
                <main className="flex-1">{children}</main>
            </div>
        </div>
    );
}