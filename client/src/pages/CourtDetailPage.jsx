import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MapPin, Info, ArrowLeft, Clock, DollarSign, CalendarCheck } from 'lucide-react';
import api from '../services/api';

const CourtDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [court, setCourt] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCourtDetails = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/courts/${id}`);
                setCourt(response.data.data);
            } catch (err) {
                setError('Failed to load court details. Court might not exist.');
            } finally {
                setLoading(false);
            }
        };

        fetchCourtDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-8 animate-pulse">
                <div className="h-8 bg-gray-200 w-32 rounded mb-6"></div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="h-64 sm:h-96 bg-gray-200 w-full"></div>
                    <div className="p-8">
                        <div className="h-10 bg-gray-200 w-1/3 rounded mb-4"></div>
                        <div className="h-6 bg-gray-200 w-1/4 rounded mb-8"></div>
                        <div className="h-24 bg-gray-200 w-full rounded mb-8"></div>
                        <div className="h-12 bg-gray-200 w-full md:w-48 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !court) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-12 text-center">
                <div className="bg-red-50 p-8 rounded-2xl">
                    <h2 className="text-2xl font-bold text-red-700 mb-4">Error loading content</h2>
                    <p className="text-red-600 mb-6">{error}</p>
                    <Link to="/courts" className="text-white bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg font-medium">
                        Back to Courts
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-16">
            <Link to="/courts" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 transition-colors">
                <ArrowLeft size={16} className="mr-1" /> Back to courts
            </Link>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Hero Image */}
                <div className="relative h-64 sm:h-80 md:h-[28rem] w-full bg-gray-100">
                    <img
                        src="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                        alt={court.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-white">
                        <div className="flex items-center gap-2 mb-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${court.status === 'available' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                                }`}>
                                {court.status}
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-2">{court.name}</h1>
                    </div>
                </div>

                {/* Content Section */}
                <div className="grid md:grid-cols-3 gap-0">
                    {/* Main info */}
                    <div className="p-6 md:p-10 md:col-span-2 border-b md:border-b-0 md:border-r border-gray-100">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Info size={20} className="text-primary-500" /> About this court
                        </h2>
                        <div className="prose prose-primary text-gray-600">
                            <p className="text-lg leading-relaxed">
                                {court.description || 'This premium badminton court offers a pristine playing surface and professional-grade illumination. Perfect for casual games among friends or serious competitive matches. The area is well-ventilated and regularly maintained to ensure the highest quality experience for all players.'}
                            </p>
                        </div>

                        <div className="mt-10 grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-start gap-3">
                                <MapPin className="text-gray-400 mt-1" size={20} />
                                <div>
                                    <h4 className="font-semibold text-gray-900">Location</h4>
                                    <p className="text-sm text-gray-500">Main Sports Complex, Floor 2</p>
                                </div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-start gap-3">
                                <Clock className="text-gray-400 mt-1" size={20} />
                                <div>
                                    <h4 className="font-semibold text-gray-900">Hours</h4>
                                    <p className="text-sm text-gray-500">06:00 AM - 10:00 PM</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Booking sidebar */}
                    <div className="p-6 md:p-10 bg-gray-50 flex flex-col justify-center">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
                            <div className="flex items-end mb-2">
                                <span className="text-4xl font-extrabold text-gray-900">${court.price_per_hour}</span>
                                <span className="text-gray-500 ml-1 mb-1 font-medium">/ hour</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-6 pb-6 border-b border-gray-100">
                                <DollarSign size={16} /> Total depends on duration
                            </div>

                            <Link
                                to={`/book/${court._id}`}
                                className={`w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-base font-bold text-white transition-transform transform active:scale-95 ${court.status === 'available'
                                        ? 'bg-primary-600 hover:bg-primary-700'
                                        : 'bg-gray-400 cursor-not-allowed hidden'
                                    }`}
                            >
                                <CalendarCheck size={20} className="mr-2" />
                                Book Now
                            </Link>

                            {court.status !== 'available' && (
                                <div className="w-full text-center p-3 bg-red-50 text-red-600 rounded-xl font-medium border border-red-100">
                                    Currently Under Maintenance
                                </div>
                            )}
                        </div>

                        {!isAuthenticated && court.status === 'available' && (
                            <p className="text-sm text-center text-gray-500 mt-4">
                                You'll be asked to <Link to="/login" className="text-primary-600 font-medium">log in</Link> first.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourtDetailPage;
