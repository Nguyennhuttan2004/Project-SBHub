import React, { useState, useEffect } from 'react';
import { Users, Map, CalendarCheck, TrendingUp, DollarSign } from 'lucide-react';
import api from '../services/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        courts: 0,
        bookings: 0,
        revenue: 0,
    });
    const [recentBookings, setRecentBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // In a real app, these would ideally be a single dashboard endpoint
                const [courtsRes, bookingsRes] = await Promise.all([
                    api.get('/courts'),
                    api.get('/bookings/admin')
                ]);

                const courtsData = courtsRes.data.data;
                const bookingsData = bookingsRes.data.data;

                // Calculate total revenue from non-cancelled bookings
                const revenue = bookingsData
                    .filter(b => b.status !== 'cancelled')
                    .reduce((sum, b) => sum + b.total_price, 0);

                setStats({
                    courts: courtsData.length,
                    bookings: bookingsData.length,
                    revenue: revenue,
                });

                // Get 5 most recent
                setRecentBookings(bookingsData.slice(0, 5));
            } catch (error) {
                console.error('Failed to fetch admin data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return <div className="p-8 text-center text-gray-500 animate-pulse">Loading dashboard...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {/* Total Revenue */}
                <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-gray-100">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-green-100 rounded-xl p-3">
                                <DollarSign className="h-6 w-6 text-green-600" aria-hidden="true" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                                    <dd className="flex items-baseline">
                                        <div className="text-2xl font-bold text-gray-900">${stats.revenue.toFixed(2)}</div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Total Bookings */}
                <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-gray-100">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-blue-100 rounded-xl p-3">
                                <CalendarCheck className="h-6 w-6 text-blue-600" aria-hidden="true" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Total Bookings</dt>
                                    <dd className="flex items-baseline">
                                        <div className="text-2xl font-bold text-gray-900">{stats.bookings}</div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Total Courts */}
                <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-gray-100">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-purple-100 rounded-xl p-3">
                                <Map className="h-6 w-6 text-purple-600" aria-hidden="true" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Managed Courts</dt>
                                    <dd className="flex items-baseline">
                                        <div className="text-2xl font-bold text-gray-900">{stats.courts}</div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Active Users (Placeholder) */}
                <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-gray-100">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-orange-100 rounded-xl p-3">
                                <Users className="h-6 w-6 text-orange-600" aria-hidden="true" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">System Health</dt>
                                    <dd className="flex items-baseline">
                                        <div className="text-2xl font-bold text-green-500 flex items-center gap-1">
                                            <TrendingUp size={20} /> Excellent
                                        </div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Bookings Table */}
            <h2 className="text-lg leading-6 font-medium text-gray-900 mt-8 mb-4">Recent Bookings</h2>
            <div className="bg-white shadow-sm rounded-2xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    User
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Court
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Date & Time
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {recentBookings.length > 0 ? (
                                recentBookings.map((booking) => (
                                    <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                                                    {booking.user_id?.name?.charAt(0) || 'U'}
                                                </div>
                                                <div className="ml-3">
                                                    <div className="text-sm font-medium text-gray-900">{booking.user_id?.name || 'Unknown'}</div>
                                                    <div className="text-sm text-gray-500">{booking.user_id?.email || 'N/A'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 font-medium">{booking.court_id?.name || 'Unknown'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{new Date(booking.date).toLocaleDateString()}</div>
                                            <div className="text-sm text-gray-500">{booking.start_time} - {booking.end_time}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                            ${booking.total_price.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${booking.status === 'booked' ? 'bg-blue-100 text-blue-800' :
                                                    booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                        'bg-red-100 text-red-800'
                                                }`}>
                                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-sm text-gray-500">
                                        No recent bookings found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
