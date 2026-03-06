import { useQuery } from '@tanstack/react-query';
import { ShoppingCart, Filter, Search } from 'lucide-react';
import api from '../../api';

interface Product {
    id: string;
    name: string;
    description: string;
    price: string;
    category_name: string;
    branch_name: string;
    images: { image: string }[];
}

export function ProductListing() {
    const { data: products, isLoading } = useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const response = await api.get('/products/products/');
            return response.data.results as Product[];
        },
    });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">All Products</h1>
                    <p className="text-gray-500 text-sm mt-1">Found {products?.length || 0} products</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                        <Filter className="w-4 h-4" />
                        Filters
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {isLoading ? (
                    [...Array(8)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
                            <div className="aspect-square bg-gray-200" />
                            <div className="p-4 space-y-3">
                                <div className="h-4 bg-gray-200 rounded w-3/4" />
                                <div className="h-4 bg-gray-200 rounded w-1/2" />
                                <div className="h-6 bg-gray-200 rounded w-1/4" />
                            </div>
                        </div>
                    ))
                ) : products?.map((product) => (
                    <div key={product.id} className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="aspect-square relative overflow-hidden bg-gray-100">
                            {product.images?.[0] ? (
                                <img
                                    src={product.images[0].image}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <ShoppingCart className="w-12 h-12 text-gray-300" />
                                </div>
                            )}
                            <div className="absolute top-2 right-2">
                                <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider text-gray-700 rounded shadow-sm">
                                    {product.branch_name}
                                </span>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="text-xs font-medium text-blue-600 mb-1">{product.category_name}</div>
                            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                                {product.name}
                            </h3>
                            <p className="text-gray-500 text-xs mt-1 line-clamp-2">{product.description}</p>
                            <div className="mt-4 flex items-center justify-between">
                                <span className="text-lg font-bold text-gray-900">Ksh {parseFloat(product.price).toLocaleString()}</span>
                                <button className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors">
                                    <ShoppingCart className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
