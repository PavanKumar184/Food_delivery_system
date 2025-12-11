import React from "react";

export default function Modal({ open, title, message, onCancel, onConfirm, confirmLabel = "Confirm", cancelLabel = "Cancel" }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* backdrop */}
            <div
                className="absolute inset-0 bg-black/40"
                onClick={onCancel}
                aria-hidden="true"
            />

            {/* modal */}
            <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full p-6 z-10">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
                <p className="text-sm text-gray-600 mb-4">{message}</p>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}