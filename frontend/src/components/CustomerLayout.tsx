import { Outlet, Link } from 'react-router-dom';
import { ShoppingBag, Search, Menu, User } from 'lucide-react';
import { SearchSelect } from './SearchSelect';

export function CustomerLayout() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <button className="p-2 -ml-2 mr-2 text-gray-400 lg:hidden">
                                <Menu className="w-6 h-6" />
                            </button>
                            <Link to="/" className="flex items-center">
                                <ShoppingBag className="w-8 h-8 text-blue-600" />
                                <span className="ml-2 text-xl font-bold tracking-tight text-gray-900 hidden sm:block">Budget Wear</span>
                            </Link>
                        </div>

                        <div className="flex-1 max-w-lg mx-8 hidden lg:block">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-6">
                            <div className="hidden sm:flex items-center">
                                <SearchSelect
                                    placeholder="Select Branch..."
                                    options={[
                                        { value: 'nairobi', label: 'Nairobi CBD' },
                                        { value: 'westlands', label: 'Westlands' }
                                    ]}
                                    onChange={() => { }}
                                />
                            </div>
                            <Link to="/login" className="text-gray-500 hover:text-gray-900 flex items-center gap-1">
                                <User className="w-6 h-6" />
                                <span className="text-sm font-medium hidden md:block">Sign In</span>
                            </Link>
                            <a href="#" className="flex items-center text-gray-500 hover:text-gray-900 group relative">
                                <ShoppingBag className="w-6 h-6 flex-shrink-0" />
                                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                                    0
                                </span>
                            </a>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                <Outlet />
            </main>

            <footer className="bg-white border-t border-gray-200 mt-auto">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-sm text-gray-500">
                        &copy; {new Date().getFullYear()} Budget Wear Limited. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
