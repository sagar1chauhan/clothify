import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RouteWrapper from '../shared/components/RouteWrapper';

// User Pages
import HomePage from '../modules/user/pages/Home/HomePage';
import ShopPage from '../modules/user/pages/Shop/ShopPage';
import ProductDetailsPage from '../modules/user/pages/Product/ProductDetailsPage';
import CartPage from '../modules/user/pages/Cart/CartPage';
import AccountPage from '../modules/user/pages/Profile/AccountPage';
import LegalPage from '../modules/user/pages/Profile/LegalPage';
import ProfilePage from '../modules/user/pages/Profile/ProfilePage';
import OrderDetailsPage from '../modules/user/pages/Orders/OrderDetailsPage';
import OrdersPage from '../modules/user/pages/Orders/OrdersPage';
import OffersPage from '../modules/user/pages/Offers/OffersPage';
import AddressesPage from '../modules/user/pages/Addresses/AddressesPage';
import ReferPage from '../modules/user/pages/Refer/ReferPage';
import EventsPage from '../modules/user/pages/Events/EventsPage';
import ProductsPage from '../modules/user/pages/Products/ProductsPage';
import WishlistPage from '../modules/user/pages/Wishlist/WishlistPage';
import LoginPage from '../modules/user/pages/Auth/LoginPage';
import CheckoutPage from '../modules/user/pages/Checkout/CheckoutPage';
import PaymentPage from '../modules/user/pages/Payment/PaymentPage';

// Module Routes imports
import AdminRoutes from '../modules/admin/AdminRoutes';
import VendorRoutes from '../modules/Vendor/VendorRoutes';
import DeliveryRoutes from '../modules/Delivery/DeliveryRoutes';

// Admin Auth Pages
import AdminLogin from '../modules/admin/pages/Login';

// Delivery Auth Pages
import DeliveryLogin from '../modules/Delivery/pages/Login';

// Vendor Auth Pages
import VendorLogin from '../modules/Vendor/pages/Login';
import VendorRegister from '../modules/Vendor/pages/Register';
import VendorVerification from '../modules/Vendor/pages/Verification';


const AppRoutes = () => {
    return (
        <Routes>
            {/* ================== USER APP ROUTES ================== */}
            <Route path="/" element={<RouteWrapper><HomePage /></RouteWrapper>} />
            <Route path="/shop" element={<RouteWrapper><ShopPage /></RouteWrapper>} />
            <Route path="/product/:id" element={<RouteWrapper><ProductDetailsPage /></RouteWrapper>} />
            <Route path="/products" element={<RouteWrapper><ProductsPage /></RouteWrapper>} />
            <Route path="/cart" element={<RouteWrapper><CartPage /></RouteWrapper>} />
            <Route path="/search" element={<RouteWrapper><ProductsPage /></RouteWrapper>} />

            {/* Auth Routes */}
            <Route path="/login" element={<RouteWrapper><LoginPage /></RouteWrapper>} />
            <Route path="/checkout" element={<RouteWrapper><CheckoutPage /></RouteWrapper>} />
            <Route path="/payment" element={<RouteWrapper><PaymentPage /></RouteWrapper>} />

            {/* Protected User Routes (Protection handled inside page or components for now as per current structure) */}
            <Route path="/account" element={<RouteWrapper><AccountPage /></RouteWrapper>} />
            <Route path="/profile" element={<RouteWrapper><ProfilePage /></RouteWrapper>} />
            <Route path="/orders" element={<RouteWrapper><OrdersPage /></RouteWrapper>} />
            <Route path="/orders/:orderId" element={<RouteWrapper><OrderDetailsPage /></RouteWrapper>} />
            <Route path="/addresses" element={<RouteWrapper><AddressesPage /></RouteWrapper>} />
            <Route path="/wishlist" element={<RouteWrapper><WishlistPage /></RouteWrapper>} />
            <Route path="/offers" element={<RouteWrapper><OffersPage /></RouteWrapper>} />
            <Route path="/refer" element={<RouteWrapper><ReferPage /></RouteWrapper>} />
            <Route path="/events" element={<RouteWrapper><EventsPage /></RouteWrapper>} />
            <Route path="/legal/:pageId" element={<RouteWrapper><LegalPage /></RouteWrapper>} />


            {/* ================== ADMIN MODULE ROUTES ================== */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Main Admin Entry - Delegates to AdminRoutes for all children */}
            <Route path="/admin/*" element={<AdminRoutes />} />


            {/* ================== VENDOR MODULE ROUTES ================== */}
            <Route path="/vendor/login" element={<VendorLogin />} />
            <Route path="/vendor/register" element={<VendorRegister />} />
            <Route path="/vendor/verification" element={<VendorVerification />} />

            {/* Main Vendor Entry - Delegates to VendorRoutes for all children */}
            <Route path="/vendor/*" element={<VendorRoutes />} />


            {/* ================== DELIVERY MODULE ROUTES ================== */}
            <Route path="/delivery/login" element={<DeliveryLogin />} />

            {/* Main Delivery Entry - Delegates to DeliveryRoutes for all children */}
            <Route path="/delivery/*" element={<DeliveryRoutes />} />

        </Routes>
    );
};

export default AppRoutes;
