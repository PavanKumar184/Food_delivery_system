import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import {ToastProvider} from "./context/ToastContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <CartProvider>
            <ToastProvider><App /></ToastProvider>

        </CartProvider>
    </React.StrictMode>
);
