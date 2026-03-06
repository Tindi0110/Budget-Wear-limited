import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api';

interface CartItem {
    id: string;
    product_name: string;
    product_price: string;
    quantity: number;
    product_image: string;
}

interface Cart {
    id: string;
    items: CartItem[];
    total_price: number;
}

export function Cart() {
    const queryClient = useQueryClient();

    const { data: cart, isLoading } = useQuery({
        queryKey: ['cart'],
        queryFn: async () => {
            const response = await api.get('/orders/carts/');
            // For simplicity, take the first cart or handle multiple
            return response.data[0] as Cart;
        },
    });

    const updateQuantityMutation = useMutation({
        mutationFn: async ({ itemId, quantity }: { itemId: string, quantity: number }) => {
            // Backend would need an endpoint to update quantity
            return api.patch(`/orders/cart-items/${itemId}/`, { quantity });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
    });

    const removeItemMutation = useMutation({
        mutationFn: async (itemId: string) => {
            return api.delete(`/orders/cart-items/${itemId}/`);
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
    });

    if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;

    const isEmpty = !cart || cart.items.length === 0;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Shopping Cart</h1>

            {isEmpty ? (
                <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-200">
                    <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                    <h2 className="mt-4 text-lg font-medium text-gray-900">Your cart is empty</h2>
                    <p className="mt-2 text-gray-500">Looks like you haven't added anything yet.</p>
                    <Link
                        to="/products"
                        className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                    >
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8 space-y-4">
                        {cart.items.map((item) => (
                            <div key={item.id} className="bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-4">
                                <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                    {item.product_image ? (
                                        <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                                    ) : (
                                        <ShoppingBag className="w-8 h-8 m-8 text-gray-300" />
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-semibold text-gray-900 truncate">{item.product_name}</h3>
                                    <p className="text-blue-600 font-bold mt-1">Ksh {parseFloat(item.product_price).toLocaleString()}</p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                                        <button
                                            onClick={() => updateQuantityMutation.mutate({ itemId: item.id, quantity: Math.max(1, item.quantity - 1) })}
                                            className="p-2 hover:bg-gray-100 transition-colors"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantityMutation.mutate({ itemId: item.id, quantity: item.quantity + 1 })}
                                            className="p-2 hover:bg-gray-100 transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => removeItemMutation.mutate(item.id)}
                                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="lg:col-span-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 sticky top-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>Ksh {cart.total_price.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Delivery Fee</span>
                                    <span className="text-green-600 font-medium">Free</span>
                                </div>
                                <div className="border-t border-gray-100 pt-4 flex justify-between text-xl font-bold text-gray-900">
                                    <span>Total</span>
                                    <span>Ksh {cart.total_price.toLocaleString()}</span>
                                </div>
                            </div>
                            <Link
                                to="/checkout"
                                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
                            >
                                Go to Checkout
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
