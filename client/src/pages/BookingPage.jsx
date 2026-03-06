import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { format, addDays } from 'date-fns';
import { Calendar as CalendarIcon, Clock, ArrowLeft, CheckCircle2, ChevronRight } from 'lucide-react';
import api from '../services/api';

const BookingPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [court, setCourt] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Form State
    const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [startTime, setStartTime] = useState('18:00');
    const [duration, setDuration] = useState('1'); // hours
    const [endTime, setEndTime] = useState('19:00');
    const [totalPrice, setTotalPrice] = useState(0);

    // Generates next 14 days for date picker
    const availableDates = Array.from({ length: 14 }).map((_, i) => {
        const d = addDays(new Date(), i);
        return {
            value: format(d, 'yyyy-MM-dd'),
            label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : format(d, 'EEE, MMM d'),
        };
    });

    // Available times 06:00 to 22:00
    const availableTimes = Array.from({ length: 17 }).map((_, i) => {
        const hour = i + 6;
        return `${hour.toString().padStart(2, '0')}:00`;
    });

    useEffect(() => {
        const fetchCourt = async () => {
            try {
                const response = await api.get(`/courts/${id}`);
                setCourt(response.data.data);
            } catch (err) {
                setError('Court not found or server error');
            } finally {
                setLoading(false);
            }
        };
        fetchCourt();
    }, [id]);

    // Update endTime and total price when start time or duration changes
    useEffect(() => {
        if (court && startTime) {
            const [hours] = startTime.split(':').map(Number);
            const endHour = hours + parseInt(duration);
            // Ensure we don't go past midnight
            const formattedEndHour = endHour > 23 ? 23 : endHour;
            setEndTime(`${formattedEndHour.toString().padStart(2, '0')}:00`);
            setTotalPrice(court.price_per_hour * parseInt(duration));
        }
    }, [startTime, duration, court]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            await api.post('/bookings', {
                court_id: id,
                date,
                start_time: startTime,
                end_time: endTime,
            });
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create booking. The slot might be taken.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-12 text-center text-gray-500">Loading booking setup...</div>;
    if (!court && !loading) return <div className="p-12 text-center text-red-500">Court not found</div>;

    if (success) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-16 text-center">
                <div className="bg-white rounded-3xl p-10 sm:p-16 shadow-lg border border-gray-100 mb-8 flex flex-col items-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle2 size={40} className="text-green-500" />
                    </div>
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Booking Confirmed!</h2>
                    <p className="text-lg text-gray-500 mb-8 max-w-md">
                        Your court has been successfully reserved. We've sent a confirmation to your email.
                    </p>

                    <div className="w-full max-w-sm bg-gray-50 border border-gray-100 rounded-2xl p-6 text-left mb-8 shadow-inner">
                        <div className="flex justify-between mb-3 border-b border-gray-200 pb-3">
                            <span className="text-gray-500">Court</span>
                            <span className="font-semibold text-gray-900">{court.name}</span>
                        </div>
                        <div className="flex justify-between mb-3 border-b border-gray-200 pb-3">
                            <span className="text-gray-500">Date</span>
                            <span className="font-semibold text-gray-900">{format(new Date(date), 'MMM do, yyyy')}</span>
                        </div>
                        <div className="flex justify-between mb-3 border-b border-gray-200 pb-3">
                            <span className="text-gray-500">Time</span>
                            <span className="font-semibold text-gray-900">{startTime} - {endTime}</span>
                        </div>
                        <div className="flex justify-between pt-1">
                            <span className="text-gray-500">Total Paid</span>
                            <span className="font-extrabold text-primary-600">${totalPrice.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="flex gap-4 w-full max-w-sm flex-col sm:flex-row">
                        <Link to="/bookings" className="flex-1 bg-primary-600 text-white font-medium py-3 rounded-xl hover:bg-primary-700 transition">
                            View Bookings
                        </Link>
                        <Link to="/courts" className="flex-1 bg-gray-100 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-200 transition">
                            Book Another
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 pb-16">
            <Link to={`/courts/${id}`} className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 transition">
                <ArrowLeft size={16} className="mr-1" /> Back to Court Details
            </Link>

            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                {/* Header Ribbon */}
                <div className="bg-primary-600 px-8 py-6 text-white flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold mb-1">Reserve Your Court</h1>
                        <p className="text-primary-100 text-sm">Fill in the details below to confirm your booking.</p>
                    </div>
                    <div className="mt-4 md:mt-0 font-medium bg-primary-700/50 px-4 py-2 rounded-lg backdrop-blur-sm shadow-sm inline-flex w-max">
                        {court.name} • ${court.price_per_hour}/hr
                    </div>
                </div>

                <div className="grid md:grid-cols-2">
                    {/* Form Area */}
                    <div className="p-8 md:border-r border-gray-100">
                        {error && (
                            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                                <p className="text-sm text-red-700 font-medium">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="date">
                                    Select Date
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <CalendarIcon className="h-5 w-5 text-primary-500" />
                                    </div>
                                    <select
                                        id="date"
                                        className="block w-full pl-10 pr-10 py-3 text-base bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-xl appearance-none cursor-pointer"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                    >
                                        {availableDates.map(d => (
                                            <option key={d.value} value={d.value}>{d.label}</option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <ChevronRight className="h-4 w-4 text-gray-400 rotate-90" />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="startTime">
                                        Start Time
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Clock className="h-5 w-5 text-primary-500" />
                                        </div>
                                        <select
                                            id="startTime"
                                            className="block w-full pl-10 pr-8 py-3 bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-xl appearance-none cursor-pointer"
                                            value={startTime}
                                            onChange={(e) => setStartTime(e.target.value)}
                                        >
                                            {availableTimes.map(i => (
                                                <option key={i} value={i}>{i}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="duration">
                                        Duration
                                    </label>
                                    <select
                                        id="duration"
                                        className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-xl appearance-none cursor-pointer"
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}
                                    >
                                        <option value="1">1 Hour</option>
                                        <option value="2">2 Hours</option>
                                        <option value="3">3 Hours</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-4 mt-8 border-t border-gray-100">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-base font-bold text-white bg-gray-900 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-75 transition-colors"
                                >
                                    {submitting ? 'Processing Payment...' : 'Confirm & Pay'}
                                </button>
                                <p className="text-center text-xs text-gray-500 mt-3 font-medium flex items-center justify-center gap-1">
                                    You won't be charged actual money.
                                </p>
                            </div>
                        </form>
                    </div>

                    {/* Setup / Summary area */}
                    <div className="p-8 bg-gray-50 flex flex-col justify-center border-t md:border-t-0 border-gray-100">
                        <h3 className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-6">Booking Summary</h3>

                        <div className="space-y-4 text-gray-600 mb-8 flex-grow">
                            <div className="flex justify-between items-center group">
                                <span className="group-hover:text-gray-900 transition">User Name</span>
                                <span className="font-semibold text-gray-900">{user?.name}</span>
                            </div>
                            <div className="flex justify-between items-center group">
                                <span className="group-hover:text-gray-900 transition">Court Rate</span>
                                <span className="font-semibold text-gray-900">${court.price_per_hour}/hr</span>
                            </div>
                            <div className="flex justify-between items-center group">
                                <span className="group-hover:text-gray-900 transition">Scheduled Date</span>
                                <span className="font-semibold text-gray-900">{format(new Date(date), 'MMMM do, yyyy')}</span>
                            </div>
                            <div className="flex justify-between items-center group mb-4">
                                <span className="group-hover:text-gray-900 transition">Time Slot</span>
                                <span className="font-semibold text-gray-900">{startTime} - {endTime}</span>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-6">
                            <div className="flex justify-between items-end">
                                <span className="text-gray-900 font-semibold">Total Cost</span>
                                <div className="text-right">
                                    <span className="text-4xl font-extrabold text-primary-600">${totalPrice.toFixed(2)}</span>
                                    <span className="block text-xs text-gray-500 font-medium">USD details</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;
