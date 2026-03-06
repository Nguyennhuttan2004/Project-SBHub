import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Calendar, Users, MapPin, Search } from 'lucide-react';
import api from '../services/api';

const HomePage = () => {
    const [featuredCourts, setFeaturedCourts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourts = async () => {
            try {
                const response = await api.get('/courts');
                // Get just the first 3 for the homepage
                setFeaturedCourts(response.data.data.slice(0, 3));
            } catch (error) {
                console.error('Failed to fetch courts', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourts();
    }, []);

    return (
        <div className="space-y-20 pb-12">
            {/* Hero Section */}
            <section className="relative bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-white/50 z-0" />
                <div className="relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 flex flex-col md:flex-row items-center gap-12">
                    <div className="text-center md:text-left md:w-1/2">
                        <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                            <span className="block mb-2">Book Your Perfect</span>
                            <span className="block text-primary-600">Badminton Court</span>
                        </h1>
                        <p className="mt-6 text-lg text-gray-500 max-w-lg mx-auto md:mx-0">
                            Find and instantly reserve premium badminton courts nearby. Practice with friends, join tournaments, and elevate your game.
                        </p>
                        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                            <Link
                                to="/courts"
                                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-primary-600 hover:bg-primary-700 md:text-lg transition-transform hover:-translate-y-1 shadow-md"
                            >
                                Find a Court <Search className="ml-2 w-5 h-5" />
                            </Link>
                            <Link
                                to="/register"
                                className="inline-flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 md:text-lg transition-colors shadow-sm"
                            >
                                Sign Up Free
                            </Link>
                        </div>
                    </div>

                    <div className="md:w-1/2 w-full mt-10 md:mt-0 relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary-400 to-secondary-500 rounded-2xl blur opacity-30 animate-pulse"></div>
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white aspect-video flex items-center justify-center border border-gray-100">
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent z-10 flex flex-col justify-end p-6">
                                <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-lg p-4 w-max">
                                    <p className="text-white font-semibold">Premium Indoor Courts</p>
                                    <p className="text-white/80 text-sm flex items-center gap-1 mt-1"><MapPin size={14} /> Downtown Arena</p>
                                </div>
                            </div>
                            <img
                                src="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                                alt="Badminton players on court"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold text-gray-900">Why choose SmashBook?</h2>
                    <p className="mt-4 text-xl text-gray-500">Everything you need for a seamless playing experience.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            title: 'Instant Booking',
                            description: 'Check real-time availability and confirm your booking instantly. No phone calls required.',
                            icon: <Calendar className="w-8 h-8 text-primary-500" />,
                            color: 'bg-primary-50'
                        },
                        {
                            title: 'Premium Facilities',
                            description: 'Access the best courts in your area, complete with professional flooring and lighting.',
                            icon: <MapPin className="w-8 h-8 text-secondary-500" />,
                            color: 'bg-amber-50'
                        },
                        {
                            title: 'Community Access',
                            description: 'Connect with other players, find partners, and join local tournaments easily.',
                            icon: <Users className="w-8 h-8 text-green-500" />,
                            color: 'bg-green-50'
                        }
                    ].map((feature, i) => (
                        <div key={i} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mb-6`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                            <p className="text-gray-500 leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Featured Courts */}
            <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900">Featured Courts</h2>
                        <p className="mt-2 text-gray-500">Book our most popular venues today.</p>
                    </div>
                    <Link to="/courts" className="hidden sm:flex items-center text-primary-600 font-medium hover:text-primary-700">
                        View all courts <ChevronRight size={20} />
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse h-80">
                                <div className="h-48 bg-gray-200"></div>
                                <div className="p-5 space-y-4">
                                    <div className="h-6 bg-gray-200 rounded w-2/3"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                    <div className="mt-4 flex justify-between">
                                        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                                        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredCourts.map(court => (
                            <div key={court._id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all group duration-300">
                                <div className="relative h-48 overflow-hidden bg-gray-200">
                                    <img
                                        src={`https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80`}
                                        alt={court.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-gray-900 shadow-sm">
                                        ${court.price_per_hour}/hr
                                    </div>
                                    {court.status === 'maintenance' && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                                            <span className="bg-red-500 text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wide">
                                                Under Maintenance
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">{court.name}</h3>
                                    <p className="text-gray-500 text-sm line-clamp-2 mb-6 h-10">
                                        {court.description || 'Premium indoor badminton court available for booking.'}
                                    </p>
                                    <Link
                                        to={`/courts/${court._id}`}
                                        className={`block w-full text-center py-2.5 rounded-xl font-medium transition-colors ${court.status === 'available'
                                                ? 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none'
                                            }`}
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))}
                        {featuredCourts.length === 0 && !loading && (
                            <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                No courts available yet. Admins need to add courts.
                            </div>
                        )}
                    </div>
                )}

                <div className="mt-8 text-center sm:hidden">
                    <Link to="/courts" className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700">
                        View all courts <ChevronRight size={20} />
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
