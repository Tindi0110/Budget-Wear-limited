"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Search, MapPin, Star, ArrowLeft, Package, SlidersHorizontal, X } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useBranch } from "@/lib/BranchContext";
import Header from "@/components/Header";

interface Product {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  discount_percentage?: number;
  description: string;
  stock: number;
  branch_name: string;
  category_name: string;
  images: { image_url: string; position: number }[];
}

interface Category {
  id: string;
  name: string;
}

interface Branch {
  id: string;
  name: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { addItem, count } = useCart();
  const { activeBranch } = useBranch();
  const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const initialCategory = searchParams?.get("category");

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const urlBase = activeBranch ? `?branch=${activeBranch.id}` : "";
        const [prods, cats, brs] = await Promise.all([
          api.get(`/products/${urlBase}`),
          api.get("/categories/"),
          api.get("/branches/"),
        ]);
        setProducts(prods);
        setCategories(cats);
        setBranches(brs);
      } catch (error) {
        toast.error("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [activeBranch]);

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = !selectedCategory || p.category_name === selectedCategory;
    // Removed matchBranch because it is now handled server-side
    return matchSearch && matchCategory;
  });

  const Skeleton = () => (
    <div className="group cursor-pointer">
      <div className="aspect-[3/4] bg-gray-100 rounded-2xl animate-pulse mb-4" />
      <div className="space-y-2 px-1">
        <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
        <div className="h-4 bg-gray-100 rounded animate-pulse w-1/3" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center transition-transform group-hover:scale-110">
              <ArrowLeft className="text-white w-5 h-5" />
            </div>
            <span className="hidden sm:block text-sm font-black tracking-tight text-gray-500 group-hover:text-black transition-colors">HOME</span>
          </Link>

          <div className="flex-1 max-w-xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full h-11 pl-11 pr-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-sm text-gray-900"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setFiltersOpen(!filtersOpen)} className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 text-gray-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-50 hover:text-indigo-600 transition-all">
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:block">Filter</span>
            </button>
            <Link href="/cart" className="relative p-2 text-gray-400 hover:text-black transition-colors">
              <ShoppingBag className="w-6 h-6" />
              {count > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-black text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">{count}</span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          {/* Active filters */}
          {(selectedCategory || selectedBranch) && (
            <div className="flex items-center gap-2 mb-6 flex-wrap">
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Filters:</span>
              {selectedCategory && (
                <button onClick={() => setSelectedCategory(null)} className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-black">
                  {selectedCategory} <X className="w-3 h-3" />
                </button>
              )}
              {selectedBranch && (
                <button onClick={() => setSelectedBranch(null)} className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-black">
                  {selectedBranch} <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          {/* Filter panel */}
          {filtersOpen && (
            <div className="mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-100 animate-in slide-in-from-top-2 duration-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Category</p>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((c) => (
                      <button key={c.id} onClick={() => setSelectedCategory(selectedCategory === c.name ? null : c.name)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${selectedCategory === c.name ? "bg-indigo-600 text-white" : "bg-white text-gray-600 border border-gray-100 hover:border-indigo-300"}`}>
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Branch</p>
                  <div className="flex flex-wrap gap-2">
                    {branches.map((b) => (
                      <button key={b.id} onClick={() => setSelectedBranch(selectedBranch === b.name ? null : b.name)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${selectedBranch === b.name ? "bg-indigo-600 text-white" : "bg-white text-gray-600 border border-gray-100 hover:border-indigo-300"}`}>
                        {b.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-baseline justify-between mb-8">
            <h1 className="text-3xl font-black text-black tracking-tighter">ALL PRODUCTS</h1>
            <p className="text-sm font-bold text-gray-400">{filtered.length} items</p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => <Skeleton key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-32 flex flex-col items-center gap-4 text-center">
              <Package className="w-16 h-16 text-gray-200" />
              <p className="text-xl font-black text-gray-400">No products found</p>
              <button onClick={() => { setSearchQuery(""); setSelectedCategory(null); setSelectedBranch(null); }} className="text-indigo-600 font-bold text-sm hover:underline">Clear filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {filtered.map((p) => (
                <div key={p.id} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm hover:shadow-2xl transition-all group flex flex-col h-full">
                  <div className="aspect-[3/4] bg-gray-50 rounded-2xl overflow-hidden mb-6 relative border border-gray-50 flex-shrink-0">
                    <Link href={`/products/${p.id}`} className="block w-full h-full">
                      {p.images && p.images.length > 0 ? (
                        <img 
                          src={p.images[0].image_url} 
                          alt={p.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-12 h-12 text-gray-200" />
                        </div>
                      )}
                    </Link>
                    
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                       <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-xl text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
                          <MapPin className="w-3 h-3" />
                          {p.branch_name}
                       </div>
                       {p.discount_percentage ? (
                         <div className="w-fit px-3 py-1.5 bg-indigo-600 text-white text-[10px] font-black rounded-xl shadow-lg animate-pulse">
                           -{p.discount_percentage}% OFF
                         </div>
                       ) : p.original_price && (
                         <div className="w-fit px-3 py-1.5 bg-indigo-600 text-white text-[10px] font-black rounded-xl shadow-lg">
                           SALE
                         </div>
                       )}
                    </div>

                    <button 
                      onClick={() => addItem({ ...p, image: p.images?.[0]?.image_url })}
                      className="absolute bottom-4 right-4 w-12 h-12 bg-white text-black rounded-2xl shadow-2xl hover:bg-black hover:text-white transition-all transform active:scale-95 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                    >
                      <ShoppingBag className="w-6 h-6" />
                    </button>
                    {p.stock === 0 && (
                      <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                        <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Out of Stock</span>
                      </div>
                    )}
                  </div>
                  <Link href={`/products/${p.id}`} className="block px-1 space-y-2 mt-auto">
                    <h4 className="font-bold text-sm text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1 truncate uppercase tracking-tight">{p.name}</h4>
                    <div className="flex items-end justify-between">
                      <div className="space-y-1">
                        <p className="text-black font-black text-lg leading-none">Ksh {Number(p.price).toLocaleString()}</p>
                        {p.original_price && (
                          <p className="text-[11px] text-gray-400 font-bold line-through">Ksh {Number(p.original_price).toLocaleString()}</p>
                        )}
                      </div>
                      {p.category_name && (
                        <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-widest">{p.category_name}</span>
                      )}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
