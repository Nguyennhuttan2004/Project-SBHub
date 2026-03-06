import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, MapPin } from 'lucide-react';
import api from '../services/api';

const CourtListPage = () => {
    const [courts, setCourts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCourts();
    }, []);

    const fetchCourts = async () => {
        try {
            setLoading(true);
            const response = await api.get('/courts');
            setCourts(response.data.data);
            setError('');
        } catch (err) {
            setError('Failed to load courts. Please try again later.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredCourts = courts.filter(court =>
        court.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        court.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12">
            {/* Header section with search */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Available Courts</h1>
                        <p className="mt-2 text-gray-500">Find and book the perfect court for your next match.</p>
                    </div>

                    <div className="w-full md:max-w-md flex relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by name or description..."
                            className="block w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-colors"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button className="ml-2 inline-flex items-center justify-center p-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 transition-colors">
                            <Filter className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl shadow-sm">
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse h-[340px]">
                            <div className="h-44 bg-gray-200"></div>
                            <div className="p-5 space-y-4">
                                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                <div className="mt-4 flex justify-between">
                                    <div className="h-8 bg-gray-200 rounded-lg w-full"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : filteredCourts.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <MapPin className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No courts found</h3>
                    <p className="mt-2 text-gray-500">We couldn't find any courts matching your search.</p>
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
                        >
                            Clear search
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredCourts.map((court) => (
                        <div key={court._id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all group flex flex-col h-full">
                            <div className="relative h-44 overflow-hidden bg-gray-100">
                                <img
                                    src={`https://images.unsplash.com/photo-1595435742656-5272d0b3fee8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80`}
                                    alt={court.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-gray-900 shadow-sm">
                                    ${court.price_per_hour}/hr
                                </div>
                                {court.status === 'maintenance' && (
                                    <div className="absolute inset-0 bg-gray-900/60 flex items-center justify-center backdrop-blur-sm">
                                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm">
                                            Under Maintenance
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="p-5 flex flex-col flex-grow">
                                <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">{court.name}</h3>
                                <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-grow">
                                    {court.description || 'Premium indoor court designed for professional and casual play.'}
                                </p>
                                <Link
                                    to={`/courts/${court._id}`}
                                    className={`block w-full text-center py-2.5 rounded-xl text-sm font-bold transition-all ${court.status === 'available'
                                            ? 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none'
                                        }`}
                                >
                                    {court.status === 'available' ? 'View Details & Book' : 'Currently Unavailable'}
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CourtListPage;
