"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ShoppingBag, 
  Search, 
  Menu, 
  Heart,
  Baby,
  X,
  TrendingUp,
  MapPin,
  ChevronDown,
  Package
} from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { useBranch } from "@/lib/BranchContext";
import { api } from "@/lib/api";
import CartOverlay from "./CartOverlay";

interface Product {
  id: string;
  name: string;
  price: number;
  category_name?: string;
  images?: Array<{ image_url: string }>;
}

interface Category {
  id: string;
  name: string;
}

export default function Header({ theme = 'default' }: { theme?: 'default' | 'pink' }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { count } = useCart();
  const { activeBranch, setActiveBranch, branches } = useBranch();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const pathname = usePathname();
  const [isBranchOpen, setIsBranchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    api.get("/products/").then(setProducts).catch(console.error);
    api.get("/categories/").then(setCategories).catch(console.error);
  }, []);

  // Determine if we should use the pink theme based on path OR selected branch
  const isCurrentlyPink = theme === 'pink' || 
                         pathname.includes('sarabis') || 
                         pathname.includes('baby-shop') ||
                         activeBranch?.name.toLowerCase().includes('baby');

  const searchResults = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.category_name?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  ).slice(0, 5);

  const isPink = isCurrentlyPink;
  const bgColor = isPink ? 'bg-white/80 border-pink-100' : 'bg-white/90 border-gray-100';
  const logoBg = isPink ? 'bg-pink-500' : 'bg-indigo-600';
  const activeLinkHover = isPink ? 'hover:text-pink-600' : 'hover:text-indigo-600';
  const bgBadgeColor = isPink ? 'bg-pink-500' : 'bg-indigo-600';
  
  // Specific Sarabis Baby categories requested
  const babyCategories = ["Gifts", "Pacifiers", "Mealtime", "Clothing", "Bath", "Toys", "Sale"];

  return (
    <>
      <nav className={`fixed top-0 w-full z-[100] backdrop-blur-xl border-b shadow-sm ${bgColor}`}>
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className={`w-10 h-10 ${logoBg} rounded-xl flex items-center justify-center transition-transform group-hover:scale-105`}>
              {isPink ? <Baby className="w-6 h-6 text-white" /> : <span className="text-white font-black text-xl">B</span>}
            </div>
            {isPink ? (
              <span className="text-2xl font-black tracking-tighter text-gray-900 uppercase hidden sm:block">Sarabis <span className="text-pink-500">Baby</span></span>
            ) : (
              <span className="text-2xl font-black tracking-tighter text-black hidden sm:block">BUDGET WEAR</span>
            )}
          </Link>

          {/* Search Bar Professional */}
          <div className="hidden lg:flex flex-1 max-w-xl relative">
             <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search products, categories..." 
                  className={`w-full h-11 pl-11 pr-4 bg-gray-50 border border-gray-200 rounded-full text-sm font-medium focus:bg-white focus:ring-4 transition-all outline-none ${isPink ? 'focus:ring-pink-500/10 focus:border-pink-500' : 'focus:ring-indigo-500/10 focus:border-indigo-500'}`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchOpen(true)}
                />
             </div>
             {isSearchOpen && searchQuery.length > 0 && (
               <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center justify-between mb-4 px-2">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Top Search Results</p>
                    <button onClick={() => setIsSearchOpen(false)} className="text-xs font-bold text-gray-400 hover:text-black transition-colors">Close</button>
                  </div>
                  <div className="space-y-4">
                    {searchResults.length > 0 ? searchResults.map((res) => (
                      <Link key={res.id} href={`/products?category=${encodeURIComponent(res.category_name || '')}`} onClick={() => setIsSearchOpen(false)} className="flex gap-4 p-2 hover:bg-gray-50 rounded-2xl transition-colors group">
                         <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                            {res.images?.[0] ? (
                              <img src={res.images[0].image_url} alt={res.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center"><Package className="w-6 h-6 text-gray-200" /></div>
                            )}
                         </div>
                         <div className="min-w-0">
                            <p className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 truncate">{res.name}</p>
                            <p className="text-xs text-indigo-600 font-bold">Ksh {res.price.toLocaleString()}</p>
                         </div>
                      </Link>
                    )) : (
                      <p className="text-xs text-gray-400 font-medium text-center py-4">No matching items found</p>
                    )}
                  </div>
               </div>
             )}
          </div>

          <div className="flex items-center gap-4 xl:gap-6">
            {/* Branch Switcher */}
            <div className="relative hidden md:block">
              <button 
                onClick={() => setIsBranchOpen(!isBranchOpen)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-black uppercase tracking-widest transition-all ${isPink ? 'bg-pink-50 border-pink-100 text-pink-600 hover:bg-pink-100' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'}`}
              >
                <MapPin className="w-4 h-4" />
                <span className="truncate max-w-[100px]">{activeBranch ? activeBranch.name : 'ALL BRANCHES'}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${isBranchOpen ? 'rotate-180' : ''}`} />
              </button>
              {isBranchOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <button 
                    onClick={() => { setActiveBranch(null); setIsBranchOpen(false); }}
                    className={`w-full text-left px-4 py-3 text-xs font-black uppercase tracking-widest transition-colors ${!activeBranch ? (isPink ? 'bg-pink-50 text-pink-600' : 'bg-indigo-50 text-indigo-600') : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    All Branches
                  </button>
                  {branches.map(branch => (
                    <button 
                      key={branch.id}
                      onClick={() => { setActiveBranch(branch); setIsBranchOpen(false); }}
                      className={`w-full text-left px-4 py-3 text-xs font-black uppercase tracking-widest transition-colors border-t border-gray-50 ${activeBranch?.id === branch.id ? (isPink ? 'bg-pink-50 text-pink-600' : 'bg-indigo-50 text-indigo-600') : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                      {branch.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <nav className="hidden xl:flex items-center gap-6">
              <Link href="/products" className={`text-xs font-black text-gray-500 transition-colors uppercase tracking-widest ${activeLinkHover}`}>Shop All</Link>
              <Link href="/services" className={`text-xs font-black text-gray-500 transition-colors uppercase tracking-widest ${activeLinkHover}`}>Services</Link>
              <Link href="/about" className={`text-xs font-black text-gray-500 transition-colors uppercase tracking-widest ${activeLinkHover}`}>About</Link>
              <Link href="/contact" className={`text-xs font-black text-gray-500 transition-colors uppercase tracking-widest ${activeLinkHover}`}>Contact</Link>
              {!isPink && <Link href="/sarabis" className="text-xs font-black text-pink-500 hover:text-pink-600 transition-colors uppercase tracking-widest">Sarabis Baby</Link>}
            </nav>
            
            <div className="flex items-center gap-2 sm:gap-4">
              <Link href="/wishlist" className="p-2 text-gray-400 hover:text-red-500 transition-colors hidden sm:block">
                <Heart className="w-6 h-6" />
              </Link>

              <button 
                onClick={() => setIsCartOpen(true)} 
                className="relative p-2 text-gray-400 hover:text-black transition-colors"
              >
                <ShoppingBag className="w-6 h-6" />
                {count > 0 && (
                  <span className={`absolute top-0 right-0 w-5 h-5 ${bgBadgeColor} text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-bounce`}>
                    {count}
                  </span>
                )}
              </button>
               <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="xl:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
               >
                 <Menu className="w-6 h-6 text-black" />
               </button>
            </div>
          </div>
        </div>
        
        {/* Sarabis Baby Sub-Header - Persistent if in baby shop context */}
        {isPink && (
          <div className="border-t border-pink-50 bg-pink-50/50 backdrop-blur-md">
             <div className="max-w-7xl mx-auto px-4 h-12 flex items-center justify-center gap-4 sm:gap-8 overflow-x-auto no-scrollbar">
                {babyCategories.map((cat, i) => (
                   <Link key={i} href={`/products?category=Baby Shop&subcategory=${encodeURIComponent(cat)}`} className="text-[10px] sm:text-xs font-black text-pink-500 uppercase tracking-[0.1em] hover:text-pink-700 whitespace-nowrap px-2 py-1">
                      {cat}
                   </Link>
                ))}
             </div>
          </div>
        )}
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[200] xl:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
          <div className="absolute top-0 left-0 bottom-0 w-[80%] max-w-sm bg-white shadow-2xl animate-in slide-in-from-left duration-500 flex flex-col">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 ${isPink ? 'bg-pink-500' : 'bg-indigo-600'} rounded-lg flex items-center justify-center`}>
                    {isPink ? <Baby className="w-4 h-4 text-white" /> : <span className="text-white font-black text-sm">B</span>}
                  </div>
                  <span className="text-lg font-black tracking-tighter uppercase">{isPink ? 'SARABIS BABY' : 'BUDGET WEAR'}</span>
               </div>
               <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-all">
                  <X className="w-5 h-5 text-gray-400" />
               </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
               <div className="mb-6">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-3 mb-2">Branch Selection</p>
                 <select 
                   className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-widest text-gray-700"
                   value={activeBranch?.id || ""}
                   onChange={(e) => {
                     const branch = branches.find(b => b.id.toString() === e.target.value);
                     setActiveBranch(branch || null);
                     setIsMenuOpen(false);
                   }}
                 >
                   <option value="">All Branches</option>
                   {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                 </select>
               </div>

               <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-3 mb-2">Navigation</p>
               <Link href="/" className={`flex items-center gap-3 p-3 rounded-2xl font-bold text-sm transition-all ${pathname === '/' ? (isPink ? 'bg-pink-50 text-pink-600' : 'bg-indigo-50 text-indigo-700') : 'text-gray-600 hover:bg-gray-50'}`}>
                  <TrendingUp className="w-5 h-5" /> Home
               </Link>
               <Link href="/products" className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 text-gray-600 font-bold text-sm transition-all">
                  <ShoppingBag className="w-5 h-5" /> Shop All
               </Link>
               <Link href="/services" className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 text-gray-600 font-bold text-sm transition-all">
                  <Package className="w-5 h-5" /> Services
               </Link>
               
               {isPink && (
                 <div className="pt-6">
                    <p className="text-[10px] font-black text-pink-400 uppercase tracking-[0.2em] px-3 mb-4">Baby Categories</p>
                    <div className="space-y-1">
                      {babyCategories.map((cat, i) => (
                        <Link key={i} href={`/products?category=Baby Shop&subcategory=${encodeURIComponent(cat)}`} className="block px-4 py-2 text-sm font-bold text-gray-600 hover:text-pink-500 hover:bg-pink-50 rounded-xl transition-all uppercase tracking-tight">
                          {cat}
                        </Link>
                      ))}
                    </div>
                 </div>
               )}

               {!isPink && (
                 <div className="pt-6">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-3 mb-4">Categories</p>
                    <div className="space-y-1">
                      {categories.map(cat => (
                        <Link key={cat.id} href={`/products?category=${cat.name}`} onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-sm font-bold text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all uppercase tracking-tight">
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                 </div>
               )}
            </div>
          </div>
        </div>
      )}
      {/* Cart Overlay */}
      <CartOverlay isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
