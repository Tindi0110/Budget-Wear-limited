"use client";

import Link from "next/link";
import { useState } from "react";
import {
  MapPin,
  ChevronRight,
  Lock,
  Smartphone,
  ArrowRight,
  CheckCircle2,
  Package,
  ShoppingBag,
} from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/lib/CartContext";
import { api } from "@/lib/api";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    mpesaPhone: "",
    address: "",
  });

  const delivery = subtotal > 3000 ? 0 : 200;
  const total = subtotal + delivery;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    if (!form.name || !form.mpesaPhone) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      const orderPayload = {
        customer_name: form.name,
        customer_phone: form.mpesaPhone,
        address: form.address,
        total: total,
        status: "PENDING",
        items: items.map((i) => ({
          product: i.id,
          quantity: i.quantity,
          price: i.price,
        })),
      };

      await api.post("/orders/", orderPayload);
      clearCart();
      setStep(3);
    } catch (err) {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Empty cart ---
  if (items.length === 0 && step !== 3) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-12 h-12 text-indigo-300" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 text-center max-w-xs">Add items to your cart before checking out.</p>
        <Link href="/products" className="px-8 py-3 bg-black text-white rounded-xl font-black hover:bg-indigo-600 transition-all uppercase tracking-widest text-sm">
          Shop Now
        </Link>
      </div>
    );
  }

  // --- Confirmation ---
  if (step === 3) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 animate-in fade-in zoom-in-95 duration-700">
        <div className="w-28 h-28 bg-green-50 rounded-full flex items-center justify-center mb-8 border-4 border-green-100">
          <CheckCircle2 className="w-14 h-14 text-green-500" />
        </div>
        <h2 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Order Placed!</h2>
        <p className="text-gray-500 font-medium text-center max-w-md mb-2">
          Your order has been received. An STK push will be sent to your M-Pesa number shortly.
        </p>
        <p className="text-sm text-indigo-600 font-black mb-12">Check your phone: +254{form.mpesaPhone}</p>

        <div className="flex gap-4">
          <Link href="/products" className="px-8 py-3 bg-black text-white rounded-xl font-black hover:bg-indigo-600 transition-all text-sm uppercase tracking-widest">
            Continue Shopping
          </Link>
          <Link href="/" className="px-8 py-3 border border-gray-200 text-gray-700 rounded-xl font-black hover:border-indigo-600 hover:text-indigo-600 transition-all text-sm uppercase tracking-widest">
            Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Step indicator */}
      <div className="flex items-center gap-2 text-sm font-bold text-gray-400 mb-10">
        {[{ n: 1, label: "Shipping" }, { n: 2, label: "Payment" }, { n: 3, label: "Done" }].map(({ n, label }, i, arr) => (
          <div key={n} className="flex items-center gap-2">
            <button
              onClick={() => n < step && setStep(n as 1 | 2)}
              className={`flex items-center gap-1.5 font-black uppercase text-xs tracking-widest transition-colors ${step >= n ? "text-indigo-600" : "text-gray-300"}`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border-2 ${step >= n ? "border-indigo-600 bg-indigo-600 text-white" : "border-gray-200 text-gray-400"}`}>
                {n}
              </span>
              {label}
            </button>
            {i < arr.length - 1 && <ChevronRight className="w-4 h-4 text-gray-200" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Form */}
        <div className="space-y-8">
          {/* Step 1 – Shipping */}
          {step === 1 && (
            <section className="animate-in fade-in slide-in-from-left-4 duration-500">
              <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3 uppercase tracking-tight">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-indigo-600" />
                </div>
                Delivery Details
              </h2>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Full Name *</label>
                  <input
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full h-13 px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-gray-900 text-sm"
                    placeholder="Jane Doe"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Phone Number *</label>
                  <input
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full h-13 px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-gray-900 text-sm"
                    placeholder="0712 345 678"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Branch or Delivery Address</label>
                  <input
                    name="address"
                    type="text"
                    value={form.address}
                    onChange={handleChange}
                    className="w-full h-13 px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-gray-900 text-sm"
                    placeholder="Nairobi Branch / Tom Mboya St"
                  />
                </div>
              </div>
              <button
                onClick={() => {
                  if (!form.name) { toast.error("Please enter your name"); return; }
                  setStep(2);
                }}
                className="mt-8 w-full py-4 bg-black text-white rounded-2xl font-black hover:bg-indigo-600 transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-2 group active:scale-95"
              >
                Continue to Payment
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </section>
          )}

          {/* Step 2 – Payment */}
          {step === 2 && (
            <section className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3 uppercase tracking-tight">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-indigo-600" />
                </div>
                M-Pesa Payment
              </h2>

              <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-3xl space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white rounded-2xl border border-green-100 shadow-sm flex items-center justify-center text-2xl font-black text-green-600">M</div>
                  <div>
                    <p className="font-black text-gray-900 text-lg">Lipa na M-Pesa</p>
                    <p className="text-xs text-gray-500 font-medium">Safe, Instant & Encrypted</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">M-Pesa Number *</label>
                  <div className="flex items-center bg-white border border-green-100 rounded-2xl overflow-hidden shadow-sm">
                    <span className="px-5 py-4 text-gray-700 font-black border-r border-green-100 bg-gray-50 text-sm">+254</span>
                    <input
                      name="mpesaPhone"
                      type="tel"
                      value={form.mpesaPhone}
                      onChange={handleChange}
                      className="flex-1 px-4 py-4 bg-white font-black text-gray-900 text-sm focus:outline-none"
                      placeholder="712 345 678"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                  <Lock className="w-3.5 h-3.5 text-green-500" />
                  You will receive an STK push on your phone. Enter your M-Pesa PIN to confirm.
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isLoading}
                className="mt-8 w-full py-5 bg-green-600 text-white rounded-2xl font-black hover:bg-green-700 transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-2 group active:scale-95 disabled:opacity-60 shadow-xl shadow-green-100"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Placing Order...
                  </div>
                ) : (
                  <>
                    Confirm & Pay Ksh {total.toLocaleString()}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
              <button onClick={() => setStep(1)} className="mt-3 w-full text-center text-xs text-gray-400 font-bold hover:text-indigo-600 transition-colors">
                ← Back to Shipping
              </button>
            </section>
          )}
        </div>

        {/* Right: Order Summary */}
        <div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-2xl sticky top-24">
            <h3 className="text-xl font-black text-gray-900 mb-6 pb-4 border-b border-gray-50 uppercase tracking-tight">
              Your Order ({items.length} {items.length === 1 ? "item" : "items"})
            </h3>

            <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 items-center">
                  <div className="w-14 h-14 bg-gray-50 rounded-xl border border-gray-100 overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-gray-900 truncate">{item.name}</p>
                    <p className="text-xs text-gray-400 font-bold">Qty: {item.quantity} × Ksh {item.price.toLocaleString()}</p>
                  </div>
                  <span className="text-sm font-black text-gray-900 flex-shrink-0">
                    Ksh {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3 pt-6 border-t border-gray-100">
              <div className="flex justify-between text-sm text-gray-500 font-medium">
                <span>Subtotal</span>
                <span className="text-gray-900 font-bold">Ksh {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500 font-medium">
                <span>Delivery</span>
                {delivery === 0 ? (
                  <span className="text-green-600 font-black">FREE</span>
                ) : (
                  <span className="text-gray-900 font-bold">Ksh {delivery.toLocaleString()}</span>
                )}
              </div>
              <div className="flex justify-between items-baseline pt-3 border-t border-gray-100">
                <span className="text-xl font-black text-gray-900">Total</span>
                <span className="text-3xl font-black text-indigo-600">Ksh {total.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-6 flex justify-center gap-4 opacity-40">
              <Smartphone className="w-5 h-5" />
              <Lock className="w-5 h-5" />
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
