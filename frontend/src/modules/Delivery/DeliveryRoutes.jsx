import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DeliveryLayout from './components/Layout/DeliveryLayout';
import DeliveryProtectedRoute from './components/DeliveryProtectedRoute';

// Lazy load delivery pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Login = lazy(() => import('./pages/Login'));
const Orders = lazy(() => import('./pages/Orders'));
const OrderDetail = lazy(() => import('./pages/OrderDetail'));
const Profile = lazy(() => import('./pages/Profile'));

const DeliveryRoutes = () => {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading Delivery...</div>}>
            <Routes>
                {/* Public Delivery Routes */}
                <Route path="login" element={<Login />} />

                {/* Protected Delivery Routes */}
                <Route
                    path="/"
                    element={
                        <DeliveryProtectedRoute>
                            <DeliveryLayout />
                        </DeliveryProtectedRoute>
                    }
                >
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="orders/:orderId" element={<OrderDetail />} />
                    <Route path="profile" element={<Profile />} />
                </Route>
            </Routes>
        </Suspense>
    );
};

export default DeliveryRoutes;
