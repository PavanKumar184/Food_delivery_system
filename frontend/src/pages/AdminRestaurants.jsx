import { useEffect, useState } from "react";
import { restaurantApi } from "../api/restaurantApi";
import AdminLayout from "../layouts/AdminLayout";
import Modal from "../components/Modal";
import { useToast } from "../context/ToastContext";

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

    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [menuForm, setMenuForm] = useState({
        itemName: "",
        price: "",
        description: "",
        available: true,
    });
    const [editingMenuItemId, setEditingMenuItemId] = useState(null);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pendingDeleteId, setPendingDeleteId] = useState(null);

    const { showToast } = useToast();

    useEffect(() => {
        loadRestaurants();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            showToast("Failed to load restaurants", "error");
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
                showToast("Restaurant updated");
            } else {
                await restaurantApi.createRestaurant(form);
                showToast("Restaurant created");
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
            showToast("Failed to save restaurant", "error");
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

    function askDeleteRestaurant(id) {
        setPendingDeleteId(id);
        setConfirmOpen(true);
    }

    async function confirmDeleteRestaurant() {
        if (!pendingDeleteId) return;
        try {
            await restaurantApi.deleteRestaurant(pendingDeleteId);
            showToast("Restaurant deleted");
            await loadRestaurants();
        } catch (err) {
            console.error(err);
            setError("Failed to delete restaurant");
            showToast("Failed to delete restaurant", "error");
        } finally {
            setPendingDeleteId(null);
            setConfirmOpen(false);
        }
    }

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
            showToast("Failed to load menu", "error");
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
                await restaurantApi.updateMenuItem(selectedRestaurant.id, editingMenuItemId, payload);
                showToast("Menu item updated");
            } else {
                await restaurantApi.addMenuItem(selectedRestaurant.id, payload);
                showToast("Menu item added");
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
            showToast("Failed to save menu item", "error");
        }
    }

    function askDeleteMenuItem(itemId) {
        setPendingDeleteId(itemId);
        setConfirmOpen(true);
    }

    async function confirmDeleteMenuItem() {
        if (!selectedRestaurant || !pendingDeleteId) {
            setConfirmOpen(false);
            setPendingDeleteId(null);
            return;
        }
        try {
            await restaurantApi.deleteMenuItem(selectedRestaurant.id, pendingDeleteId);
            showToast("Menu item deleted");
            await loadMenu(selectedRestaurant.id);
        } catch (err) {
            console.error(err);
            setError("Failed to delete menu item");
            showToast("Failed to delete menu item", "error");
        } finally {
            setPendingDeleteId(null);
            setConfirmOpen(false);
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

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto mt-10 space-y-8 p-6">
                <h2 className="text-3xl font-semibold text-gray-800">Admin: Restaurant Management</h2>

                {error && <p className="text-red-600 text-sm">{error}</p>}

                {/* RESTAURANT FORM CARD */}
                <div className="bg-white shadow border rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                        {editingRestaurant ? "Edit Restaurant" : "Create Restaurant"}
                    </h3>

                    <form className="grid md:grid-cols-2 gap-4" onSubmit={handleRestaurantSubmit}>
                        {[
                            { label: "Name", name: "name" },
                            { label: "Address", name: "address" },
                            { label: "City", name: "city" },
                            { label: "Cuisine Type", name: "cuisineType" },
                            { label: "Contact Number", name: "contactNumber" },
                        ].map((field) => (
                            <div key={field.name}>
                                <label className="text-sm text-gray-600">{field.label}</label>
                                <input
                                    name={field.name}
                                    value={form[field.name]}
                                    onChange={handleRestaurantInputChange}
                                    required={field.name === "name" || field.name === "address"}
                                    className="w-full border rounded-lg px-3 py-2 mt-1"
                                />
                            </div>
                        ))}

                        {/* Active Checkbox */}
                        <div className="flex items-center gap-2 mt-3">
                            <input type="checkbox" name="active" checked={form.active} onChange={handleRestaurantInputChange} className="w-4 h-4" />
                            <span>Active</span>
                        </div>

                        {/* Buttons */}
                        <div className="md:col-span-2 flex justify-end gap-3 mt-4">
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
                                    className="px-4 py-2 bg-gray-200 rounded-lg"
                                >
                                    Cancel
                                </button>
                            )}

                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                                {editingRestaurant ? "Update" : "Create"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* RESTAURANT TABLE */}
                <div className="bg-white shadow border rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Restaurant List</h3>

                    {!loading ? (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-sm">
                                <thead className="bg-gray-100">
                                <tr>
                                    {["ID", "Name", "City", "Cuisine", "Active", "Actions"].map((h) => (
                                        <th key={h} className="p-3 text-left border-b">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                                </thead>

                                <tbody>
                                {restaurants.map((r, index) => (
                                    <tr key={r.id} className={`border-b ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                                        <td className="p-3">{r.id}</td>
                                        <td className="p-3">{r.name}</td>
                                        <td className="p-3">{r.city}</td>
                                        <td className="p-3">{r.cuisineType}</td>
                                        <td className="p-3">{r.active ? "Yes" : "No"}</td>

                                        <td className="p-3 text-right space-x-3">
                                            <button onClick={() => handleEditRestaurant(r)} className="text-blue-600 hover:underline">
                                                Edit
                                            </button>
                                            <button onClick={() => handleManageMenu(r)} className="text-green-600 hover:underline">
                                                Menu
                                            </button>
                                            <button onClick={() => askDeleteRestaurant(r.id)} className="text-red-600 hover:underline">
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                {restaurants.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="text-center py-4 text-gray-500">
                                            No restaurants available
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-500">Loading...</p>
                    )}
                </div>

                {/* MENU MANAGEMENT */}
                {selectedRestaurant && (
                    <div className="bg-white shadow border rounded-xl p-6">
                        <h3 className="text-xl font-semibold mb-4">Menu for {selectedRestaurant.name}</h3>

                        {/* Menu Form */}
                        <form className="grid md:grid-cols-2 gap-4 mb-5" onSubmit={handleMenuSubmit}>
                            <div>
                                <label className="text-sm text-gray-600">Item Name</label>
                                <input name="itemName" value={menuForm.itemName} onChange={handleMenuInputChange} required className="w-full border rounded-lg px-3 py-2 mt-1" />
                            </div>

                            <div>
                                <label className="text-sm text-gray-600">Price</label>
                                <input type="number" step="0.01" name="price" value={menuForm.price} onChange={handleMenuInputChange} required className="w-full border rounded-lg px-3 py-2 mt-1" />
                            </div>

                            <div className="md:col-span-2">
                                <label className="text-sm text-gray-600">Description</label>
                                <textarea name="description" value={menuForm.description} onChange={handleMenuInputChange} rows={2} className="w-full border rounded-lg px-3 py-2 mt-1" />
                            </div>

                            <div className="flex items-center gap-2">
                                <input type="checkbox" name="available" checked={menuForm.available} onChange={handleMenuInputChange} />
                                <span>Available</span>
                            </div>

                            <div className="md:col-span-2 flex justify-end gap-3 mt-3">
                                {editingMenuItemId && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingMenuItemId(null);
                                            setMenuForm({ itemName: "", price: "", description: "", available: true });
                                        }}
                                        className="px-4 py-2 bg-gray-200 rounded-lg"
                                    >
                                        Cancel
                                    </button>
                                )}

                                <button className="px-4 py-2 bg-green-600 text-white rounded-lg">
                                    {editingMenuItemId ? "Update Item" : "Add Item"}
                                </button>
                            </div>
                        </form>

                        {/* Menu Table */}
                        <table className="w-full text-sm border-collapse">
                            <thead className="bg-gray-100">
                            <tr>
                                {["ID", "Name", "Price", "Available", "Actions"].map((h) => (
                                    <th key={h} className="p-3 text-left border-b">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                            </thead>

                            <tbody>
                            {menuItems.map((m, index) => (
                                <tr key={m.id} className={`border-b ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                                    <td className="p-3">{m.id}</td>
                                    <td className="p-3">{m.itemName}</td>
                                    <td className="p-3">₹{m.price}</td>
                                    <td className="p-3">{m.available ? "Yes" : "No"}</td>

                                    <td className="p-3 text-right space-x-3">
                                        <button onClick={() => handleEditMenuItem(m)} className="text-blue-600 hover:underline">
                                            Edit
                                        </button>
                                        <button onClick={() => askDeleteMenuItem(m.id)} className="text-red-600 hover:underline">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {menuItems.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center py-4 text-gray-500">
                                        No menu items available
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Confirm modal (shared) */}
                <Modal
                    open={confirmOpen}
                    title="Confirm delete"
                    message="Are you sure? This action cannot be undone."
                    onCancel={() => {
                        setConfirmOpen(false);
                        setPendingDeleteId(null);
                    }}
                    onConfirm={async () => {
                        // Determine whether pendingDeleteId maps to a menu item or restaurant depending on context
                        if (selectedRestaurant && menuItems.some((mi) => mi.id === pendingDeleteId)) {
                            await confirmDeleteMenuItem();
                        } else {
                            await confirmDeleteRestaurant();
                        }
                    }}
                    confirmLabel="Delete"
                    cancelLabel="Cancel"
                />
            </div>
        </AdminLayout>
    );
}