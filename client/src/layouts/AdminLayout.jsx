import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    Map,
    CalendarCheck,
    Users,
    Settings,
    LogOut,
    ChevronLeft
} from 'lucide-react';

const AdminLayout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const handleLogout = () => {
        logout();
    };

    const navItems = [
        { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
        { name: 'Manage Courts', path: '/admin/courts', icon: <Map size={20} /> },
        { name: 'Manage Bookings', path: '/admin/bookings', icon: <CalendarCheck size={20} /> },
        { name: 'Users', path: '/admin/users', icon: <Users size={20} /> },
        { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
    ];

    return (
        <div className="flex bg-gray-100 min-h-screen">
            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col flex-shrink-0">
                <div className="h-16 flex items-center px-6 border-b border-gray-200">
                    <Link to="/" className="flex items-center gap-2 text-primary-600 font-bold text-xl tracking-tight">
                        <CalendarCheck size={24} />
                        <span>AdminPanel</span>
                    </Link>
                </div>

                <div className="p-4 flex-grow overflow-y-auto">
                    <div className="mb-4 text-xs font-semibold text-gray-400 uppercase tracking-wider px-3">
                        Menu
                    </div>
                    <nav className="space-y-1">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${isActive
                                            ? 'bg-primary-50 text-primary-700'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                >
                                    <span className={isActive ? 'text-primary-600' : 'text-gray-400'}>
                                        {item.icon}
                                    </span>
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center gap-3 px-3 py-3 mb-2 rounded-lg bg-gray-50">
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                            {user?.name?.charAt(0) || 'A'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile Header */}
                <div className="md:hidden h-16 bg-white border-b border-gray-200 flex items-center px-4 justify-between">
                    <div className="flex items-center gap-2 text-primary-600 font-bold text-xl">
                        <CalendarCheck size={24} />
                        <span>AdminPanel</span>
                    </div>
                    <Link to="/" className="text-sm font-medium text-gray-500 flex items-center gap-1">
                        <ChevronLeft size={16} /> Back to Site
                    </Link>
                </div>

                {/* Top Header */}
                <header className="h-16 bg-white border-b border-gray-200 hidden md:flex items-center px-8 justify-between">
                    <h1 className="text-xl font-semibold text-gray-800">
                        {navItems.find(item => item.path === location.pathname)?.name || 'Dashboard'}
                    </h1>
                    <div className="flex items-center gap-4">
                        <Link to="/" className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors">
                            <ChevronLeft size={16} /> Return to Client Site
                        </Link>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gray-50">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
