"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ShoppingBag, 
  Search, 
  ArrowLeft, 
  Star, 
  Baby,
  Heart,
  Filter
} from "lucide-react";

const babyProducts = [
  { id: "b1", name: "Soft Cotton Sleepsuit Set", price: 1200, category: "Newborn", image: "https://placehold.co/300x400/FF69B4/white?text=Baby+Sleepsuit" },
  { id: "b2", name: "Premium Knitted Cardigan", price: 1800, category: "Toddler", image: "https://placehold.co/300x400/FF69B4/white?text=Knitted+Cardigan" },
  { id: "b3", name: "Organic Cotton Onesies (3pk)", price: 1500, category: "Essentials", image: "https://placehold.co/300x400/FF69B4/white?text=Onesies" },
  { id: "b4", name: "Handmade Woolen Booties", price: 600, category: "Footwear", image: "https://placehold.co/300x400/FF69B4/white?text=Booties" },
];

export default function BabyShop() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-pink-50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-pink-600 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110">
              <ArrowLeft className="text-white w-6 h-6" />
            </div>
            <span className="text-sm font-black tracking-tight text-gray-500 group-hover:text-black transition-colors">BACK TO MAIN</span>
          </Link>

          <div className="flex items-center gap-2">
            <Baby className="w-6 h-6 text-pink-600 animate-bounce" />
            <span className="text-2xl font-black tracking-tighter text-black uppercase">THE BABY SHOP</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/cart" className="relative p-2 text-gray-400 hover:text-pink-600 transition-colors">
              <ShoppingBag className="w-6 h-6" />
              <span className="absolute top-0 right-0 w-5 h-5 bg-pink-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">0</span>
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-4">
        {/* Hero Banner */}
        <section className="max-w-7xl mx-auto mb-20">
          <div className="relative h-96 rounded-[3rem] overflow-hidden bg-pink-100 flex items-center px-12 md:px-20">
            <div className="relative z-10 max-w-lg space-y-6">
              <div className="inline-block px-4 py-1.5 bg-white text-pink-600 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                EXCLUSIVE COLLECTION
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-black leading-none tracking-tighter">
                GENTLE ON <br/> <span className="text-pink-600">LITTLE SKIN.</span>
              </h1>
              <p className="text-lg text-gray-600 font-medium">
                Our curated selection of premium Ex-UK baby wear is now available exclusively online and at our specialized branches.
              </p>
            </div>
            <div className="absolute right-0 top-0 h-full w-1/2 hidden md:block">
              <img 
                src="https://placehold.co/600x400/FF69B4/white?text=Baby+Models" 
                className="w-full h-full object-cover" 
                alt="Baby Models"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-pink-100 to-transparent" />
            </div>
          </div>
        </section>

        {/* Categories & Products */}
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 space-y-10">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-black mb-6">
                <Filter className="w-5 h-5" />
                <h3 className="font-black text-lg">Filters</h3>
              </div>
              
              <div className="space-y-2">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Size Range</p>
                {["Newborn", "0-3 Months", "3-6 Months", "6-12 Months", "12-24 Months"].map((size) => (
                  <label key={size} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-5 h-5 rounded-lg border-gray-200 text-pink-600 focus:ring-pink-500/20" />
                    <span className="text-sm font-bold text-gray-500 group-hover:text-black transition-colors">{size}</span>
                  </label>
                ))}
              </div>

              <hr className="border-gray-50 my-8" />

              <div className="space-y-4">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Price Point</p>
                 <input type="range" className="w-full accent-pink-600" min="0" max="5000" />
                 <div className="flex justify-between text-xs font-black text-gray-400">
                    <span>Ksh 0</span>
                    <span>Ksh 5,000</span>
                 </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1 space-y-12">
            <div className="flex items-baseline justify-between">
              <h2 className="text-3xl font-black text-black tracking-tighter">ALL BABY WEAR</h2>
              <p className="text-xs font-bold text-gray-400">{babyProducts.length} Items Found</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {babyProducts.map((p) => (
                <div key={p.id} className="group cursor-pointer">
                  <div className="aspect-[3/4] bg-gray-50 rounded-[2.5rem] overflow-hidden mb-6 relative shadow-sm transition-all duration-500 hover:shadow-xl hover:shadow-pink-50">
                    <img src={p.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <button className="absolute top-6 right-6 p-3 bg-white/80 backdrop-blur-md rounded-2xl opacity-0 group-hover:opacity-100 transition-all hover:bg-white scale-90 group-hover:scale-100 shadow-xl">
                      <ShoppingBag className="w-5 h-5 text-pink-600" />
                    </button>
                    <div className="absolute top-6 left-6 flex items-center gap-1.5 px-3 py-1.5 bg-pink-100 text-pink-700 rounded-xl text-[10px] font-black shadow-sm">
                      {p.category}
                    </div>
                  </div>
                  <div className="px-2 space-y-1">
                    <h4 className="font-black text-lg text-black group-hover:text-pink-600 transition-colors uppercase tracking-tight">{p.name}</h4>
                    <div className="flex items-center justify-between">
                      <p className="text-pink-600 font-bold text-lg">Ksh {p.price.toLocaleString()}</p>
                      <div className="flex items-center gap-1.5">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-gray-400 text-xs font-black">5.0</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Placeholder */}
            <div className="flex justify-center pt-12">
               <button className="px-10 py-4 bg-gray-50 text-gray-400 rounded-2xl font-black text-xs hover:bg-black hover:text-white transition-all">LOAD MORE ITEMS</button>
            </div>
          </div>
        </div>
      </main>

      {/* Trust Badges */}
      <section className="py-20 bg-gray-50 border-y border-gray-100">
         <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { label: "PREMIUM EX-UK", desc: "Highest Quality Handpicked", icon: <Star /> },
              { label: "SAFE & GENTLE", desc: "Organic Fabrics Available", icon: <Baby /> },
              { label: "FAST DELIVERY", desc: "Same Day Within Towns", icon: <ShoppingBag /> },
              { label: "EASY RETURNS", desc: "7-Day Return Policy", icon: <Heart /> },
            ].map((badge, i) => (
              <div key={i} className="flex flex-col items-center text-center space-y-4">
                 <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-pink-600 shadow-sm">
                    {badge.icon}
                 </div>
                 <div>
                    <h5 className="font-black text-xs uppercase tracking-widest text-black">{badge.label}</h5>
                    <p className="text-[10px] font-bold text-gray-400 mt-1">{badge.desc}</p>
                 </div>
              </div>
            ))}
         </div>
      </section>
    </div>
  );
}
