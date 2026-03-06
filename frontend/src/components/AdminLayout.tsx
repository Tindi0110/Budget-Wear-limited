import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    Box,
    ShoppingCart,
    Users,
    BarChart2,
    Settings,
    Menu,
    Package,
    Megaphone,
    CreditCard
} from 'lucide-react';
import { cn } from '../utils';

const navItems = [
    { name: 'Dashboard', href: '/admin', icon: BarChart2 },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Inventory', href: '/admin/inventory', icon: Box },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Staff', href: '/admin/staff', icon: Users },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Advertisements', href: '/admin/ads', icon: Megaphone },
    { name: 'Payments', href: '/admin/payments', icon: CreditCard },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export function AdminLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            <div
                className={cn(
                    "fixed inset-0 z-20 transition-opacity bg-gray-900 bg-opacity-50 lg:hidden",
                    isSidebarOpen ? "opacity-100 block" : "opacity-0 hidden"
                )}
                onClick={() => setIsSidebarOpen(false)}
            />

            <div
                className={cn(
                    "fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transition duration-300 transform lg:translate-x-0 lg:static lg:inset-0",
                    isSidebarOpen ? "translate-x-0 ease-out" : "-translate-x-full ease-in"
                )}
            >
                <div className="flex items-center justify-center h-16 bg-white border-b border-gray-200">
                    <Link to="/admin" className="text-xl font-bold text-gray-800">Branch Admin</Link>
                </div>
                <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-4rem)]">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={cn(
                                    "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors",
                                    isActive
                                        ? "bg-blue-50 text-blue-700"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                )}
                                onClick={() => setIsSidebarOpen(false)}
                            >
                                <item.icon className={cn("w-5 h-5 mr-3", isActive ? "text-blue-700" : "text-gray-400")} />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>
            </div>

            <div className="flex flex-col flex-1 overflow-hidden">
                <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 lg:justify-end">
                    <button
                        className="text-gray-500 lg:hidden focus:outline-none"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-700">Admin User</span>
                        <div className="w-8 h-8 ml-3 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                            AD
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
