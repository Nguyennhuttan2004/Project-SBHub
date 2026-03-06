import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Menu, X, Calendar } from 'lucide-react';

const Navbar = () => {
    const { user, logout, isAuthenticated, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo and primary nav */}
                    <div className="flex">
                        <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white">
                                <Calendar size={20} />
                            </div>
                            <span className="font-bold text-xl text-gray-900 tracking-tight">SmashBook</span>
                        </Link>

                        <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                            <Link to="/" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-primary-500 text-sm font-medium">
                                Home
                            </Link>
                            <Link to="/courts" className="text-gray-500 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-primary-500 hover:text-gray-900 text-sm font-medium">
                                Courts
                            </Link>
                        </div>
                    </div>

                    {/* Secondary nav (auth) */}
                    <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
                        {isAuthenticated ? (
                            <div className="flex items-center gap-4">
                                {isAdmin && (
                                    <Link to="/admin" className="text-sm font-medium text-primary-600 hover:text-primary-800">
                                        Admin Dashboard
                                    </Link>
                                )}
                                <Link to="/bookings" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                                    My Bookings
                                </Link>
                                <div className="h-4 w-px bg-gray-300"></div>
                                <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                                    <User size={16} />
                                    <span>{user?.name}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="ml-2 inline-flex items-center gap-1 px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                                >
                                    <LogOut size={16} />
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-3">
                                <Link
                                    to="/login"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-50 hover:bg-primary-100 transition-colors"
                                >
                                    Log in
                                </Link>
                                <Link
                                    to="/register"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 transition-colors"
                                >
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center sm:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMobileMenuOpen && (
                <div className="sm:hidden border-t border-gray-200 bg-white">
                    <div className="pt-2 pb-3 space-y-1">
                        <Link to="/" className="bg-primary-50 border-primary-500 text-primary-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">Home</Link>
                        <Link to="/courts" className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">Courts</Link>
                    </div>
                    <div className="pt-4 pb-3 border-t border-gray-200">
                        {isAuthenticated ? (
                            <>
                                <div className="flex items-center px-4">
                                    <div className="flex-shrink-0 bg-primary-100 p-2 rounded-full">
                                        <User size={20} className="text-primary-700" />
                                    </div>
                                    <div className="ml-3">
                                        <div className="text-base font-medium text-gray-800">{user?.name}</div>
                                        <div className="text-sm font-medium text-gray-500">{user?.email}</div>
                                    </div>
                                </div>
                                <div className="mt-3 space-y-1">
                                    {isAdmin && (
                                        <Link to="/admin" className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                                            Admin Dashboard
                                        </Link>
                                    )}
                                    <Link to="/bookings" className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                                        My Bookings
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="mt-3 space-y-1 flex flex-col px-4 gap-2">
                                <Link to="/login" className="block text-center px-4 py-2 border border-gray-300 rounded-md text-base font-medium text-gray-700 bg-white">
                                    Log in
                                </Link>
                                <Link to="/register" className="block text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600">
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
