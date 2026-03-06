import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Smartphone, CreditCard, ChevronRight, Loader2, CheckCircle2 } from 'lucide-react';
import api from '../../api';

export function Checkout() {
    const [step, setStep] = useState(1);
    const [phone, setPhone] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const { data: cart } = useQuery({
        queryKey: ['cart'],
        queryFn: async () => {
            const response = await api.get('/orders/carts/');
            return response.data[0];
        },
    });

    const placeOrderMutation = useMutation({
        mutationFn: async () => {
            // 1. Create order from cart
            const orderResponse = await api.post('/orders/orders/', {
                branch_id: cart.branch, // Using branch from cart
                items: cart.items.map((i: any) => ({ product: i.product, quantity: i.quantity }))
            });

            const orderId = orderResponse.data.id;

            // 2. Initiate Mpesa STK Push
            await api.post('/payments/payments/stk-push/', {
                order_id: orderId,
                phone_number: phone
            });

            return orderId;
        },
        onSuccess: () => {
            setIsSuccess(true);
            setIsProcessing(false);
        },
        onError: () => {
            setIsProcessing(false);
            alert('Payment initialization failed. Please try again.');
        }
    });

    const handlePay = () => {
        setIsProcessing(true);
        placeOrderMutation.mutate();
    };

    if (isSuccess) {
        return (
            <div className="max-w-md mx-auto py-24 px-4 text-center">
                <div className="flex justify-center mb-6">
                    <CheckCircle2 className="w-20 h-20 text-green-500 animate-bounce" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Order Placed!</h1>
                <p className="mt-4 text-gray-600 text-lg">
                    Please check your phone for the M-Pesa PIN prompt to finalize the payment.
                </p>
                <button
                    onClick={() => window.location.href = '/'}
                    className="mt-10 w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors"
                >
                    Return to Home
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-8">
                <span className={step === 1 ? "text-blue-600" : "text-gray-900"}>Shipping</span>
                <ChevronRight className="w-4 h-4" />
                <span className={step === 2 ? "text-blue-600" : "text-gray-400"}>Payment</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                <div className="md:col-span-12">
                    {step === 1 ? (
                        <div className="bg-white p-8 rounded-2xl border border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-900 mb-8">Shipping Information</h2>
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                        <input type="text" className="w-full px-4 py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                        <input type="text" className="w-full px-4 py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number (M-Pesa)</label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="0712 345 678"
                                        className="w-full px-4 py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    />
                                </div>
                                <button
                                    onClick={() => setStep(2)}
                                    className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
                                >
                                    Next Step
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white p-8 rounded-2xl border border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-900 mb-8">Payment Method</h2>
                            <div className="space-y-4">
                                <div className="p-4 border-2 border-blue-600 bg-blue-50 rounded-xl flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Smartphone className="w-8 h-8 text-blue-600" />
                                        <div>
                                            <div className="font-bold text-gray-900">M-Pesa STK Push</div>
                                            <div className="text-xs text-blue-600 font-medium">Pay instantly via phone</div>
                                        </div>
                                    </div>
                                    <div className="w-6 h-6 rounded-full border-4 border-blue-600 bg-white" />
                                </div>

                                <div className="p-4 border border-gray-100 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-between opacity-50 cursor-not-allowed">
                                    <div className="flex items-center gap-4">
                                        <CreditCard className="w-8 h-8 text-gray-400" />
                                        <div>
                                            <div className="font-bold">Credit Card</div>
                                            <div className="text-xs">Coming soon</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-gray-100">
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="text-gray-600">Total to pay</span>
                                        <span className="text-2xl font-black text-gray-900">Ksh {cart?.total_price?.toLocaleString()}</span>
                                    </div>
                                    <button
                                        disabled={isProcessing}
                                        onClick={handlePay}
                                        className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all flex items-center justify-center gap-2"
                                    >
                                        {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : "Complete Payment"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
