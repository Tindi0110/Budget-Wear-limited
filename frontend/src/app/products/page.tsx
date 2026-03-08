"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ShoppingBag, 
  Search, 
  MapPin, 
  Star, 
  Heart,
  Filter,
  ArrowLeft
} from "lucide-react";

const allProducts = [
  { id: "1", name: "Premium Denim Jacket", price: 2500, branch: "Nairobi", category: "Men", image: "https://placehold.co/300x400/000000/white?text=Denim+Jacket" },
  { id: "2", name: "Classic Trench Coat", price: 3800, branch: "Mombasa", category: "Women", image: "https://placehold.co/300x400/000000/white?text=Trench+Coat" },
  { id: "3", name: "Leather Chelsea Boots", price: 4200, branch: "Nakuru", category: "Shoes", image: "https://placehold.co/300x400/000000/white?text=Chelsea+Boots" },
  { id: "4", name: "Vintage Wool Sweater", price: 1800, branch: "Eldoret", category: "Men", image: "https://placehold.co/300x400/000000/white?text=Wool+Sweater" },
  { id: "5", name: "Floral Summer Dress", price: 2200, branch: "Nairobi", category: "Women", image: "https://placehold.co/300x400/000000/white?text=Summer+Dress" },
  { id: "6", name: "Running Sneakers", price: 3500, branch: "Nairobi", category: "Shoes", image: "https://placehold.co/300x400/000000/white?text=Sneakers" },
];

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = allProducts.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center transition-transform group-hover:scale-110">
              <ArrowLeft className="text-white w-6 h-6" />
            </div>
            <span className="text-sm font-black tracking-tight text-gray-500 group-hover:text-black transition-colors">BACK HOME</span>
          </Link>

          <div className="flex-1 max-w-xl mx-8 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search products, brands, categories..." 
              className="w-full h-12 pl-12 pr-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-black/5 transition-all font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Link href="/cart" className="relative p-2 text-gray-400 hover:text-black transition-colors">
            <ShoppingBag className="w-6 h-6" />
            <span className="absolute top-0 right-0 w-5 h-5 bg-black text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">0</span>
          </Link>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 space-y-10">
            <div>
              <h3 className="text-xl font-black text-black tracking-tighter mb-6">Filters</h3>
              <div className="space-y-6">
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Categories</p>
                  {["Men", "Women", "Kids", "Shoes", "Accessories"].map((cat) => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="w-5 h-5 rounded-lg border-gray-200 text-black focus:ring-black/5" />
                      <span className="text-sm font-bold text-gray-500 group-hover:text-black transition-colors">{cat}</span>
                    </label>
                  ))}
                </div>

                <hr className="border-gray-50" />

                <div className="space-y-3">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Branches</p>
                  {["Nairobi", "Mombasa", "Nakuru", "Eldoret"].map((branch) => (
                    <label key={branch} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="w-5 h-5 rounded-lg border-gray-200 text-black focus:ring-black/5" />
                      <span className="text-sm font-bold text-gray-500 group-hover:text-black transition-colors">{branch}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1 space-y-12">
            <div className="flex items-baseline justify-between mb-8">
              <h1 className="text-4xl font-black text-black tracking-tighter">ALL COLLECTIONS</h1>
              <p className="text-sm font-bold text-gray-400">{filteredProducts.length} Results Found</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((p) => (
                <Link key={p.id} href={`/products/${p.id}`} className="group cursor-pointer">
                  <div className="aspect-[3/4] bg-gray-50 rounded-[2.5rem] overflow-hidden mb-6 relative shadow-sm transition-all duration-500 hover:shadow-xl hover:shadow-gray-100">
                    <img src={p.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <button className="absolute top-6 right-6 p-3 bg-white/80 backdrop-blur-md rounded-2xl opacity-0 group-hover:opacity-100 transition-all hover:bg-white scale-90 group-hover:scale-100 shadow-xl">
                      <ShoppingBag className="w-5 h-5 text-black" />
                    </button>
                    <div className="absolute top-6 left-6 flex items-center gap-1.5 px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-xl text-white text-[10px] font-bold">
                      <MapPin className="w-3 h-3" />
                      {p.branch}
                    </div>
                  </div>
                  <div className="px-2 space-y-1">
                    <h4 className="font-black text-lg text-black group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{p.name}</h4>
                    <div className="flex items-center justify-between">
                      <p className="text-indigo-600 font-bold text-lg">Ksh {p.price.toLocaleString()}</p>
                      <div className="flex items-center gap-1.5">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-gray-400 text-xs font-black">4.9</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
