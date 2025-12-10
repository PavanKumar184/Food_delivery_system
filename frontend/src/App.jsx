import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import RestaurantMenu from "./pages/RestaurantMenu";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderStatus from "./pages/OrderStatus";
import DeliveryStatus from "./pages/DeliveryStatus";
import AdminRestaurants from "./pages/AdminRestaurants";
import AdminOrders from "./pages/AdminOrders";
import AdminDeliveries from "./pages/AdminDeliveries";
import AdminHome from "./pages/AdminHome";
export default function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/restaurant/:id" element={<RestaurantMenu />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/order-status" element={<OrderStatus />} />
                    <Route path="/delivery-status" element={<DeliveryStatus />} />

                    {/* Admin */}
                    <Route path="/admin" element={<AdminHome />} />
                    <Route path="/admin/restaurants" element={<AdminRestaurants />} />
                    <Route path="/admin/orders" element={<AdminOrders />} />
                    <Route path="/admin/deliveries" element={<AdminDeliveries />} />
                </Routes>

            </div>
        </BrowserRouter>
    );
}
