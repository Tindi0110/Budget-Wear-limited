"use client";

import Link from "next/link";
import {
  Trash2,
  Minus,
  Plus,
  ArrowRight,
  ShoppingBag,
  Tag,
  Truck,
  ShieldCheck,
  RefreshCw,
  X,
} from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { useState } from "react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, count, clearCart } = useCart();
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);

  const delivery = subtotal > 3000 ? 0 : 200;
  const discount = couponApplied ? couponDiscount : 0;
  const total = subtotal - discount + delivery;

  const handleApplyCoupon = () => {
    if (coupon.trim().toUpperCase() === "BUDGET10") {
      const d = Math.round(subtotal * 0.1);
      setCouponDiscount(d);
      setCouponApplied(true);
    } else {
      setCouponApplied(false);
      setCouponDiscount(0);
      alert("Invalid coupon code");
    }
  };

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="w-28 h-28 bg-indigo-50 rounded-full flex items-center justify-center mb-8">
          <ShoppingBag className="w-14 h-14 text-indigo-300" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Your cart is empty</h2>
        <p className="text-gray-500 font-medium mb-10 text-center max-w-sm">
          Looks like you haven't added anything yet. Browse our collection and find something you love!
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-10 py-4 bg-black text-white font-black rounded-2xl hover:bg-indigo-600 transition-all active:scale-95 shadow-xl shadow-gray-200 uppercase tracking-widest text-sm"
        >
          Browse Products
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">
          Shopping Cart{" "}
          <span className="text-indigo-600 text-2xl">({count} {count === 1 ? "item" : "items"})</span>
        </h1>
        <button
          onClick={clearCart}
          className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-red-500 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Clear all
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-5 p-5 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group animate-in fade-in slide-in-from-left-4"
            >
              {/* Product Image */}
              <div className="w-28 h-28 bg-gray-100 rounded-2xl overflow-hidden border border-gray-100 flex-shrink-0">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 text-gray-300" />
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-base font-black text-gray-900 truncate">{item.name}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      {item.branch_name && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded-full">
                          {item.branch_name}
                        </span>
                      )}
                      {item.category_name && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-500 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-full">
                          {item.category_name}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-lg font-black text-indigo-600">
                      Ksh {(item.price * item.quantity).toLocaleString()}
                    </p>
                    {item.quantity > 1 && (
                      <p className="text-[10px] text-gray-400 font-bold">
                        Ksh {item.price.toLocaleString()} each
                      </p>
                    )}
                  </div>
                </div>

                {/* Quantity + Remove */}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-1 bg-gray-50 rounded-xl p-1 border border-gray-100">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-white hover:text-indigo-600 hover:shadow-sm transition-all"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center font-black text-gray-900 text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-white hover:text-indigo-600 hover:shadow-sm transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="flex items-center gap-1.5 text-xs font-black text-gray-400 hover:text-red-500 hover:bg-red-50 px-3 py-2 rounded-xl transition-all uppercase tracking-widest"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            {[
              { icon: Truck, label: "Free delivery over Ksh 3,000" },
              { icon: ShieldCheck, label: "Quality guaranteed" },
              { icon: RefreshCw, label: "Easy returns" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-gray-100 text-center">
                <Icon className="w-5 h-5 text-indigo-500" />
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl sticky top-24 space-y-6">
            <h2 className="text-xl font-black text-gray-900 pb-4 border-b border-gray-50 uppercase tracking-tight">
              Order Summary
            </h2>

            {/* Line items */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center text-gray-600 font-medium">
                <span>Subtotal ({count} items)</span>
                <span className="text-gray-900 font-bold">Ksh {subtotal.toLocaleString()}</span>
              </div>

              {couponApplied && (
                <div className="flex justify-between items-center text-green-600 font-bold animate-in slide-in-from-top-2">
                  <span className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    BUDGET10 (10% off)
                  </span>
                  <span>−Ksh {couponDiscount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between items-center text-gray-600 font-medium">
                <span>Delivery</span>
                {delivery === 0 ? (
                  <span className="text-green-600 font-black">FREE</span>
                ) : (
                  <span className="text-gray-900 font-bold">Ksh {delivery.toLocaleString()}</span>
                )}
              </div>
              {delivery > 0 && (
                <p className="text-[10px] text-gray-400 font-medium">
                  Add Ksh {(3000 - subtotal).toLocaleString()} more for free delivery
                </p>
              )}
            </div>

            {/* Coupon code */}
            {!couponApplied ? (
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Coupon code"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    className="w-full h-11 pl-9 pr-3 bg-gray-50 border border-gray-100 rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-gray-900"
                  />
                </div>
                <button
                  onClick={handleApplyCoupon}
                  className="px-4 h-11 bg-black text-white text-xs font-black rounded-xl hover:bg-indigo-600 transition-all uppercase tracking-widest flex-shrink-0"
                >
                  Apply
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-green-50 border border-green-100 rounded-xl px-4 py-2.5">
                <span className="text-green-700 text-xs font-black flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5" /> BUDGET10 applied!
                </span>
                <button onClick={() => { setCouponApplied(false); setCouponDiscount(0); setCoupon(""); }} className="text-green-500 hover:text-red-500 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Divider + Total */}
            <div className="pt-4 border-t border-gray-100">
              <div className="flex justify-between items-end">
                <span className="text-lg font-black text-gray-900">Total</span>
                <div className="text-right">
                  <span className="text-3xl font-black text-indigo-600 block leading-none">
                    Ksh {total.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">VAT included</span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <Link
              href="/checkout"
              className="w-full bg-black text-white h-14 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all shadow-xl shadow-gray-200 active:scale-95 text-sm uppercase tracking-widest group"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/products"
              className="w-full text-center text-xs text-gray-400 font-bold hover:text-indigo-600 transition-colors block py-1"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
