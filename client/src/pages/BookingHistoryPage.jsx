import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { CalendarCheck, MapPin, Clock, DollarSign, XCircle, CheckCircle } from 'lucide-react';
import api from '../services/api';

const BookingHistoryPage = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cancelLoading, setCancelLoading] = useState(null);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await api.get('/bookings/user');
            setBookings(response.data.data);
            setError('');
        } catch (err) {
            setError('Failed to load your bookings. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
            return;
        }

        try {
            setCancelLoading(bookingId);
            await api.put(`/bookings/${bookingId}`, { status: 'cancelled' });

            // Update local state
            setBookings(bookings.map(booking =>
                booking._id === bookingId
                    ? { ...booking, status: 'cancelled' }
                    : booking
            ));
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to cancel booking');
        } finally {
            setCancelLoading(null);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'booked':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><CalendarCheck size={12} className="mr-1" /> Upcoming</span>;
            case 'completed':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle size={12} className="mr-1" /> Completed</span>;
            case 'cancelled':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle size={12} className="mr-1" /> Cancelled</span>;
            default:
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Bookings</h1>
                <p className="mt-2 text-gray-500">Manage your past and upcoming court reservations.</p>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl shadow-sm mb-6">
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            {loading ? (
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-pulse h-40">
                            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                        </div>
                    ))}
                </div>
            ) : bookings.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100 border-dashed">
                    <CalendarCheck className="mx-auto h-16 w-16 text-gray-300" />
                    <h3 className="mt-4 text-xl font-medium text-gray-900">No bookings found</h3>
                    <p className="mt-2 text-gray-500 max-w-sm mx-auto">You haven't made any court reservations yet. Ready to play?</p>
                    <div className="mt-6">
                        <Link
                            to="/courts"
                            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-primary-600 hover:bg-primary-700 shadow-sm"
                        >
                            Browse Courts
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {bookings.map((booking) => (
                        <div
                            key={booking._id}
                            className={`bg-white rounded-2xl overflow-hidden shadow-sm border ${booking.status === 'cancelled' ? 'border-red-100 opacity-75' : 'border-gray-100 hover:shadow-md transition-shadow'
                                }`}
                        >
                            <div className="flex flex-col md:flex-row">
                                <div className="p-6 flex-grow">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 flex items-center">
                                                {booking.court_id?.name || 'Unknown Court'}
                                                <span className="ml-3 hidden sm:inline-block">{getStatusBadge(booking.status)}</span>
                                            </h3>
                                            <div className="sm:hidden mt-2">{getStatusBadge(booking.status)}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-extrabold text-primary-600">${booking.total_price.toFixed(2)}</div>
                                            <div className="text-xs text-gray-500">Total Paid</div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                                        <div className="flex items-center text-gray-600">
                                            <CalendarCheck className="w-5 h-5 mr-3 text-gray-400" />
                                            <div>
                                                <div className="text-xs text-gray-500 font-medium">Date</div>
                                                <div className="font-medium text-gray-900">{format(new Date(booking.date), 'MMM do, yyyy')}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <Clock className="w-5 h-5 mr-3 text-gray-400" />
                                            <div>
                                                <div className="text-xs text-gray-500 font-medium">Time Slot</div>
                                                <div className="font-medium text-gray-900">{booking.start_time} - {booking.end_time}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <MapPin className="w-5 h-5 mr-3 text-gray-400" />
                                            <div>
                                                <div className="text-xs text-gray-500 font-medium">Location</div>
                                                <div className="font-medium text-gray-900">Main Facility</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-6 md:w-56 flex flex-col justify-center border-t md:border-t-0 md:border-l border-gray-100">
                                    <div className="text-sm text-gray-500 mb-4 text-center">
                                        Booked on {format(new Date(booking.createdAt), 'MMM d, yyyy')}
                                    </div>

                                    {booking.status === 'booked' && (
                                        <button
                                            onClick={() => handleCancelBooking(booking._id)}
                                            disabled={cancelLoading === booking._id}
                                            className="w-full flex justify-center items-center px-4 py-2.5 border border-red-200 text-sm font-medium rounded-lg text-red-600 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50"
                                        >
                                            {cancelLoading === booking._id ? 'Cancelling...' : 'Cancel Booking'}
                                        </button>
                                    )}

                                    {booking.court_id && (
                                        <Link
                                            to={`/courts/${booking.court_id._id}`}
                                            className={`w-full flex justify-center items-center px-4 py-2.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors ${booking.status === 'booked' ? 'mt-3' : ''}`}
                                        >
                                            View Court details
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BookingHistoryPage;
