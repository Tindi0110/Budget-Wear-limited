"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Star, 
  ShoppingCart, 
  MapPin, 
  ShieldCheck, 
  Truck, 
  RefreshCcw,
  Minus,
  Plus,
  Heart,
  Share2
} from "lucide-react";
import { toast } from "sonner";

export default function ProductDetail() {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm group">
            <img 
              src="https://placehold.co/800x800/2563eb/white?text=Premium+Denim+Jacket" 
              alt="Product"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square rounded-xl bg-white border border-gray-100 overflow-hidden cursor-pointer hover:border-indigo-500 transition-colors">
                <img src={`https://placehold.co/200x200/png?text=View+${i}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full uppercase tracking-wider">
              High Quality Thrift
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => toast.success("Added to favorites")}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
              >
                <Heart className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <h1 className="text-4xl font-black text-gray-900 mt-4 leading-tight">
            Premium UK Blue <br/> Denim Jacket
          </h1>

          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className={`w-4 h-4 ${s <= 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`} />
              ))}
            </div>
            <span className="text-sm font-medium text-gray-500 underline underline-offset-4 cursor-pointer hover:text-gray-900">48 Reviews</span>
          </div>

          <div className="mt-8 flex items-baseline gap-4">
            <span className="text-3xl font-black text-indigo-600">Ksh 2,500</span>
            <span className="text-xl text-gray-400 line-through">Ksh 3,200</span>
          </div>

          <p className="mt-6 text-gray-600 leading-relaxed text-lg">
            This premium-grade UK denim jacket features reinforced stitching and a timeless fit. Perfect for casual layering during Nairobi evenings or cool days in Nakuru.
          </p>

          <div className="mt-8 p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-4">
            <MapPin className="w-5 h-5 text-indigo-600" />
            <div>
              <p className="text-sm font-bold text-gray-900">Available at Nairobi Branch</p>
              <p className="text-xs text-gray-500">Pick up in 1 hour or same-day delivery</p>
            </div>
          </div>

          <div className="mt-10 space-y-6">
            <div className="flex items-center gap-6">
              <div className="flex items-center bg-white border border-gray-200 rounded-xl px-2 h-12 shadow-sm">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-gray-500 hover:text-indigo-600 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-bold text-gray-900">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-gray-500 hover:text-indigo-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <button 
                onClick={() => toast.success("Added to cart!")}
                className="flex-1 bg-indigo-600 text-white h-12 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100">
               <div className="flex flex-col items-center gap-2 text-center">
                 <ShieldCheck className="w-6 h-6 text-green-600" />
                 <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">Authentic Quality</span>
               </div>
               <div className="flex flex-col items-center gap-2 text-center">
                 <Truck className="w-6 h-6 text-blue-600" />
                 <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">Fast Delivery</span>
               </div>
               <div className="flex flex-col items-center gap-2 text-center">
                 <RefreshCcw className="w-6 h-6 text-orange-600" />
                 <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">Easy Returns</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
