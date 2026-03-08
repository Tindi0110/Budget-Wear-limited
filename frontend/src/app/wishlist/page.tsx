"use client";

import Link from "next/link";
import { Heart, Trash2, ShoppingBag, ArrowRight, Package } from "lucide-react";
import { useCart } from "@/lib/CartContext";

// Wishlist is stored in cart context — items in cart can be "wishlisted"
// We treat the wishlist as a separate localStorage store
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface WishItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  branch_name?: string;
  category_name?: string;
}

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishItem[]>([]);
  const { addItem } = useCart();

  useEffect(() => {
    try {
      const saved = localStorage.getItem("wishlist");
      if (saved) setWishlist(JSON.parse(saved));
    } catch {}
  }, []);

  const removeFromWishlist = (id: string) => {
    const updated = wishlist.filter((w) => w.id !== id);
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
    toast.success("Removed from wishlist");
  };

  const moveToCart = (item: WishItem) => {
    addItem({ id: item.id, name: item.name, price: item.price, image: item.image, branch_name: item.branch_name, category_name: item.category_name });
    removeFromWishlist(item.id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h1 className="text-4xl font-black text-gray-900 mb-10 flex items-center gap-4">
        Your Wishlist <Heart className="w-8 h-8 text-red-500 fill-red-500" />
      </h1>

      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {wishlist.map((item) => (
            <div key={item.id} className="group bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl transition-all">
              <div className="aspect-[4/5] relative bg-gray-50">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-12 h-12 text-gray-200" />
                  </div>
                )}
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-md rounded-full text-red-400 hover:text-red-600 hover:bg-red-50 transition-all shadow-sm"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="p-5">
                <h3 className="font-black text-gray-900 line-clamp-1 text-sm">{item.name}</h3>
                {item.category_name && <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{item.category_name}</p>}
                <p className="text-indigo-600 font-black mt-2">Ksh {item.price.toLocaleString()}</p>
                <button
                  onClick={() => moveToCart(item)}
                  className="w-full mt-5 bg-black text-white py-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all uppercase tracking-widest active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Heart className="w-10 h-10 text-gray-200" />
          </div>
          <p className="text-xl font-black text-gray-900">Your wishlist is empty</p>
          <p className="text-gray-500 mt-2 mb-8 font-medium">Save items you love to find them here later.</p>
          <Link href="/products" className="inline-flex items-center gap-2 px-8 py-3 bg-black text-white rounded-xl font-black hover:bg-indigo-600 transition-all uppercase tracking-widest text-sm active:scale-95">
            Browse Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
