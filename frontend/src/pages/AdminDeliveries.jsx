import { useEffect, useState } from "react";
import { deliveryApi } from "../api/deliveryApi";
import Modal from "../components/Modal";
import AdminLayout from "../layouts/AdminLayout";
import { useToast } from "../context/ToastContext";

const DELIVERY_STATUSES = [
    "ASSIGNED",
    "PICKED_UP",
    "ON_THE_WAY",
    "DELIVERED",
    "CANCELLED",
];

export default function AdminDeliveries() {
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        orderId: "",
        customerName: "",
        customerPhone: "",
        deliveryAddress: "",
    });

    // modal state
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pendingDeleteId, setPendingDeleteId] = useState(null);

    const { showToast } = useToast();

    useEffect(() => {
        loadDeliveries();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function loadDeliveries() {
        setLoading(true);
        setError("");
        try {
            const res = await deliveryApi.listDeliveries();
            setDeliveries(res.data);
        } catch (err) {
            console.error(err);
            setError("Failed to load deliveries");
        } finally {
            setLoading(false);
        }
    }

    function handleFormChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    async function handleCreate(e) {
        e.preventDefault();
        setError("");
        try {
            const payload = {
                orderId: form.orderId ? Number(form.orderId) : null,
                customerName: form.customerName,
                customerPhone: form.customerPhone,
                deliveryAddress: form.deliveryAddress,
            };
            await deliveryApi.createDelivery(payload);
            setForm({
                orderId: "",
                customerName: "",
                customerPhone: "",
                deliveryAddress: "",
            });
            showToast("Delivery created");
            await loadDeliveries();
        } catch (err) {
            console.error(err);
            setError("Failed to create delivery");
            showToast("Failed to create delivery", "error");
        }
    }

    async function handleChangeStatus(delivery, newStatus) {
        try {
            await deliveryApi.updateStatus(delivery.id, newStatus);
            showToast("Status updated");
            await loadDeliveries();
        } catch (err) {
            console.error(err);
            setError("Failed to update delivery status");
            showToast("Failed to update delivery status", "error");
        }
    }

    function askDelete(id) {
        setPendingDeleteId(id);
        setConfirmOpen(true);
    }

    async function confirmDelete() {
        if (!pendingDeleteId) return;
        try {
            await deliveryApi.deleteDelivery(pendingDeleteId);
            showToast("Delivery deleted");
            await loadDeliveries();
        } catch (err) {
            console.error(err);
            setError("Failed to delete delivery");
            showToast("Failed to delete delivery", "error");
        } finally {
            setConfirmOpen(false);
            setPendingDeleteId(null);
        }
    }

    return (
        <AdminLayout>
            <div className="p-6 max-w-6xl mx-auto">
                <h2 className="text-2xl font-semibold mb-4">Admin - Deliveries</h2>

                {error && <p className="text-red-600 mb-3">{error}</p>}

                {/* Create Delivery */}
                <div className="bg-white rounded-xl shadow border p-4 mb-6">
                    <h3 className="text-xl font-semibold mb-3">Create Delivery</h3>

                    <form className="grid md:grid-cols-2 gap-4" onSubmit={handleCreate}>
                        <div>
                            <label className="block text-sm mb-1">Order ID</label>
                            <input
                                name="orderId"
                                value={form.orderId}
                                onChange={handleFormChange}
                                className="w-full border rounded px-3 py-2"
                                placeholder="Order ID (optional but recommended)"
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-1">Customer Name</label>
                            <input
                                name="customerName"
                                value={form.customerName}
                                onChange={handleFormChange}
                                required
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-1">Customer Phone</label>
                            <input
                                name="customerPhone"
                                value={form.customerPhone}
                                onChange={handleFormChange}
                                required
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm mb-1">Delivery Address</label>
                            <textarea
                                name="deliveryAddress"
                                value={form.deliveryAddress}
                                onChange={handleFormChange}
                                rows={2}
                                required
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>

                        <div className="md:col-span-2 flex justify-end">
                            <button
                                type="submit"
                                className="bg-green-600 text-white px-4 py-2 rounded"
                            >
                                Create
                            </button>
                        </div>
                    </form>
                </div>

                {/* Deliveries table */}
                <div className="bg-white rounded-xl shadow border p-4">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xl font-semibold">Deliveries</h3>
                        {loading && <span className="text-sm text-gray-500">Loading...</span>}
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                            <tr className="border-b">
                                <th className="py-2 text-left">ID</th>
                                <th className="py-2 text-left">Order</th>
                                <th className="py-2 text-left">Customer</th>
                                <th className="py-2 text-left">Phone</th>
                                <th className="py-2 text-left">Status</th>
                                <th className="py-2 text-left">Address</th>
                                <th className="py-2 text-right">Actions</th>
                            </tr>
                            </thead>

                            <tbody>
                            {deliveries.map((d) => (
                                <tr key={d.id} className="border-b">
                                    <td className="py-2">{d.id}</td>
                                    <td className="py-2">{d.orderId}</td>
                                    <td className="py-2">{d.customerName}</td>
                                    <td className="py-2">{d.customerPhone}</td>

                                    <td className="py-2">
                                        <select
                                            value={d.status}
                                            onChange={(e) => handleChangeStatus(d, e.target.value)}
                                            className="border rounded px-2 py-1 text-xs"
                                        >
                                            {DELIVERY_STATUSES.map((s) => (
                                                <option key={s} value={s}>
                                                    {s}
                                                </option>
                                            ))}
                                        </select>
                                    </td>

                                    <td className="py-2 max-w-xs truncate">{d.deliveryAddress}</td>

                                    <td className="py-2 text-right">
                                        <button
                                            onClick={() => askDelete(d.id)}
                                            className="text-red-600 hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {deliveries.length === 0 && !loading && (
                                <tr>
                                    <td colSpan={7} className="py-3 text-center text-gray-500">
                                        No deliveries found.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Confirm modal */}
                <Modal
                    open={confirmOpen}
                    title="Delete delivery"
                    message="Are you sure you want to delete this delivery? This action cannot be undone."
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