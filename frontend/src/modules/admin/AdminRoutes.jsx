import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/Layout/AdminLayout';
import AdminProtectedRoute from './components/AdminProtectedRoute';

// Lazy load admin pages for better performance
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Login = lazy(() => import('./pages/Login'));

// Orders
const Orders = lazy(() => import('./pages/Orders'));
const AllOrders = lazy(() => import('./pages/orders/AllOrders'));
const OrderTracking = lazy(() => import('./pages/orders/OrderTracking'));
const OrderNotifications = lazy(() => import('./pages/orders/OrderNotifications'));
const OrderDetail = lazy(() => import('./pages/OrderDetail'));
const Invoice = lazy(() => import('./pages/orders/Invoice'));
const ReturnRequests = lazy(() => import('./pages/ReturnRequests'));
const ReturnRequestDetail = lazy(() => import('./pages/ReturnRequestDetail'));
const RefundPolicy = lazy(() => import('./pages/policies/RefundPolicy'));

// Products
const Products = lazy(() => import('./pages/Products'));
const ManageProducts = lazy(() => import('./pages/products/ManageProducts'));

const AddProduct = lazy(() => import('./pages/products/AddProduct'));
const BulkUpload = lazy(() => import('./pages/products/BulkUpload'));
const TaxPricing = lazy(() => import('./pages/products/TaxPricing'));
const ProductRatings = lazy(() => import('./pages/products/ProductRatings'));
const ProductFAQs = lazy(() => import('./pages/products/ProductFAQs'));

// Categories & Brands
const Categories = lazy(() => import('./pages/Categories'));
const ManageCategories = lazy(() => import('./pages/categories/ManageCategories'));
const CategoryOrder = lazy(() => import('./pages/categories/CategoryOrder'));

const Brands = lazy(() => import('./pages/Brands'));
const ManageBrands = lazy(() => import('./pages/brands/ManageBrands'));


// Attributes
const AttributeSets = lazy(() => import('./pages/attributes/AttributeSets'));
const Attributes = lazy(() => import('./pages/attributes/Attributes'));
const AttributeValues = lazy(() => import('./pages/attributes/AttributeValues'));

// Customers
const Customers = lazy(() => import('./pages/Customers'));
const ViewCustomers = lazy(() => import('./pages/customers/ViewCustomers'));
const CustomerAddresses = lazy(() => import('./pages/customers/Addresses'));
const CustomerTransactions = lazy(() => import('./pages/customers/Transactions'));

// Inventory & Vendors
const Inventory = lazy(() => import('./pages/Inventory'));
const Vendors = lazy(() => import('./pages/Vendors'));
const ManageVendors = lazy(() => import('./pages/vendors/ManageVendors'));
const PendingApprovals = lazy(() => import('./pages/vendors/PendingApprovals'));
const CommissionRates = lazy(() => import('./pages/vendors/CommissionRates'));
const VendorAnalytics = lazy(() => import('./pages/vendors/VendorAnalytics'));
const VendorDetail = lazy(() => import('./pages/vendors/VendorDetail'));


// Locations
const Cities = lazy(() => import('./pages/locations/Cities'));
const Zipcodes = lazy(() => import('./pages/locations/Zipcodes'));

// Delivery
const DeliveryBoys = lazy(() => import('./pages/delivery/DeliveryBoys'));
const CashCollection = lazy(() => import('./pages/delivery/CashCollection'));

// Marketing & Offers
const Offers = lazy(() => import('./pages/offers/HomeSliders'));
const FestivalOffers = lazy(() => import('./pages/offers/FestivalOffers'));
const PromoCodes = lazy(() => import('./pages/PromoCodes'));
const Banners = lazy(() => import('./pages/Banners'));

// Support & Notifications
const PushNotifications = lazy(() => import('./pages/notifications/PushNotifications'));
const CustomMessages = lazy(() => import('./pages/notifications/CustomMessages'));
const LiveChat = lazy(() => import('./pages/support/LiveChat'));
const TicketTypes = lazy(() => import('./pages/support/TicketTypes'));
const Tickets = lazy(() => import('./pages/support/Tickets'));

// Firebase
const PushConfig = lazy(() => import('./pages/firebase/PushConfig'));
const Authentication = lazy(() => import('./pages/firebase/Authentication'));

// Reports
const SalesReport = lazy(() => import('./pages/reports/SalesReport'));
const InventoryReport = lazy(() => import('./pages/reports/InventoryReport'));

// Finance & Analytics
const Analytics = lazy(() => import('./pages/Analytics'));
const RevenueOverview = lazy(() => import('./pages/finance/RevenueOverview'));
const ProfitLoss = lazy(() => import('./pages/finance/ProfitLoss'));
const OrderTrends = lazy(() => import('./pages/finance/OrderTrends'));
const PaymentBreakdown = lazy(() => import('./pages/finance/PaymentBreakdown'));
const TaxReports = lazy(() => import('./pages/finance/TaxReports'));
const RefundReports = lazy(() => import('./pages/finance/RefundReports'));

// Settings & Policies
const Settings = lazy(() => import('./pages/Settings'));
const PrivacyPolicy = lazy(() => import('./pages/policies/PrivacyPolicy'));
const TermsConditions = lazy(() => import('./pages/policies/TermsConditions'));

const AdminRoutes = () => {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading Admin...</div>}>
            <Routes>
                {/* Admin Login - No Layout */}
                <Route path="login" element={<Login />} />

                {/* Secure Admin Routes */}
                <Route
                    path="/"
                    element={
                        <AdminProtectedRoute>
                            <AdminLayout />
                        </AdminProtectedRoute>
                    }
                >
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />

                    {/* Orders */}
                    <Route path="orders">
                        <Route index element={<Orders />} />
                        <Route path="all-orders" element={<AllOrders />} />
                        <Route path="order-tracking" element={<OrderTracking />} />
                        <Route path="order-notifications" element={<OrderNotifications />} />
                        <Route path="detail/:id" element={<OrderDetail />} />
                        <Route path="invoice/:id" element={<Invoice />} />
                    </Route>


                    {/* Return Requests */}
                    <Route path="return-requests" element={<ReturnRequests />} />
                    <Route path="return-requests/:id" element={<ReturnRequestDetail />} />

                    {/* Products */}
                    <Route path="products">
                        <Route index element={<Products />} />
                        <Route path="manage-products" element={<ManageProducts />} />
                        <Route path="add-product" element={<AddProduct />} />
                        <Route path="bulk-upload" element={<BulkUpload />} />
                        <Route path="tax-pricing" element={<TaxPricing />} />
                        <Route path="product-ratings" element={<ProductRatings />} />
                        <Route path="product-faqs" element={<ProductFAQs />} />
                    </Route>


                    {/* Attributes */}
                    <Route path="attributes">
                        <Route index element={<Navigate to="attributes" replace />} />
                        <Route path="attribute-sets" element={<AttributeSets />} />
                        <Route path="attributes" element={<Attributes />} />
                        <Route path="attribute-values" element={<AttributeValues />} />
                    </Route>


                    {/* Categories & Brands */}
                    <Route path="categories">
                        <Route index element={<Categories />} />
                        <Route path="manage-categories" element={<ManageCategories />} />
                        <Route path="category-order" element={<CategoryOrder />} />
                    </Route>

                    <Route path="brands">
                        <Route index element={<Brands />} />
                        <Route path="manage-brands" element={<ManageBrands />} />
                    </Route>


                    {/* Customers */}
                    <Route path="customers">
                        <Route index element={<Customers />} />
                        <Route path="view-customers" element={<ViewCustomers />} />
                        <Route path="addresses" element={<CustomerAddresses />} />
                        <Route path="transactions" element={<CustomerTransactions />} />
                    </Route>


                    {/* Inventory */}
                    <Route path="inventory" element={<Inventory />} />

                    {/* Deliveries */}
                    <Route path="delivery">
                        <Route index element={<Navigate to="delivery-boys" replace />} />
                        <Route path="delivery-boys" element={<DeliveryBoys />} />
                        <Route path="cash-collection" element={<CashCollection />} />
                    </Route>


                    {/* Vendors */}
                    <Route path="vendors">
                        <Route index element={<Vendors />} />
                        <Route path="manage-vendors" element={<ManageVendors />} />
                        <Route path="pending-approvals" element={<PendingApprovals />} />
                        <Route path="commission-rates" element={<CommissionRates />} />
                        <Route path="vendor-analytics" element={<VendorAnalytics />} />
                        <Route path=":id" element={<VendorDetail />} />
                    </Route>


                    {/* Locations */}
                    <Route path="locations">
                        <Route path="cities" element={<Cities />} />
                        <Route path="zipcodes" element={<Zipcodes />} />
                    </Route>

                    {/* Marketing */}
                    <Route path="offers">
                        <Route path="home-sliders" element={<Offers />} />
                        <Route path="festival-offers" element={<FestivalOffers />} />
                    </Route>
                    <Route path="promocodes" element={<PromoCodes />} />
                    <Route path="banners" element={<Banners />} />

                    {/* Support & Notifications */}
                    <Route path="notifications">
                        <Route path="push-notifications" element={<PushNotifications />} />
                        <Route path="custom-messages" element={<CustomMessages />} />
                    </Route>
                    <Route path="support">
                        <Route path="live-chat" element={<LiveChat />} />
                        <Route path="ticket-types" element={<TicketTypes />} />
                        <Route path="tickets" element={<Tickets />} />
                    </Route>

                    {/* Firebase */}
                    <Route path="firebase">
                        <Route path="push-config" element={<PushConfig />} />
                        <Route path="authentication" element={<Authentication />} />
                    </Route>

                    {/* Reports */}
                    <Route path="reports">
                        <Route path="sales-report" element={<SalesReport />} />
                        <Route path="inventory-report" element={<InventoryReport />} />
                    </Route>

                    {/* Finance */}
                    <Route path="finance">
                        <Route path="revenue-overview" element={<RevenueOverview />} />
                        <Route path="profit-loss" element={<ProfitLoss />} />
                        <Route path="order-trends" element={<OrderTrends />} />
                        <Route path="payment-breakdown" element={<PaymentBreakdown />} />
                        <Route path="tax-reports" element={<TaxReports />} />
                        <Route path="refund-reports" element={<RefundReports />} />
                    </Route>
                    <Route path="analytics" element={<Analytics />} />

                    {/* Settings */}
                    <Route path="settings">
                        <Route index element={<Navigate to="general" replace />} />
                        <Route path="general" element={<Settings />} />
                        <Route path="payment-shipping" element={<Settings />} />
                        <Route path="orders-customers" element={<Settings />} />
                        <Route path="products-inventory" element={<Settings />} />
                        <Route path="content-features" element={<Settings />} />
                        <Route path="notifications-seo" element={<Settings />} />
                    </Route>

                    {/* Policies */}
                    <Route path="policies">
                        <Route path="privacy-policy" element={<PrivacyPolicy />} />
                        <Route path="refund-policy" element={<RefundPolicy />} />
                        <Route path="terms-conditions" element={<TermsConditions />} />
                    </Route>
                </Route>
            </Routes>
        </Suspense>
    );
};

export default AdminRoutes;
