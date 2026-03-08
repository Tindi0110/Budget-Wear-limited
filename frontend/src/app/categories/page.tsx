"use client";

import Link from "next/link";
import { ArrowLeft, Tag, ShoppingBag, ArrowRight } from "lucide-react";

const categories = [
  { name: "Men", items: "1.2k+ Items", image: "https://placehold.co/400x500/000000/white?text=Men+Fashion", color: "indigo" },
  { name: "Women", items: "2.5k+ Items", image: "https://placehold.co/400x500/000000/white?text=Women+Fashion", color: "pink" },
  { name: "Kids", items: "800+ Items", image: "https://placehold.co/400x500/000000/white?text=Kids+Wear", color: "orange" },
  { name: "Shoes", items: "500+ Items", image: "https://placehold.co/400x500/000000/white?text=Footwear", color: "black" },
  { name: "Accessories", items: "300+ Items", image: "https://placehold.co/400x500/000000/white?text=Accs", color: "slate" },
  { name: "Bales", items: "50+ In Stock", image: "https://placehold.co/400x500/000000/white?text=Bales", color: "indigo" },
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center transition-transform group-hover:scale-110">
              <ArrowLeft className="text-white w-6 h-6" />
            </div>
            <span className="text-sm font-black tracking-tight text-gray-500 group-hover:text-black transition-colors">BACK HOME</span>
          </Link>
          <span className="text-2xl font-black tracking-tighter text-black">CATEGORIES</span>
          <Link href="/cart" className="relative p-2 text-gray-400 hover:text-black transition-colors">
            <ShoppingBag className="w-6 h-6" />
          </Link>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                <Tag className="w-4 h-4 fill-indigo-700" />
                Find your fit
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-black tracking-tighter">SHOP BY <br/> <span className="text-indigo-600">CATEGORY.</span></h1>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat) => (
              <Link 
                key={cat.name} 
                href={`/products?category=${cat.name.toLowerCase()}`} 
                className="group relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl transition-all duration-700 hover:-translate-y-4"
              >
                <img src={cat.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
                
                <div className="absolute inset-0 p-12 flex flex-col justify-end">
                   <div className="space-y-2 transform transition-transform duration-500 group-hover:-translate-y-2">
                      <p className="text-sm font-black text-indigo-400 uppercase tracking-[0.3em]">{cat.items}</p>
                      <h3 className="text-4xl font-black text-white uppercase tracking-tighter">{cat.name}</h3>
                   </div>
                   
                   <div className="mt-8 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                      <div className="bg-white text-black px-6 py-3 rounded-2xl font-black text-xs flex items-center gap-2">
                        EXPLORE NOW
                        <ArrowRight className="w-4 h-4" />
                      </div>
                   </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
