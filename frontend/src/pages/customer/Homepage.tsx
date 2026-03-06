import { ArrowRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../api';

interface Category {
    id: string;
    name: string;
    slug: string;
}

export function Homepage() {
    const { data: categories, isLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await api.get('/products/categories/');
            return response.data.results as Category[];
        },
    });

    const categoryImages: Record<string, string> = {
        'Men Clothes': 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&q=80&w=400',
        'Women Clothes': 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?auto=format&fit=crop&q=80&w=400',
        'Kids Clothes': 'https://images.unsplash.com/photo-1519241047957-be31d7379a5d?auto=format&fit=crop&q=80&w=400',
        'Ex-UK Bales': 'https://images.unsplash.com/photo-1558024920-b41e1887dc32?auto=format&fit=crop&q=80&w=400',
    };

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <div className="relative bg-gray-900">
                <div className="absolute inset-0 overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=2000"
                        alt="Hero Background"
                        className="w-full h-full object-cover opacity-40"
                    />
                </div>
                <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                        Premium Thrift Shopping
                    </h1>
                    <p className="mt-6 text-xl text-gray-300 max-w-3xl">
                        High quality Ex-UK clothes for everyone. Shop from over 10 active branches across Kenya. Find the best deals in thrift fashion.
                    </p>
                    <div className="mt-10">
                        <Link
                            to="/products"
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 bg-white hover:bg-gray-50 transition-colors"
                        >
                            Shop Now
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Categories */}
            <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">Shop by Category</h2>
                <div className="mt-8 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
                    {isLoading ? (
                        [...Array(4)].map((_, i) => (
                            <div key={i} className="bg-gray-100 h-80 rounded-lg animate-pulse" />
                        ))
                    ) : categories?.map((category) => (
                        <div key={category.id} className="group relative">
                            <div className="relative w-full h-80 bg-white rounded-lg overflow-hidden group-hover:opacity-75 transition-opacity sm:h-64">
                                <img
                                    src={categoryImages[category.name] || 'https://images.unsplash.com/photo-1558024920-b41e1887dc32?auto=format&fit=crop&q=80&w=400'}
                                    alt={category.name}
                                    className="w-full h-full object-center object-cover"
                                />
                            </div>
                            <h3 className="mt-4 text-base font-semibold text-gray-900">
                                <Link to={`/products?category=${category.slug}`}>
                                    <span className="absolute inset-0" />
                                    {category.name}
                                </Link>
                            </h3>
                        </div>
                    ))}
                    {!isLoading && categories?.length === 0 && (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            <ShoppingBag className="mx-auto h-8 w-8 mb-4 opacity-20" />
                            No categories found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

