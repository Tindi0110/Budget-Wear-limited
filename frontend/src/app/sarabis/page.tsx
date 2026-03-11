"use client";

import { useState, useEffect } from "react";
import { 
  Heart, 
  Baby, 
  MapPin, 
  ChevronRight, 
  Star, 
  Zap, 
  ShoppingBag, 
  Clock,
  ArrowRight,
  Flame,
  Package
} from "lucide-react";
import { useRef } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useCart } from "@/lib/CartContext";
import Header from "@/components/Header";

interface Branch {
  id: string;
  name: string;
  location: string;
  map_url?: string;
  type: string;
}

interface Advert {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  link?: string;
  is_active: boolean;
}

interface FlashSale {
  id: string;
  title: string;
  end_time: string;
  products: string[]; // List of product IDs
  is_active: boolean;
}

interface Product {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  images?: Array<{ image_url: string }>;
}

export default function SarabisPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [adverts, setAdverts] = useState<Advert[]>([]);
  const [flashSales, setFlashSales] = useState<FlashSale[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { addItem } = useCart();
  const flashScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [branchData, productData, advertData, flashSaleData] = await Promise.all([
          api.get("/branches/"),
          api.get("/products?category=Baby Shop"),
          api.get("/adverts/"),
          api.get("/flash-sales/")
        ]);
        setBranches(branchData.filter((b: Branch) => b.type === 'baby_shop'));
        setProducts(productData.slice(0, 8));
        setAdverts(advertData.filter((a: Advert) => a.is_active));
        setFlashSales(flashSaleData);
      } catch (error) {
        console.error("Failed to load Sarabis data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (adverts.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % adverts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [adverts.length]);

  const activeFlashSale = flashSales.find(fs => fs.is_active);
  // Optional: In a real app we might filter baby-shop specific flash sales
  const flashSaleProducts = activeFlashSale 
    ? products.filter(p => activeFlashSale.products.includes(p.id)) 
    : [];

  return (
    <div className="min-h-screen bg-[#fff5f7]">
      <Header theme="pink" />

      <main className="pt-32 pb-20">
        {/* Baby Shop Hero & Advert Carousel */}
        <section className="max-w-7xl mx-auto px-4">
           {adverts.length > 0 ? (
             <div className="relative bg-black rounded-[4rem] overflow-hidden h-[500px] md:h-[600px] shadow-2xl flex items-center group">
               {adverts.map((ad, index) => (
                 <div 
                   key={ad.id}
                   className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentAdIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                 >
                   <img src={ad.image_url} alt={ad.title} className="w-full h-full object-cover" />
                   <div className="absolute inset-0 bg-gradient-to-r from-pink-900/90 via-pink-900/50 to-transparent flex items-center p-12 md:p-24">
                     <div className="max-w-2xl space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/20 text-pink-300 rounded-full text-xs font-black uppercase tracking-[0.2em] backdrop-blur-md border border-pink-500/30">
                           <Zap className="w-4 h-4 fill-current text-pink-400" /> Limited Time
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tighter uppercase">
                          {ad.title}
                        </h2>
                        {ad.description && <p className="text-xl text-pink-100/90 font-medium leading-relaxed max-w-xl">{ad.description}</p>}
                        {ad.link && (
                          <Link href={ad.link} className="inline-flex items-center gap-4 bg-white text-pink-600 px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-pink-50 transition-all active:scale-95 shadow-xl shadow-pink-500/20 mt-8">
                             SHOP CAMPAIGN <ArrowRight className="w-5 h-5" />
                          </Link>
                        )}
                     </div>
                   </div>
                 </div>
               ))}
               {adverts.length > 1 && (
                 <div className="absolute bottom-10 left-12 md:left-24 z-20 flex gap-3">
                    {adverts.map((_, i) => (
                      <button 
                        key={i} 
                        onClick={() => setCurrentAdIndex(i)}
                        className={`w-2 h-2 rounded-full transition-all ${i === currentAdIndex ? 'bg-pink-500 w-8' : 'bg-white/40'}`}
                      />
                    ))}
                 </div>
               )}
            </div>
           ) : (
             <div className="relative bg-white rounded-[4rem] overflow-hidden p-12 md:p-24 shadow-2xl shadow-pink-100 border border-pink-50">
                <div className="absolute top-0 right-0 w-full md:w-1/2 h-full bg-pink-50/50 -skew-x-12 translate-x-1/4" />
                <div className="relative z-10 max-w-xl space-y-8">
                   <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-100 text-pink-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                      <Heart className="w-3.5 h-3.5 fill-current" /> Made with Love
                   </div>
                   <h1 className="text-6xl md:text-7xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                      Gentle Care <br /> For Your <span className="text-pink-500">Little Stars</span>
                   </h1>
                   <p className="text-xl text-gray-400 font-medium">
                      Premium Ex-UK baby clothes, essentials, and accessories. Curated for safety, comfort, and unmatched style.
                   </p>
                   <Link href="/products?category=Baby Shop" className="inline-flex items-center gap-4 bg-pink-500 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-pink-600 transition-all shadow-xl shadow-pink-200">
                      EXPLORE COLLECTION <ChevronRight className="w-4 h-4" />
                   </Link>
                </div>
                <Baby className="absolute bottom-12 right-12 w-64 h-64 text-pink-100/30 -rotate-12 hidden lg:block" />
             </div>
           )}
        </section>

        {/* Baby Shop Flash Sales */}
        {activeFlashSale && flashSaleProducts.length > 0 && (
          <section className="mt-16 max-w-7xl mx-auto px-4">
             <div className="bg-white rounded-[3rem] overflow-hidden border border-pink-100 shadow-2xl shadow-pink-50/20">
                 <div className="bg-pink-500 px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-3">
                         <Zap className="w-6 h-6 text-white fill-current" />
                         <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter">Flash Sales</h2>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="flex items-center gap-2 mr-4">
                          <button 
                            onClick={() => flashScrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' })}
                            className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all"
                          >
                             <ChevronRight className="w-4 h-4 rotate-180" />
                          </button>
                          <button 
                            onClick={() => flashScrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' })}
                            className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all"
                          >
                             <ChevronRight className="w-4 h-4" />
                          </button>
                       </div>
                       <Link href="/products?category=Baby Shop" className="text-sm font-black text-white hover:underline flex items-center gap-2">
                          SEE ALL <ChevronRight className="w-4 h-4" />
                       </Link>
                    </div>
                 </div>
                
                 <div className="p-8 overflow-x-auto custom-scrollbar" ref={flashScrollRef}>
                   <div className="flex gap-6 pb-4">
                      {flashSaleProducts.map((p) => {
                        const discount = p.original_price ? Math.round(((p.original_price - p.price) / p.original_price) * 100) : null;
                        return (
                         <div key={p.id} className="min-w-[200px] w-[200px] group cursor-pointer">
                            <div className="aspect-square bg-pink-50/30 rounded-2xl overflow-hidden mb-4 relative shadow-sm border border-pink-50">
                              {p.images?.[0] ? (
                                <img src={p.images[0].image_url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={p.name} />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center"><Baby className="w-10 h-10 text-pink-200" /></div>
                              )}
                              {discount && (
                                <div className="absolute top-2 right-2 bg-pink-100 text-pink-600 px-2 py-1 rounded-lg text-[10px] font-black">
                                  -{discount}%
                                </div>
                              )}
                            </div>
                            <div className="space-y-1">
                               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest line-clamp-1">{p.name}</p>
                               <div className="flex items-center gap-2">
                                 <p className="text-pink-500 font-black text-lg">Ksh {p.price.toLocaleString()}</p>
                                 {p.original_price && <p className="text-gray-300 font-bold text-xs line-through">Ksh {p.original_price.toLocaleString()}</p>}
                               </div>
                            </div>
                         </div>
                        );
                      })}
                   </div>
                 </div>
             </div>
          </section>
        )}

        {/* Sarabis Specific Branches */}
        <section className="mt-24 max-w-7xl mx-auto px-4 space-y-12">
           <div className="flex items-end justify-between">
              <div className="space-y-1">
                 <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">Our Baby Shop Branches</h2>
                 <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Find a location near you</p>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {isLoading ? (
                Array(3).fill(0).map((_, i) => <div key={i} className="h-64 bg-white rounded-[3rem] animate-pulse" />)
              ) : branches.length > 0 ? branches.map((branch) => (
                <div key={branch.id} className="bg-white p-8 rounded-[3rem] border border-pink-50 shadow-sm hover:shadow-xl transition-all group">
                   <div className="flex items-center justify-between mb-8">
                      <div className="w-14 h-14 bg-pink-50 text-pink-500 rounded-2xl flex items-center justify-center">
                         <MapPin className="w-7 h-7" />
                      </div>
                      <Link href={`/contact?branch=${branch.id}`} className="text-[10px] font-black text-pink-400 uppercase tracking-widest hover:text-pink-600">Directions</Link>
                   </div>
                   <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-2">{branch.name}</h3>
                   <div className="flex items-center gap-2 text-gray-400 text-sm font-bold mb-8">
                      <Clock className="w-4 h-4" /> 8:00 AM - 7:00 PM
                   </div>
                   {branch.map_url && (
                     <div className="aspect-video rounded-2xl overflow-hidden mb-6 bg-pink-50 border border-pink-50">
                        <iframe 
                          src={branch.map_url} 
                          className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-700"
                          loading="lazy"
                        ></iframe>
                     </div>
                   )}
                   <Link href="/products?category=Baby Shop" className="flex items-center justify-center gap-2 w-full py-4 bg-gray-50 text-gray-600 rounded-2xl font-black text-xs uppercase tracking-widest group-hover:bg-pink-500 group-hover:text-white transition-all">
                      Visit This Branch <ArrowRight className="w-4 h-4" />
                   </Link>
                </div>
              )) : (
                <div className="col-span-full py-20 text-center text-gray-400 font-bold uppercase tracking-widest">No standalone Baby Shop branches found yet.</div>
              )}
           </div>
        </section>

        {/* Featured Products */}
        <section className="mt-24 max-w-7xl mx-auto px-4 space-y-12">
           <div className="flex items-center justify-between">
              <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none">Sweet <span className="text-pink-500">Picks</span> For You</h2>
              <Link href="/products?category=Baby Shop" className="text-sm font-black text-pink-500 hover:underline">VIEW ALL</Link>
           </div>
           
           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {products.map((p) => (
                <div key={p.id} className="bg-white p-4 rounded-[2rem] border border-pink-50 shadow-sm hover:shadow-xl transition-all group">
                   <div className="aspect-square bg-pink-50/30 rounded-2xl overflow-hidden mb-4 relative">
                      {p.images?.[0] ? (
                        <img src={p.images[0].image_url} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={p.name} />
                      ) : (
                        <Baby className="w-12 h-12 text-pink-100 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                      )}
                      <button 
                         onClick={() => addItem({ ...p, image: p.images?.[0]?.image_url })}
                         className="absolute bottom-3 right-3 p-3 bg-white text-pink-500 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all"
                      >
                         <ShoppingBag className="w-5 h-5" />
                      </button>
                   </div>
                   <div className="space-y-1 text-center">
                      <h4 className="font-bold text-xs text-gray-900 uppercase tracking-tight line-clamp-1">{p.name}</h4>
                      <p className="text-pink-500 font-black text-lg">Ksh {p.price.toLocaleString()}</p>
                   </div>
                </div>
              ))}
           </div>
        </section>
      </main>

      <footer className="py-24 bg-white border-t border-pink-100 text-center space-y-8">
         <div className="flex flex-col items-center gap-4">
            <Baby className="w-12 h-12 text-pink-500" />
            <p className="text-2xl font-black tracking-tighter uppercase text-gray-900">Sarabis Baby Shop</p>
         </div>
         <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Part of the Budget Wear Limited Family. Premium Care, Budget Prices.</p>
      </footer>
    </div>
  );
}
