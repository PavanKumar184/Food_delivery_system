import { useEffect, useState } from "react";
import { restaurantApi } from "../api/restaurantApi";

export default function AdminRestaurants() {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [editingRestaurant, setEditingRestaurant] = useState(null);
    const [form, setForm] = useState({
        name: "",
        address: "",
        city: "",
        cuisineType: "",
        contactNumber: "",
        active: true,
    });

    // Menu management
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [menuForm, setMenuForm] = useState({
        itemName: "",
        price: "",
        description: "",
        available: true,
    });
    const [editingMenuItemId, setEditingMenuItemId] = useState(null);

    useEffect(() => {
        loadRestaurants();
    }, []);

    async function loadRestaurants() {
        setLoading(true);
        setError("");
        try {
            const res = await restaurantApi.getRestaurants();
            setRestaurants(res.data);
        } catch (err) {
            console.error(err);
            setError("Failed to load restaurants");
        } finally {
            setLoading(false);
        }
    }

    function handleRestaurantInputChange(e) {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    }

    async function handleRestaurantSubmit(e) {
        e.preventDefault();
        setError("");

        try {
            if (editingRestaurant) {
                await restaurantApi.updateRestaurant(editingRestaurant.id, form);
            } else {
                await restaurantApi.createRestaurant(form);
            }
            setForm({
                name: "",
                address: "",
                city: "",
                cuisineType: "",
                contactNumber: "",
                active: true,
            });
            setEditingRestaurant(null);
            await loadRestaurants();
        } catch (err) {
            console.error(err);
            setError("Failed to save restaurant");
        }
    }

    function handleEditRestaurant(r) {
        setEditingRestaurant(r);
        setForm({
            name: r.name,
            address: r.address,
            city: r.city,
            cuisineType: r.cuisineType || "",
            contactNumber: r.contactNumber || "",
            active: r.active ?? true,
        });
    }

    async function handleDeleteRestaurant(id) {
        if (!window.confirm("Delete this restaurant?")) return;
        try {
            await restaurantApi.deleteRestaurant(id);
            await loadRestaurants();
        } catch (err) {
            console.error(err);
            setError("Failed to delete restaurant");
        }
    }

    // ===== Menu management =====

    async function handleManageMenu(r) {
        setSelectedRestaurant(r);
        setEditingMenuItemId(null);
        setMenuForm({
            itemName: "",
            price: "",
            description: "",
            available: true,
        });
        await loadMenu(r.id);
    }

    async function loadMenu(restaurantId) {
        try {
            const res = await restaurantApi.getMenu(restaurantId);
            setMenuItems(res.data);
        } catch (err) {
            console.error(err);
            setError("Failed to load menu");
        }
    }

    function handleMenuInputChange(e) {
        const { name, value, type, checked } = e.target;
        setMenuForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    }

    async function handleMenuSubmit(e) {
        e.preventDefault();
        if (!selectedRestaurant) return;

        try {
            const payload = {
                itemName: menuForm.itemName,
                price: parseFloat(menuForm.price),
                description: menuForm.description,
                available: menuForm.available,
            };

            if (editingMenuItemId) {
                await restaurantApi.updateMenuItem(
                    selectedRestaurant.id,
                    editingMenuItemId,
                    payload
                );
            } else {
                await restaurantApi.addMenuItem(selectedRestaurant.id, payload);
            }

            setMenuForm({
                itemName: "",
                price: "",
                description: "",
                available: true,
            });
            setEditingMenuItemId(null);
            await loadMenu(selectedRestaurant.id);
        } catch (err) {
            console.error(err);
            setError("Failed to save menu item");
        }
    }

    function handleEditMenuItem(item) {
        setEditingMenuItemId(item.id);
        setMenuForm({
            itemName: item.itemName,
            price: item.price,
            description: item.description || "",
            available: item.available ?? true,
        });
    }

    async function handleDeleteMenuItem(itemId) {
        if (!selectedRestaurant) return;
        if (!window.confirm("Delete this menu item?")) return;
        try {
            await restaurantApi.deleteMenuItem(selectedRestaurant.id, itemId);
            await loadMenu(selectedRestaurant.id);
        } catch (err) {
            console.error(err);
            setError("Failed to delete menu item");
        }
    }

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Admin - Restaurants & Menu</h2>

            {error && <p className="text-red-600 mb-3">{error}</p>}

            {/* Restaurant Form */}
            <div className="bg-white rounded-xl shadow border p-4 mb-6">
                <h3 className="text-xl font-semibold mb-3">
                    {editingRestaurant ? "Edit Restaurant" : "Create Restaurant"}
                </h3>
                <form className="grid md:grid-cols-2 gap-4" onSubmit={handleRestaurantSubmit}>
                    <div>
                        <label className="block text-sm mb-1">Name</label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleRestaurantInputChange}
                            required
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Address</label>
                        <input
                            name="address"
                            value={form.address}
                            onChange={handleRestaurantInputChange}
                            required
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">City</label>
                        <input
                            name="city"
                            value={form.city}
                            onChange={handleRestaurantInputChange}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Cuisine Type</label>
                        <input
                            name="cuisineType"
                            value={form.cuisineType}
                            onChange={handleRestaurantInputChange}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Contact Number</label>
                        <input
                            name="contactNumber"
                            value={form.contactNumber}
                            onChange={handleRestaurantInputChange}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="active"
                            checked={form.active}
                            onChange={handleRestaurantInputChange}
                        />
                        <span>Active</span>
                    </div>
                    <div className="md:col-span-2 flex justify-end gap-2">
                        {editingRestaurant && (
                            <button
                                type="button"
                                onClick={() => {
                                    setEditingRestaurant(null);
                                    setForm({
                                        name: "",
                                        address: "",
                                        city: "",
                                        cuisineType: "",
                                        contactNumber: "",
                                        active: true,
                                    });
                                }}
                                className="bg-gray-200 px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                        )}
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            {editingRestaurant ? "Update" : "Create"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Restaurant List */}
            <div className="bg-white rounded-xl shadow border p-4 mb-6">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl font-semibold">Restaurants</h3>
                    {loading && <span className="text-sm text-gray-500">Loading...</span>}
                </div>
                <table className="w-full text-sm">
                    <thead>
                    <tr className="border-b">
                        <th className="py-2 text-left">ID</th>
                        <th className="py-2 text-left">Name</th>
                        <th className="py-2 text-left">City</th>
                        <th className="py-2 text-left">Cuisine</th>
                        <th className="py-2 text-left">Active</th>
                        <th className="py-2 text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {restaurants.map((r) => (
                        <tr key={r.id} className="border-b">
                            <td className="py-2">{r.id}</td>
                            <td className="py-2">{r.name}</td>
                            <td className="py-2">{r.city}</td>
                            <td className="py-2">{r.cuisineType}</td>
                            <td className="py-2">{r.active ? "Yes" : "No"}</td>
                            <td className="py-2 text-right space-x-2">
                                <button
                                    onClick={() => handleEditRestaurant(r)}
                                    className="text-blue-600 hover:underline"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleManageMenu(r)}
                                    className="text-green-600 hover:underline"
                                >
                                    Menu
                                </button>
                                <button
                                    onClick={() => handleDeleteRestaurant(r.id)}
                                    className="text-red-600 hover:underline"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    {restaurants.length === 0 && !loading && (
                        <tr>
                            <td className="py-3 text-center text-gray-500" colSpan={6}>
                                No restaurants found.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* Menu Management */}
            {selectedRestaurant && (
                <div className="bg-white rounded-xl shadow border p-4">
                    <h3 className="text-xl font-semibold mb-2">
                        Menu for {selectedRestaurant.name}
                    </h3>

                    <form className="grid md:grid-cols-2 gap-4 mb-4" onSubmit={handleMenuSubmit}>
                        <div>
                            <label className="block text-sm mb-1">Item Name</label>
                            <input
                                name="itemName"
                                value={menuForm.itemName}
                                onChange={handleMenuInputChange}
                                required
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Price</label>
                            <input
                                type="number"
                                step="0.01"
                                name="price"
                                value={menuForm.price}
                                onChange={handleMenuInputChange}
                                required
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm mb-1">Description</label>
                            <textarea
                                name="description"
                                value={menuForm.description}
                                onChange={handleMenuInputChange}
                                rows={2}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="available"
                                checked={menuForm.available}
                                onChange={handleMenuInputChange}
                            />
                            <span>Available</span>
                        </div>
                        <div className="md:col-span-2 flex justify-end gap-2">
                            {editingMenuItemId && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingMenuItemId(null);
                                        setMenuForm({
                                            itemName: "",
                                            price: "",
                                            description: "",
                                            available: true,
                                        });
                                    }}
                                    className="bg-gray-200 px-4 py-2 rounded"
                                >
                                    Cancel
                                </button>
                            )}
                            <button
                                type="submit"
                                className="bg-green-600 text-white px-4 py-2 rounded"
                            >
                                {editingMenuItemId ? "Update Item" : "Add Item"}
                            </button>
                        </div>
                    </form>

                    <table className="w-full text-sm">
                        <thead>
                        <tr className="border-b">
                            <th className="py-2 text-left">ID</th>
                            <th className="py-2 text-left">Name</th>
                            <th className="py-2 text-left">Price</th>
                            <th className="py-2 text-left">Available</th>
                            <th className="py-2 text-right">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {menuItems.map((m) => (
                            <tr key={m.id} className="border-b">
                                <td className="py-2">{m.id}</td>
                                <td className="py-2">{m.itemName}</td>
                                <td className="py-2">₹{m.price}</td>
                                <td className="py-2">{m.available ? "Yes" : "No"}</td>
                                <td className="py-2 text-right space-x-2">
                                    <button
                                        onClick={() => handleEditMenuItem(m)}
                                        className="text-blue-600 hover:underline"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteMenuItem(m.id)}
                                        className="text-red-600 hover:underline"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {menuItems.length === 0 && (
                            <tr>
                                <td className="py-3 text-center text-gray-500" colSpan={5}>
                                    No menu items found.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
