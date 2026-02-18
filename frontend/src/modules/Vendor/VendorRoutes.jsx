import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import VendorLayout from './components/Layout/VendorLayout';
import VendorProtectedRoute from './components/VendorProtectedRoute';

// Lazy load vendor pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Products = lazy(() => import('./pages/Products'));
const AddProduct = lazy(() => import('./pages/products/AddProduct'));
const ManageProducts = lazy(() => import('./pages/products/ManageProducts'));
const BulkUpload = lazy(() => import('./pages/products/BulkUpload'));
const Orders = lazy(() => import('./pages/Orders'));
const OrderDetail = lazy(() => import('./pages/orders/OrderDetail'));
const AllOrders = lazy(() => import('./pages/orders/AllOrders'));
const OrderTracking = lazy(() => import('./pages/orders/OrderTracking'));
const Earnings = lazy(() => import('./pages/Earnings'));
const WalletHistory = lazy(() => import('./pages/WalletHistory'));
const Customers = lazy(() => import('./pages/Customers'));
const CustomerDetail = lazy(() => import('./pages/CustomerDetail'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Reports = lazy(() => import('./pages/Reports'));
const SalesReport = lazy(() => import('./pages/reports/SalesReport'));
const CustomerInsightsReport = lazy(() => import('./pages/reports/CustomerInsightsReport'));
const ProductPerformanceReport = lazy(() => import('./pages/reports/ProductPerformanceReport'));
const InventoryReports = lazy(() => import('./pages/InventoryReports'));
const Notifications = lazy(() => import('./pages/Notifications'));
const Chat = lazy(() => import('./pages/Chat'));
const Settings = lazy(() => import('./pages/Settings'));
const ProfileSettings = lazy(() => import('./pages/settings/ProfileSettings'));
const PaymentSettings = lazy(() => import('./pages/settings/PaymentSettings'));
const ShippingSettings = lazy(() => import('./pages/settings/ShippingSettings'));
const StoreSettings = lazy(() => import('./pages/Settings')); // Use Settings as fallback
const ReturnRequests = lazy(() => import('./pages/ReturnRequests'));
const ReturnRequestDetail = lazy(() => import('./pages/returns/ReturnRequestDetail'));
const SupportTickets = lazy(() => import('./pages/SupportTickets'));
const Verification = lazy(() => import('./pages/Verification'));
const Documents = lazy(() => import('./pages/Documents'));
const PickupLocations = lazy(() => import('./pages/PickupLocations'));
const ProductAttributes = lazy(() => import('./pages/ProductAttributes'));
const ProductFAQs = lazy(() => import('./pages/ProductFAQs'));
const ProductReviews = lazy(() => import('./pages/ProductReviews'));
const Promotions = lazy(() => import('./pages/Promotions'));
const StockManagement = lazy(() => import('./pages/StockManagement'));
const TaxPricing = lazy(() => import('./pages/TaxPricing'));
const ShippingManagement = lazy(() => import('./pages/ShippingManagement'));
const LanguageSettings = lazy(() => import('./pages/LanguageSettings'));
const PerformanceMetrics = lazy(() => import('./pages/PerformanceMetrics'));

const VendorRoutes = () => {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading Vendor...</div>}>
            <Routes>
                {/* Public Vendor Routes */}
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="verification" element={<Verification />} />

                {/* Protected Vendor Routes */}
                <Route
                    path="/"
                    element={
                        <VendorProtectedRoute>
                            <VendorLayout />
                        </VendorProtectedRoute>
                    }
                >
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />

                    {/* Products */}
                    <Route path="products">
                        <Route index element={<Navigate to="manage-products" replace />} />
                        <Route path="manage-products" element={<ManageProducts />} />
                        <Route path="add-product" element={<AddProduct />} />
                        <Route path="bulk-upload" element={<BulkUpload />} />
                        <Route path="product-faqs" element={<ProductFAQs />} />
                        <Route path="product-attributes" element={<ProductAttributes />} />
                        <Route path="tax-pricing" element={<TaxPricing />} />
                        <Route path="reviews" element={<ProductReviews />} />
                        <Route path="stock" element={<StockManagement />} />
                    </Route>

                    {/* Orders */}
                    <Route path="orders">
                        <Route index element={<Orders />} />
                        <Route path="all-orders" element={<AllOrders />} />
                        <Route path="order-tracking" element={<OrderTracking />} />
                        <Route path="order-tracking/:id" element={<OrderTracking />} />
                        <Route path="detail/:id" element={<OrderDetail />} />
                        <Route path=":id" element={<OrderDetail />} />
                    </Route>

                    {/* Single Page Routes (aligned with Menu) */}
                    <Route path="return-requests" element={<ReturnRequests />} />
                    <Route path="return-requests/:id" element={<ReturnRequestDetail />} />
                    <Route path="product-reviews" element={<ProductReviews />} />
                    <Route path="stock-management" element={<StockManagement />} />
                    <Route path="wallet-history" element={<WalletHistory />} />
                    <Route path="pickup-locations" element={<PickupLocations />} />
                    <Route path="chat" element={<Chat />} />
                    <Route path="promotions" element={<Promotions />} />
                    <Route path="notifications" element={<Notifications />} />
                    <Route path="shipping-management" element={<ShippingManagement />} />
                    <Route path="customers" element={<Customers />} />
                    <Route path="customer-detail/:id" element={<CustomerDetail />} />
                    <Route path="support-tickets" element={<SupportTickets />} />
                    <Route path="inventory-reports" element={<InventoryReports />} />
                    <Route path="performance-metrics" element={<PerformanceMetrics />} />
                    <Route path="analytics" element={<Analytics />} />
                    <Route path="documents" element={<Documents />} />

                    {/* Legacy/Redirect Routes */}
                    <Route path="returns" element={<Navigate to="/vendor/return-requests" replace />} />
                    <Route path="support" element={<Navigate to="/vendor/support-tickets" replace />} />
                    <Route path="performance" element={<Navigate to="/vendor/performance-metrics" replace />} />
                    <Route path="wallet" element={<Navigate to="/vendor/wallet-history" replace />} />

                    {/* Earnings & Wallet */}
                    <Route path="earnings">
                        <Route index element={<Earnings />} />
                        <Route path="overview" element={<Earnings />} />
                        <Route path="commission-history" element={<Earnings />} />
                        <Route path="settlement-history" element={<Earnings />} />
                    </Route>

                    {/* Reports (Nested) */}
                    <Route path="reports">
                        <Route index element={<Reports />} />
                        <Route path="sales" element={<SalesReport />} />
                        <Route path="customer-insights" element={<CustomerInsightsReport />} />
                        <Route path="product-performance" element={<ProductPerformanceReport />} />
                        <Route path="inventory" element={<InventoryReports />} />
                    </Route>

                    {/* Settings & Profile */}
                    <Route path="settings">
                        <Route index element={<Settings />} />
                        <Route path="profile" element={<ProfileSettings />} />
                        <Route path="payment" element={<PaymentSettings />} />
                        <Route path="shipping" element={<ShippingSettings />} />
                        <Route path="store" element={<Settings />} />
                        <Route path="language" element={<LanguageSettings />} />
                    </Route>

                    {/* Top level Profile */}
                    <Route path="profile" element={<ProfileSettings />} />
                </Route>
            </Routes>
        </Suspense>
    );
};

export default VendorRoutes;
