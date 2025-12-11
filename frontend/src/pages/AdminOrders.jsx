import { useEffect, useState } from "react";
import { orderApi } from "../api/orderApi";
import AdminLayout from "../layouts/AdminLayout";
import Modal from "../components/Modal";
import { useToast } from "../context/ToastContext";

const ORDER_STATUSES = [
    "CREATED",
    "CONFIRMED",
    "PREPARING",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "CANCELLED",
];

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [filterPhone, setFilterPhone] = useState("");
    const [filterRestaurantId, setFilterRestaurantId] = useState("");

    const [selectedOrder, setSelectedOrder] = useState(null);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pendingDeleteId, setPendingDeleteId] = useState(null);

    const { showToast } = useToast();

    useEffect(() => {
        loadOrders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function loadOrders(params = {}) {
        setLoading(true);
        setError("");
        try {
            const res = await orderApi.listOrders(params);
            setOrders(res.data);
        } catch (err) {
            console.error(err);
            setError("Failed to load orders");
            showToast("Failed to load orders", "error");
        } finally {
            setLoading(false);
        }
    }

    function handleFilterSubmit(e) {
        e.preventDefault();
        const params = {};
        if (filterPhone) params.customerPhone = filterPhone;
        if (filterRestaurantId) params.restaurantId = filterRestaurantId;
        loadOrders(params);
    }

    function handleResetFilters() {
        setFilterPhone("");
        setFilterRestaurantId("");
        loadOrders();
    }

    async function handleChangeStatus(order, newStatus) {
        try {
            await orderApi.updateStatus(order.id, newStatus);
            showToast("Order status updated");
            // refresh list / selected order
            await loadOrders({
                customerPhone: filterPhone || undefined,
                restaurantId: filterRestaurantId || undefined,
            });
            if (selectedOrder && selectedOrder.id === order.id) {
                const res = await orderApi.getOrder(order.id);
                setSelectedOrder(res.data);
            }
        } catch (err) {
            console.error(err);
            setError("Failed to update order status");
            showToast("Failed to update order status", "error");
        }
    }

    function askDelete(orderId) {
        setPendingDeleteId(orderId);
        setConfirmOpen(true);
    }

    async function confirmDelete() {
        if (!pendingDeleteId) return;
        try {
            await orderApi.deleteOrder(pendingDeleteId);
            showToast("Order deleted");
            await loadOrders({
                customerPhone: filterPhone || undefined,
                restaurantId: filterRestaurantId || undefined,
            });
            if (selectedOrder && selectedOrder.id === pendingDeleteId) {
                setSelectedOrder(null);
            }
        } catch (err) {
            console.error(err);
            setError("Failed to delete order");
            showToast("Failed to delete order", "error");
        } finally {
            setPendingDeleteId(null);
            setConfirmOpen(false);
        }
    }

    async function handleView(orderId) {
        try {
            const res = await orderApi.getOrder(orderId);
            setSelectedOrder(res.data);
        } catch (err) {
            console.error(err);
            setError("Failed to load order details");
            showToast("Failed to load order details", "error");
        }
    }

    return (
        <AdminLayout>
            <div className="p-6 max-w-6xl mx-auto">
                <h2 className="text-2xl font-semibold mb-4">Admin - Orders</h2>

                {error && <p className="text-red-600 mb-3">{error}</p>}

                {/* Filter form */}
                <form
                    onSubmit={handleFilterSubmit}
                    className="bg-white rounded-xl shadow border p-4 mb-4 grid md:grid-cols-3 gap-4"
                >
                    <div>
                        <label className="block text-sm mb-1">Customer Phone</label>
                        <input
                            value={filterPhone}
                            onChange={(e) => setFilterPhone(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                            placeholder="9876543210"
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Restaurant ID</label>
                        <input
                            value={filterRestaurantId}
                            onChange={(e) => setFilterRestaurantId(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                            placeholder="1"
                        />
                    </div>

                    <div className="flex items-end gap-2">
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                            Filter
                        </button>
                        <button type="button" onClick={handleResetFilters} className="bg-gray-200 px-4 py-2 rounded">
                            Reset
                        </button>
                    </div>
                </form>

                {/* Orders table */}
                <div className="bg-white rounded-xl shadow border p-4 mb-6">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xl font-semibold">Orders</h3>
                        {loading && <span className="text-sm text-gray-500">Loading...</span>}
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                            <tr className="border-b">
                                <th className="py-2 text-left">ID</th>
                                <th className="py-2 text-left">Restaurant</th>
                                <th className="py-2 text-left">Customer</th>
                                <th className="py-2 text-left">Phone</th>
                                <th className="py-2 text-left">Status</th>
                                <th className="py-2 text-left">Total</th>
                                <th className="py-2 text-right">Actions</th>
                            </tr>
                            </thead>

                            <tbody>
                            {orders.map((o) => (
                                <tr key={o.id} className="border-b">
                                    <td className="py-2">{o.id}</td>
                                    <td className="py-2">{o.restaurantId}</td>
                                    <td className="py-2">{o.customerName}</td>
                                    <td className="py-2">{o.customerPhone}</td>

                                    <td className="py-2">
                                        <select
                                            value={o.status}
                                            onChange={(e) => handleChangeStatus(o, e.target.value)}
                                            className="border rounded px-2 py-1 text-xs"
                                        >
                                            {ORDER_STATUSES.map((s) => (
                                                <option key={s} value={s}>
                                                    {s}
                                                </option>
                                            ))}
                                        </select>
                                    </td>

                                    <td className="py-2">₹{o.totalAmount}</td>

                                    <td className="py-2 text-right space-x-2">
                                        <button onClick={() => handleView(o.id)} className="text-blue-600 hover:underline">
                                            View
                                        </button>
                                        <button onClick={() => askDelete(o.id)} className="text-red-600 hover:underline">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {orders.length === 0 && !loading && (
                                <tr>
                                    <td colSpan={7} className="py-3 text-center text-gray-500">
                                        No orders found.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Selected Order details */}
                {selectedOrder && (
                    <div className="bg-white rounded-xl shadow border p-4">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-xl font-semibold">Order #{selectedOrder.id}</h3>
                            <button onClick={() => setSelectedOrder(null)} className="text-sm text-gray-500 hover:underline">
                                Close
                            </button>
                        </div>

                        <p className="mb-1">
                            <span className="font-semibold">Restaurant ID:</span> {selectedOrder.restaurantId}
                        </p>
                        <p className="mb-1">
                            <span className="font-semibold">Customer:</span> {selectedOrder.customerName}
                        </p>
                        <p className="mb-1">
                            <span className="font-semibold">Phone:</span> {selectedOrder.customerPhone}
                        </p>
                        <p className="mb-1">
                            <span className="font-semibold">Address:</span> {selectedOrder.deliveryAddress}
                        </p>
                        <p className="mb-1">
                            <span className="font-semibold">Status:</span> {selectedOrder.status}
                        </p>
                        <p className="mb-3">
                            <span className="font-semibold">Total:</span> ₹{selectedOrder.totalAmount}
                        </p>

                        <h4 className="font-semibold mb-2">Items</h4>
                        <ul className="divide-y text-sm">
                            {selectedOrder.items?.map((it) => (
                                <li key={it.id} className="flex justify-between py-1">
                  <span>
                    {it.itemName} × {it.quantity}
                  </span>
                                    <span>₹{it.subTotal}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Confirm modal */}
                <Modal
                    open={confirmOpen}
                    title="Delete order"
                    message="Are you sure you want to delete this order? This action cannot be undone."
                    onCancel={() => {
                        setConfirmOpen(false);
                        setPendingDeleteId(null);
                    }}
                    onConfirm={confirmDelete}
                    confirmLabel="Delete"
                    cancelLabel="Cancel"
                />
            </div>
        </AdminLayout>
    );
}