import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, AdminRoute } from '../components/RouteGuards';

// Layouts
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';

// Pages
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import CourtListPage from '../pages/CourtListPage';
import CourtDetailPage from '../pages/CourtDetailPage';
import BookingPage from '../pages/BookingPage';
import BookingHistoryPage from '../pages/BookingHistoryPage';
import AdminDashboard from '../pages/AdminDashboard';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes with Main Layout */}
            <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="courts" element={<CourtListPage />} />
                <Route path="courts/:id" element={<CourtDetailPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />

                {/* Protected User Routes */}
                <Route element={<ProtectedRoute />}>
                    <Route path="book/:id" element={<BookingPage />} />
                    <Route path="bookings" element={<BookingHistoryPage />} />
                </Route>
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminRoute />}>
                <Route element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    {/* Placeholders for future admin sections */}
                    <Route path="courts" element={<div className="p-8">Court Management Coming Soon</div>} />
                    <Route path="bookings" element={<div className="p-8">Booking Management Coming Soon</div>} />
                    <Route path="users" element={<div className="p-8">User Management Coming Soon</div>} />
                    <Route path="settings" element={<div className="p-8">System Settings Coming Soon</div>} />
                </Route>
            </Route>

            {/* Fallback 404 Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;
