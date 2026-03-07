"use client";

import Link from "next/link";
import { 
  Heart, 
  Trash2, 
  ShoppingBag, 
  ArrowRight,
  Package 
} from "lucide-react";

const wishlistItems = [
  { id: "1", name: "Premium Denim Jacket", price: 2500, branch: "Nairobi", image: "https://placehold.co/200x200/png" },
  { id: "2", name: "Nike Air Sneakers", price: 3200, branch: "Nakuru", image: "https://placehold.co/200x200/png" },
];

export default function WishlistPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h1 className="text-4xl font-black text-gray-900 mb-10 flex items-center gap-4">
        Your Wishlist <Heart className="w-8 h-8 text-red-500 fill-red-500" />
      </h1>

      {wishlistItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {wishlistItems.map((item) => (
            <div key={item.id} className="group bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl transition-all">
              <div className="aspect-[4/5] relative">
                <img src={item.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <button className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-md rounded-full text-red-500 hover:bg-red-50 transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6">
                 <h3 className="font-bold text-gray-900 line-clamp-1">{item.name}</h3>
                 <p className="text-indigo-600 font-black mt-1">Ksh {item.price.toLocaleString()}</p>
                 <button className="w-full mt-6 bg-black text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all">
                   <ShoppingBag className="w-4 h-4" />
                   Add to Cart
                 </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
           <Package className="w-16 h-16 text-gray-300 mx-auto mb-6" />
           <p className="text-xl font-bold text-gray-900">Your wishlist is empty</p>
           <p className="text-gray-500 mt-2 mb-8">Start adding items you love to see them here!</p>
           <Link href="/products" className="inline-flex items-center gap-2 px-8 py-3 bg-black text-white rounded-xl font-bold hover:bg-indigo-600 transition-all">
             Start Shopping
             <ArrowRight className="w-4 h-4" />
           </Link>
        </div>
      )}
    </div>
  );
}
