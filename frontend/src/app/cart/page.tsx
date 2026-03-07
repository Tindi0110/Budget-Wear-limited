"use client";

import Link from "next/link";
import { 
  Trash2, 
  Minus, 
  Plus, 
  ArrowRight, 
  ShoppingBag,
  Info
} from "lucide-react";

export default function CartPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h1 className="text-4xl font-black text-gray-900 mb-10 flex items-center gap-4">
        Your Cart <span className="text-indigo-600">(3 items)</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-6 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
              <div className="w-32 h-32 bg-gray-100 rounded-2xl overflow-hidden border border-gray-50">
                 <img src="https://placehold.co/200x200/png" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Blue Denim Jacket</h3>
                    <p className="text-sm text-gray-500 mt-1">Nairobi Branch • Size: Medium</p>
                  </div>
                  <p className="text-lg font-black text-indigo-600">Ksh 2,500</p>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center bg-gray-50 rounded-xl px-2">
                    <button className="p-2 text-gray-400 hover:text-indigo-600"><Minus className="w-4 h-4" /></button>
                    <span className="w-8 text-center font-bold text-gray-900">1</span>
                    <button className="p-2 text-gray-400 hover:text-indigo-600"><Plus className="w-4 h-4" /></button>
                  </div>
                  <button className="flex items-center gap-1.5 text-sm text-red-500 font-bold hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex gap-3 text-blue-700">
            <Info className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">Standard delivery takes 1-2 business days within Nairobi.</p>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-50 pb-4">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between text-gray-500 font-medium">
                <span>Subtotal</span>
                <span className="text-gray-900">Ksh 7,500</span>
              </div>
              <div className="flex justify-between text-gray-500 font-medium">
                <span>Delivery Fee</span>
                <span className="text-gray-900 text-green-600 font-bold">FREE</span>
              </div>
              <div className="pt-6 border-t border-gray-100 flex justify-between items-baseline">
                <span className="text-xl font-bold text-gray-900">Total</span>
                <div className="text-right">
                  <span className="text-3xl font-black text-indigo-600 block">Ksh 7,500</span>
                  <span className="text-xs text-gray-400">VAT Included</span>
                </div>
              </div>
            </div>

            <Link 
              href="/checkout"
              className="w-full mt-10 bg-indigo-600 text-white h-14 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95"
            >
              Checkout Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
