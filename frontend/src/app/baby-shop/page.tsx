"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ShoppingBag, 
  Search, 
  ArrowLeft, 
  Star, 
  Baby,
  Heart,
  Filter,
  Package,
  Loader2
} from "lucide-react";
import { api } from "@/lib/api";
import { useCart } from "@/lib/CartContext";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  price: number;
  category_name?: string;
  images?: Array<{ image_url: string }>;
  branch_name?: string;
}

export default function BabyShop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addItem, count } = useCart();

  useEffect(() => {
    const loadBabyProducts = async () => {
      try {
        setIsLoading(true);
        // Assuming 'Kids' or 'Baby' is a category name or handled via filtering
        const allProducts = await api.get("/products/");
        const babyProds = allProducts.filter((p: Product) => 
          (p.category_name?.toLowerCase() === "kids") || 
          (p.category_name?.toLowerCase() === "baby")
        );
        setProducts(babyProds);
      } catch (err) {
        console.error("Failed to load baby shop products", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadBabyProducts();
  }, []);

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
            <Baby className="w-6 h-6 text-pink-600" />
            <span className="text-2xl font-black tracking-tighter text-black uppercase">THE BABY SHOP</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/cart" className="relative p-2 text-gray-400 hover:text-pink-600 transition-colors">
              <ShoppingBag className="w-6 h-6" />
              {count > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-pink-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-in zoom-in-50 duration-300">{count}</span>
              )}
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
              <p className="text-lg text-gray-600 font-medium font-bold">
                Quality Ex-UK wear for your little ones. Curated for comfort and style.
              </p>
            </div>
            <div className="absolute right-0 top-0 h-full w-1/2 hidden md:block">
              <img 
                src="https://images.unsplash.com/photo-1515488764276-beab7607c1e6?q=80&w=2070&auto=format&fit=crop" 
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
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Quick Link</p>
                <Link href="/products?category=kids" className="block text-sm font-bold text-gray-500 hover:text-pink-600 transition-colors uppercase">All Kids Collection</Link>
                <Link href="/categories" className="block text-sm font-bold text-gray-500 hover:text-pink-600 transition-colors uppercase">View Categories</Link>
              </div>

              <hr className="border-gray-50 my-8" />

              <div className="p-6 bg-pink-600 rounded-3xl text-white shadow-xl shadow-pink-100 relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-80 mb-2">Member Perk</p>
                  <h4 className="text-sm font-black mb-4 uppercase leading-tight">Fast same-day delivery on all orders!</h4>
                  <button className="w-full py-3 bg-white text-pink-600 rounded-xl font-black text-xs">JOIN NOW</button>
                </div>
                <Baby className="absolute -bottom-4 -right-4 w-20 h-20 text-white/10 rotate-12" />
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1 space-y-12">
            <div className="flex items-baseline justify-between">
              <h2 className="text-3xl font-black text-black tracking-tighter">LATEST DROPS</h2>
              <p className="text-xs font-bold text-gray-400">{products.length} Items Found</p>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 text-pink-600 animate-spin" />
              </div>
            ) : products.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <Package className="w-16 h-16 text-pink-100 mx-auto" />
                <p className="font-black text-gray-400">No baby products available right now.</p>
                <Link href="/products" className="text-pink-600 font-bold hover:underline">Browse Main Shop</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((p) => (
                  <div key={p.id} className="group cursor-pointer">
                    <div className="aspect-[3/4] bg-gray-50 rounded-[2.5rem] overflow-hidden mb-6 relative shadow-sm transition-all duration-500 hover:shadow-xl hover:shadow-pink-50">
                      {p.images && p.images[0] ? (
                        <img src={p.images[0].image_url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={p.name} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-12 h-12 text-pink-100" />
                        </div>
                      )}
                      <button 
                        onClick={() => addItem({ 
                          id: p.id, 
                          name: p.name, 
                          price: p.price, 
                          image: p.images?.[0]?.image_url,
                          branch_name: p.branch_name,
                          category_name: p.category_name
                        })}
                        className="absolute top-6 right-6 p-3 bg-white/80 backdrop-blur-md rounded-2xl opacity-0 group-hover:opacity-100 transition-all hover:bg-white scale-90 group-hover:scale-100 shadow-xl"
                      >
                        <ShoppingBag className="w-5 h-5 text-pink-600" />
                      </button>
                      <div className="absolute top-6 left-6 flex items-center gap-1.5 px-3 py-1.5 bg-pink-100 text-pink-700 rounded-xl text-[10px] font-black shadow-sm uppercase">
                        {p.category_name || "Baby Shop"}
                      </div>
                    </div>
                    <Link href={`/products/${p.id}`} className="px-2 space-y-1 block">
                      <h4 className="font-black text-lg text-black group-hover:text-pink-600 transition-colors uppercase tracking-tight line-clamp-1">{p.name}</h4>
                      <div className="flex items-center justify-between">
                        <p className="text-pink-600 font-black text-lg">Ksh {p.price.toLocaleString()}</p>
                        <div className="flex items-center gap-1.5">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-gray-400 text-xs font-black">5.0</span>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Trust Badges */}
      <section className="py-20 bg-gray-50 border-y border-gray-100">
         <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { label: "PREMIUM EX-UK", desc: "Highest Quality Handpicked", icon: <Star /> },
              { label: "SAFE & GENTLE", desc: "Sustainable & Soft", icon: <Baby /> },
              { label: "FAST DELIVERY", desc: "Same Day Within Kenya", icon: <ShoppingBag /> },
              { label: "EASY RETURNS", desc: "7-Day Satisfaction Policy", icon: <Heart /> },
            ].map((badge, i) => (
              <div key={i} className="flex flex-col items-center text-center space-y-4">
                 <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-pink-600 shadow-sm transition-transform hover:scale-110">
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
