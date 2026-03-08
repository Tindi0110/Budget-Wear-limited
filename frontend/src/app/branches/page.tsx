"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Phone, Clock, ShoppingBag, Loader2, Package } from "lucide-react";
import { api } from "@/lib/api";
import { useCart } from "@/lib/CartContext";

interface Branch {
  id: string;
  name: string;
  location?: string;
  phone?: string;
  opening_hours?: string;
  branch_type?: string;
}

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { count } = useCart();

  useEffect(() => {
    api.get("/branches/")
      .then(setBranches)
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center transition-transform group-hover:scale-110">
              <ArrowLeft className="text-white w-6 h-6" />
            </div>
            <span className="text-sm font-black tracking-tight text-gray-500 group-hover:text-black transition-colors">BACK HOME</span>
          </Link>
          <span className="text-2xl font-black tracking-tighter text-black uppercase">OUR BRANCHES</span>
          <Link href="/cart" className="relative p-2 text-gray-400 hover:text-black transition-colors">
            <ShoppingBag className="w-6 h-6" />
            {count > 0 && (
              <span className="absolute top-0 right-0 w-5 h-5 bg-indigo-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-in zoom-in-50 duration-300">{count}</span>
            )}
          </Link>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto space-y-12 text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black text-black tracking-tighter">FIND A STORE <br/> <span className="text-indigo-600">NEAR YOU.</span></h1>
          <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto">
            Visit any of our physical locations for personalized service and to explore our full Ex-UK collection in person.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
          </div>
        ) : branches.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <Package className="w-16 h-16 text-gray-200 mx-auto" />
            <p className="font-black text-gray-400">No branches found yet.</p>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {branches.map((branch) => (
              <div key={branch.id} className="bg-white p-8 rounded-[3rem] shadow-xl shadow-gray-200/50 border border-gray-100 group hover:-translate-y-2 transition-all duration-500">
                <div className="flex justify-between items-start mb-10">
                  <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg transition-transform group-hover:rotate-12">
                     {branch.name[0]}
                  </div>
                  <div className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${branch.branch_type === 'BABY_SHOP' ? 'bg-pink-100 text-pink-600' : 'bg-indigo-100 text-indigo-600'}`}>
                    {branch.branch_type?.replace('_', ' ') || 'STORE'}
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">{branch.name}</h3>
                    <div className="flex items-center gap-2 text-gray-500 font-medium">
                      <MapPin className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                      <span className="line-clamp-1">{branch.location || "Location not provided"}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 pt-6 border-t border-gray-50">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <Clock className="w-3 h-3" />
                        Hours
                      </div>
                      <p className="text-sm font-bold text-gray-900">{branch.opening_hours || "08:00 AM - 07:00 PM"}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <Phone className="w-3 h-3" />
                        Contact
                      </div>
                      <p className="text-sm font-bold text-gray-900">{branch.phone || "+254 700 000 000"}</p>
                    </div>
                  </div>

                  <Link href={`/products?branch=${branch.name}`} className="block w-full py-4 bg-gray-50 text-center rounded-2xl font-black text-xs hover:bg-black hover:text-white transition-all uppercase tracking-widest">
                    VIEW PRODUCTS
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
