"use client";

import Link from "next/link";
import { ArrowLeft, Tag, ShoppingBag, ArrowRight, Folder } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useCart } from "@/lib/CartContext";

interface Category {
  id: string;
  name: string;
  icon?: string;
}

const COLORS = [
  "from-indigo-500 to-indigo-700",
  "from-pink-500 to-rose-600",
  "from-orange-400 to-orange-600",
  "from-slate-700 to-slate-900",
  "from-violet-500 to-purple-700",
  "from-teal-500 to-teal-700",
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { count } = useCart();

  useEffect(() => {
    api.get("/categories/")
      .then(setCategories)
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

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
            {count > 0 && (
              <span className="absolute top-0 right-0 w-5 h-5 bg-black text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">{count}</span>
            )}
          </Link>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                <Tag className="w-4 h-4" /> Find your fit
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-black tracking-tighter">
                SHOP BY <br /> <span className="text-indigo-600">CATEGORY.</span>
              </h1>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="aspect-[4/5] rounded-[3rem] bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="py-24 text-center">
              <Folder className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400 font-black">No categories found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((cat, i) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.name}`}
                  className="group relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl transition-all duration-700 hover:-translate-y-4"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${COLORS[i % COLORS.length]}`} />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />

                  <div className="absolute inset-0 p-12 flex flex-col justify-end">
                    <div className="space-y-2 transform transition-transform duration-500 group-hover:-translate-y-2">
                      <p className="text-sm font-black text-white/60 uppercase tracking-[0.3em]">Browse Collection</p>
                      <h3 className="text-4xl font-black text-white uppercase tracking-tighter">{cat.name}</h3>
                    </div>

                    <div className="mt-8 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                      <div className="bg-white text-black px-6 py-3 rounded-2xl font-black text-xs flex items-center gap-2">
                        EXPLORE NOW <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
