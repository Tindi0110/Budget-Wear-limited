"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ShoppingBag, 
  Search, 
  Menu, 
  ArrowRight, 
  Star, 
  TrendingUp, 
  Package,
  Zap,
  ShieldCheck,
  MapPin,
  Heart
} from "lucide-react";

const categories = [
  { name: "Men", items: "1.2k+ Items", image: "https://placehold.co/400x500/000000/white?text=Men+Fashion" },
  { name: "Women", items: "2.5k+ Items", image: "https://placehold.co/400x500/000000/white?text=Women+Fashion" },
  { name: "Kids", items: "800+ Items", image: "https://placehold.co/400x500/000000/white?text=Kids+Wear" },
  { name: "Shoes", items: "500+ Items", image: "https://placehold.co/400x500/000000/white?text=Footwear" },
];

const featuredProducts = [
  { id: "1", name: "Premium Denim Jacket", price: 2500, branch: "Nairobi", image: "https://placehold.co/300x400/png" },
  { id: "2", name: "Classic Trench Coat", price: 3800, branch: "Mombasa", image: "https://placehold.co/300x400/png" },
  { id: "3", name: "Leather Chelsea Boots", price: 4200, branch: "Nakuru", image: "https://placehold.co/300x400/png" },
  { id: "4", name: "Vintage Wool Sweater", price: 1800, branch: "Eldoret", image: "https://placehold.co/300x400/png" },
];

export default function Home() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const searchResults = [
    { name: "Blue Denim Jacket", category: "Men", price: 2500, image: "https://placehold.co/50x50/png" },
    { name: "Classic Trench Coat", category: "Women", price: 3800, image: "https://placehold.co/50x50/png" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-xl">B</span>
            </div>
            <span className="text-2xl font-black tracking-tighter text-black">BUDGET WEAR</span>
          </Link>

          <div className="hidden md:flex items-center gap-10">
            <Link href="/products" className="text-sm font-bold text-gray-500 hover:text-black transition-colors">SHOP ALL</Link>
            <Link href="/categories" className="text-sm font-bold text-gray-500 hover:text-black transition-colors">CATEGORIES</Link>
            <Link href="/branches" className="text-sm font-bold text-gray-500 hover:text-black transition-colors">BRANCHES</Link>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative">
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="text-gray-400 hover:text-black p-2 transition-colors"
              >
                <Search className="w-6 h-6" />
              </button>
              
              {isSearchOpen && (
                <div className="absolute top-full right-0 mt-4 w-96 bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 animate-in slide-in-from-top-2 duration-300">
                  <input 
                    autoFocus
                    type="text" 
                    placeholder="Search for clothes, bales..." 
                    className="w-full h-12 px-4 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery.length > 0 && (
                    <div className="mt-6 space-y-4">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Suggested Results</p>
                      {searchResults.map((res, i) => (
                        <div key={i} className="flex gap-4 p-2 hover:bg-gray-50 rounded-2xl cursor-pointer transition-colors group">
                           <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden">
                              <img src={res.image} />
                           </div>
                           <div>
                              <p className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{res.name}</p>
                              <p className="text-xs text-gray-500 font-medium">Ksh {res.price.toLocaleString()}</p>
                           </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <Link href="/wishlist" className="text-gray-400 hover:text-red-500 transition-colors">
              <Heart className="w-6 h-6" />
            </Link>

            <Link href="/cart" className="relative p-2 text-gray-400 hover:text-black transition-colors">
              <ShoppingBag className="w-6 h-6" />
              <span className="absolute top-0 right-0 w-5 h-5 bg-indigo-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">3</span>
            </Link>
            <button className="md:hidden p-2"><Menu className="w-6 h-6" /></button>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-12">
            <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-xs font-black uppercase tracking-widest">
                <Zap className="w-4 h-4 fill-indigo-700" />
                New Drops Just Landed
              </div>
              <h1 className="text-6xl md:text-7xl font-black text-black leading-[0.9] tracking-tighter">
                CURATED <br/> THRIFT <br/> <span className="text-indigo-600">REDEFINED.</span>
              </h1>
              <p className="text-xl text-gray-500 max-w-lg leading-relaxed font-medium">
                Discover unique Ex-UK clothing across our multiple branches. High quality and sustainable.
              </p>
              <div className="flex items-center gap-6">
                <Link 
                  href="/products" 
                  className="px-10 py-5 bg-black text-white rounded-2xl font-black flex items-center gap-3 hover:bg-indigo-600 transition-all shadow-xl shadow-gray-200 active:scale-95"
                >
                  SHOP THE COLLECTION
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            <div className="relative animate-in fade-in duration-1000">
              <div className="aspect-[16/9] bg-gray-100 rounded-[3rem] overflow-hidden shadow-2xl">
                 <img src="https://placehold.co/1200x675/000000/white?text=Sustainable+Fashion" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <aside className="lg:col-span-4 space-y-8 h-fit lg:sticky lg:top-32">
            {/* Branch Widget */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-indigo-600 mb-4">
                  <MapPin className="w-5 h-5" />
                  <span className="text-xs font-black uppercase tracking-widest">Your Branch</span>
                </div>
                <h3 className="text-2xl font-black text-gray-900">Nairobi CBD</h3>
                <p className="text-sm text-gray-500 font-medium mt-1">Tom Mboya Street, Pioneer Hse</p>
                <div className="mt-6 space-y-3">
                   <div className="flex justify-between text-xs font-bold text-gray-400">
                      <span>OPENING HOURS</span>
                      <span className="text-green-600">OPEN NOW</span>
                   </div>
                   <p className="text-sm font-bold text-gray-900">08:00 AM - 07:00 PM</p>
                </div>
                <button className="w-full mt-8 py-4 bg-gray-50 text-gray-900 rounded-2xl font-bold hover:bg-gray-100 transition-all border border-gray-100">
                   Change Branch
                </button>
              </div>
            </div>

            {/* Flash Offers Widget */}
            <div className="bg-black p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4">
                  <div className="bg-indigo-600 px-3 py-1 rounded-full text-[10px] font-black animate-pulse">FLASH SALE</div>
               </div>
               <div className="relative z-10">
                  <h4 className="text-xl font-black mb-2 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    Special Offers
                  </h4>
                  <div className="flex gap-2 mb-6">
                     {["02", "14", "45"].map((t, i) => (
                       <div key={i} className="flex flex-col items-center">
                          <div className="bg-white/10 w-10 h-10 rounded-lg flex items-center justify-center font-black text-lg">{t}</div>
                          <span className="text-[8px] mt-1 font-bold text-gray-500 uppercase">{["HRS", "MIN", "SEC"][i]}</span>
                       </div>
                     ))}
                  </div>
                  <div className="space-y-4">
                     {[1, 2].map(i => (
                       <div key={i} className="flex gap-4 p-3 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                          <div className="w-12 h-12 rounded-xl bg-gray-800 shrink-0 overflow-hidden">
                             <img src="https://placehold.co/100x100/png" />
                          </div>
                          <div>
                             <p className="text-xs font-bold line-clamp-1">Blue Cotton Bale</p>
                             <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs font-black text-indigo-400">Ksh 12,500</span>
                                <span className="text-[10px] text-gray-600 line-through">Ksh 15k</span>
                             </div>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-baseline justify-between mb-12">
            <h2 className="text-4xl font-black text-black tracking-tighter">BROWSE CATEGORIES</h2>
            <Link href="/categories" className="text-sm font-bold text-indigo-600 hover:underline">VIEW ALL</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {categories.map((cat) => (
              <Link key={cat.name} href={`/products?category=${cat.name.toLowerCase()}`} className="group relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-lg transition-transform hover:-translate-y-2">
                <img src={cat.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-xl font-black text-white">{cat.name}</p>
                  <p className="text-sm text-gray-300 font-semibold">{cat.items}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-baseline justify-between mb-12">
            <h2 className="text-4xl font-black text-black tracking-tighter">TRENDING NEAR YOU</h2>
            <div className="flex gap-4">
               <button className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center hover:bg-black hover:text-white transition-all"><ArrowRight className="w-5 h-5 rotate-180" /></button>
               <button className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center hover:bg-black hover:text-white transition-all"><ArrowRight className="w-5 h-5" /></button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {featuredProducts.map((p) => (
              <div key={p.id} className="group cursor-pointer">
                <div className="aspect-[3/4] bg-gray-100 rounded-3xl overflow-hidden mb-6 relative shadow-sm">
                  <img src={p.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <button className="absolute top-4 right-4 p-3 bg-white/80 backdrop-blur-md rounded-2xl opacity-0 group-hover:opacity-100 transition-all hover:bg-white scale-90 group-hover:scale-100 shadow-xl">
                    <ShoppingBag className="w-5 h-5 text-black" />
                  </button>
                  <div className="absolute bottom-4 left-4 flex items-center gap-1.5 px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-xl text-white text-[10px] font-bold">
                    <MapPin className="w-3 h-3" />
                    {p.branch}
                  </div>
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-lg text-black line-clamp-1">{p.name}</h4>
                  <div className="flex items-center justify-between">
                    <p className="text-indigo-600 font-black">Ksh {p.price.toLocaleString()}</p>
                    <div className="flex items-center gap-1 text-yellow-400">
                       <Star className="w-3.5 h-3.5 fill-current" />
                       <span className="text-gray-400 text-xs font-bold">4.9</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-black py-20 text-white">
         <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-16">
            <div className="md:col-span-2 space-y-8">
               <div className="flex items-center gap-2">
                 <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                   <span className="text-black font-black text-2xl">B</span>
                 </div>
                 <span className="text-3xl font-black tracking-tighter">BUDGET WEAR</span>
               </div>
               <p className="text-gray-400 max-w-md text-lg leading-relaxed">
                 Quality Ex-UK fashion, curated for style and durability. Proudly serving multiple locations across Kenya.
               </p>
            </div>
            <div className="space-y-6">
               <h5 className="font-bold text-lg">BRANCHES</h5>
               <ul className="space-y-4 text-gray-500 font-medium">
                  <li className="hover:text-white cursor-pointer transition-colors">Nairobi CBD</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Nakuru Town</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Mombasa Nyali</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Eldoret Town</li>
               </ul>
            </div>
            <div className="space-y-6">
               <h5 className="font-bold text-lg">CUSTOMER CARE</h5>
               <ul className="space-y-4 text-gray-500 font-medium">
                  <li className="hover:text-white cursor-pointer transition-colors">Contact Us</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Delivery Info</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Returns & Exchanges</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Store Locator</li>
               </ul>
            </div>
         </div>
      </footer>
    </div>
  );
}
