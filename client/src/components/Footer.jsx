import React from 'react';
import { Calendar, Github, Twitter, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-200 pt-12 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white">
                                <Calendar size={20} />
                            </div>
                            <span className="font-bold text-xl text-gray-900 tracking-tight">SmashBook</span>
                        </Link>
                        <p className="text-sm text-gray-500 mb-4">
                            The premier platform for booking badminton courts easily and efficiently.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-gray-500">
                                <span className="sr-only">Facebook</span>
                                <Facebook size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-gray-500">
                                <span className="sr-only">Twitter</span>
                                <Twitter size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-gray-500">
                                <span className="sr-only">GitHub</span>
                                <Github size={20} />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">Company</h3>
                        <ul className="space-y-4">
                            <li><Link to="/" className="text-base text-gray-500 hover:text-gray-900">About</Link></li>
                            <li><Link to="/" className="text-base text-gray-500 hover:text-gray-900">Blog</Link></li>
                            <li><Link to="/" className="text-base text-gray-500 hover:text-gray-900">Careers</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">Legal</h3>
                        <ul className="space-y-4">
                            <li><Link to="/" className="text-base text-gray-500 hover:text-gray-900">Privacy Policy</Link></li>
                            <li><Link to="/" className="text-base text-gray-500 hover:text-gray-900">Terms of Service</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">Support</h3>
                        <ul className="space-y-4">
                            <li><Link to="/" className="text-base text-gray-500 hover:text-gray-900">Help Center</Link></li>
                            <li><Link to="/" className="text-base text-gray-500 hover:text-gray-900">Contact Us</Link></li>
                            <li><Link to="/" className="text-base text-gray-500 hover:text-gray-900">FAQ</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-base text-gray-400">
                        &copy; {new Date().getFullYear()} SmashBook Inc. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
