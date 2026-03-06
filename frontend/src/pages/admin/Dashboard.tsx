import { BarChart2, Package, ShoppingCart, Users } from 'lucide-react';

const stats = [
    { name: 'Total Sales', value: 'Ksh 345,600', icon: BarChart2, change: '+12%', changeType: 'positive' },
    { name: 'Total Orders', value: '1,234', icon: ShoppingCart, change: '+5%', changeType: 'positive' },
    { name: 'Products Listed', value: '45,678', icon: Package, change: '+2%', changeType: 'positive' },
    { name: 'Active Customers', value: '5,678', icon: Users, change: '-1%', changeType: 'negative' },
];

export function Dashboard() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold text-gray-900">Branch Overview</h1>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <div key={stat.name} className="relative overflow-hidden bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                        <dt>
                            <div className="absolute p-3 bg-blue-50 rounded-md">
                                <stat.icon className="w-6 h-6 text-blue-600" aria-hidden="true" />
                            </div>
                            <p className="ml-16 text-sm font-medium text-gray-500 truncate">{stat.name}</p>
                        </dt>
                        <dd className="flex items-baseline pb-1 ml-16 sm:pb-2">
                            <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                            <p
                                className={`ml-2 flex items-baseline text-sm font-semibold ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                                    }`}
                            >
                                {stat.change}
                            </p>
                        </dd>
                    </div>
                ))}
            </div>

            {/* Temporary Chart Placeholders */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                <div className="bg-white p-6 shadow-sm border border-gray-200 rounded-lg h-96 flex flex-col items-center justify-center text-gray-400">
                    <BarChart2 className="w-12 h-12 mb-4" />
                    <p>Sales Trend Chart Widget</p>
                </div>
                <div className="bg-white p-6 shadow-sm border border-gray-200 rounded-lg h-96 flex flex-col items-center justify-center text-gray-400">
                    <Package className="w-12 h-12 mb-4" />
                    <p>Top Selling Categories Widget</p>
                </div>
            </div>
        </div>
    );
}
