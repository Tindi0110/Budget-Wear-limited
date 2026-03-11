"use client";

import { useState, useEffect } from "react";
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
  Heart,
  Baby,
  Flame,
  Globe,
  Loader2,
  ChevronRight,
  Clock,
  X
} from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { api } from "@/lib/api";
import { toast } from "sonner";
import CountdownTimer from "@/components/CountdownTimer";

interface Product {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  discount_percentage?: number;
  branch_name?: string;
  category_name?: string;
  images?: Array<{ image_url: string }>;
  stock?: number;
}

interface Category {
  id: string;
  name: string;
  image?: string;
  subcategories?: string[]; // Flyout support
}

interface Advert {
  id: string;
  title: string;
  description: string;
  image: string;
  link?: string;
  is_active: boolean;
}

interface Branch {
  id: string;
  name: string;
  location?: string;
}

interface FlashSaleProp {
  id: string;
  title: string;
  end_time: string;
  products: Product[];
}

export default function Home() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { addItem, count } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [adverts, setAdverts] = useState<Advert[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [flashSales, setFlashSales] = useState<FlashSaleProp[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [prodData, catData, advData, branchData, flashData] = await Promise.all([
          api.get("/products/"),
          api.get("/categories/"),
          api.get("/adverts/"),
          api.get("/branches/"),
          api.get("/flash-sales/").catch(() => []) // Graceful fail if migration not run
        ]);
        setProducts(prodData);
        setCategories(catData);
        setAdverts(advData.filter((a: Advert) => a.is_active));
        setBranches(branchData);
        setFlashSales(flashData);
      } catch (err) {
        console.error("Failed to load home data", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const searchResults = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.category_name?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  ).slice(0, 5);

  const featuredAd = adverts[0];
  const featuredProducts = products.slice(0, 10);
  const activeFlashSale = flashSales[0];

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-[100] bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105">
              <span className="text-white font-black text-xl">B</span>
            </div>
            <span className="text-2xl font-black tracking-tighter text-black">BUDGET WEAR</span>
          </Link>

          {/* Search Bar Professional */}
          <div className="hidden lg:flex flex-1 max-w-xl mx-8 relative">
             <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search products, categories, brands..." 
                  className="w-full h-11 pl-11 pr-4 bg-gray-50 border border-gray-200 rounded-full text-sm font-medium focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none"
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
                      <Link key={res.id} href={`/products/${res.id}`} className="flex gap-4 p-2 hover:bg-gray-50 rounded-2xl transition-colors group">
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

          <div className="flex items-center gap-6">
            <Link href="/products" className="hidden md:block text-xs font-black text-gray-500 hover:text-indigo-600 transition-colors uppercase tracking-widest">Shop All</Link>
            
            <div className="flex items-center gap-4">
              <Link href="/wishlist" className="p-2 text-gray-400 hover:text-red-500 transition-colors hidden sm:block">
                <Heart className="w-6 h-6" />
              </Link>

              <Link href="/cart" className="relative p-2 text-gray-400 hover:text-black transition-colors">
                <ShoppingBag className="w-6 h-6" />
                {count > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-indigo-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-bounce">{count}</span>
                )}
              </Link>
               <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
               >
                 <Menu className="w-6 h-6 text-black" />
               </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[200] lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
          <div className="absolute top-0 left-0 bottom-0 w-[80%] max-w-sm bg-white shadow-2xl animate-in slide-in-from-left duration-500 flex flex-col">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-black text-sm">B</span>
                  </div>
                  <span className="text-lg font-black tracking-tighter">BUDGET WEAR</span>
               </div>
               <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-all">
                  <X className="w-5 h-5 text-gray-400" />
               </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-3 mb-2">Navigation</p>
               <Link href="/" className="flex items-center gap-3 p-3 rounded-2xl bg-indigo-50 text-indigo-700 font-bold text-sm">
                  <TrendingUp className="w-5 h-5" /> Home
               </Link>
               <Link href="/products" className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 text-gray-600 font-bold text-sm transition-all">
                  <ShoppingBag className="w-5 h-5" /> Shop All
               </Link>
               <Link href="/branches" className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 text-gray-600 font-bold text-sm transition-all">
                  <MapPin className="w-5 h-5" /> Branches
               </Link>

               <div className="pt-6">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-3 mb-4">Categories</p>
                  <div className="space-y-1">
                    {categories.map(cat => (
                      <Link key={cat.id} href={`/products?category=${cat.name}`} className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 text-gray-600 text-sm font-bold transition-all group">
                        <span className="uppercase tracking-tight">{cat.name}</span>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-600" />
                      </Link>
                    ))}
                  </div>
               </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50/50">
               <Link href="/admin" className="flex items-center justify-center gap-2 w-full py-4 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all">
                  Admin Dashboard
               </Link>
            </div>
          </div>
        </div>
      )}
      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
        </div>
      ) : (
        <>
          <div className="pt-24 pb-20 max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Jumia Style Sidebar Mega-Menu */}
              <aside className="hidden lg:col-span-3 lg:block">
                <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
                   <div className="p-4 bg-gray-50 border-b border-gray-100">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2 flex items-center gap-2">
                        <Menu className="w-3 h-3" /> Categories
                      </p>
                   </div>
                   <div className="relative">
                      <nav className="p-2">
                        {categories.map((cat) => (
                          <div 
                            key={cat.id}
                            onMouseEnter={() => setActiveCategory(cat.id)}
                            onMouseLeave={() => setActiveCategory(null)}
                            className="relative"
                          >
                            <Link 
                              href={`/products?category=${cat.name}`} 
                              className={`flex items-center justify-between p-3 rounded-2xl transition-all group ${activeCategory === cat.id ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:bg-gray-50 hover:text-black'}`}
                            >
                              <div className="flex items-center gap-3">
                                 <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${activeCategory === cat.id ? 'bg-white shadow-sm' : 'bg-gray-100'}`}>
                                    <Package className="w-4 h-4" />
                                 </div>
                                 <span className="text-sm font-bold uppercase tracking-tight">{cat.name}</span>
                              </div>
                              <ChevronRight className={`w-4 h-4 opacity-0 transition-all ${activeCategory === cat.id ? 'opacity-100 translate-x-0' : 'group-hover:opacity-40 -translate-x-2'}`} />
                            </Link>

                            {/* Flyout (Mega-Menu) */}
                            {activeCategory === cat.id && (
                              <div className="absolute left-full top-0 ml-1 w-[400px] h-[400px] bg-white border border-gray-100 shadow-2xl rounded-3xl z-[200] p-8 animate-in slide-in-from-left-2 duration-200">
                                 <h4 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight">{cat.name} Collection</h4>
                                 <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Popular</p>
                                       <ul className="space-y-2">
                                          <li><Link href={`/products?category=${cat.name}&tag=new`} className="text-sm font-bold text-gray-500 hover:text-indigo-600">New Arrivals</Link></li>
                                          <li><Link href={`/products?category=${cat.name}&tag=bestsellers`} className="text-sm font-bold text-gray-500 hover:text-indigo-600">Best Sellers</Link></li>
                                       </ul>
                                    </div>
                                    <div className="space-y-4">
                                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Special Offers</p>
                                       <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
                                          <p className="text-xs font-black text-orange-700">FLASH SALE</p>
                                          <p className="text-[10px] text-orange-600 font-bold">Up to 30% OFF</p>
                                       </div>
                                    </div>
                                 </div>
                                 <div className="absolute bottom-8 right-8">
                                    <Link href={`/products?category=${cat.name}`} className="flex items-center gap-2 text-xs font-black text-indigo-600 hover:underline">
                                       EXPLORE ALL <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                 </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </nav>
                   </div>
                </div>
              </aside>

              {/* Central Hero + Adverts */}
              <div className="lg:col-span-9 space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-3">
                       {/* Main Slider */}
                       {featuredAd && (
                         <div className="relative w-full aspect-[21/9] md:aspect-auto md:h-[400px] bg-black rounded-3xl overflow-hidden group shadow-2xl">
                           <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
                           <img src={featuredAd.image} className="w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-105" alt={featuredAd.title} />
                           <div className="absolute inset-0 z-20 p-8 md:p-12 flex flex-col justify-center max-w-md space-y-4">
                              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest w-fit">
                                 <Zap className="w-3.5 h-3.5 fill-current" /> LIMITED TIME
                              </div>
                              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none uppercase">
                                 {featuredAd.title}
                              </h2>
                              <p className="text-gray-300 text-sm font-medium line-clamp-2">{featuredAd.description}</p>
                              <Link href={featuredAd.link || "/products"} className="bg-white text-black px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest w-fit hover:bg-indigo-600 hover:text-white transition-all transform hover:-translate-y-1 shadow-xl">
                                 SHOP NOW
                              </Link>
                           </div>
                         </div>
                       )}
                    </div>
                    {/* Side Adverts like Jumia */}
                    <div className="hidden md:flex flex-col gap-6">
                       <Link href="/products?trend=new" className="flex-1 bg-orange-100 rounded-3xl p-6 relative overflow-hidden group">
                          <div className="relative z-10">
                             <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">New Arrival</p>
                             <h4 className="text-lg font-black text-gray-900 leading-tight mt-2 uppercase">Cotton <br/> Bales</h4>
                             <button className="mt-4 text-[10px] font-black text-gray-900 border-b-2 border-orange-400">EXPLORE</button>
                          </div>
                          <Flame className="absolute -bottom-4 -right-4 w-24 h-24 text-orange-200/50 rotate-12 transition-transform group-hover:scale-110" />
                       </Link>
                       <Link href="/baby-shop" className="flex-1 bg-pink-100 rounded-3xl p-6 relative overflow-hidden group">
                          <div className="relative z-10">
                             <p className="text-[10px] font-black text-pink-600 uppercase tracking-widest">Special</p>
                             <h4 className="text-lg font-black text-gray-900 leading-tight mt-2 uppercase">Sarabis <br/> Baby Shop</h4>
                             <button className="mt-4 text-[10px] font-black text-gray-900 border-b-2 border-pink-400">VISIT SHOP</button>
                          </div>
                          <Baby className="absolute -bottom-4 -right-4 w-24 h-24 text-pink-200/50 -rotate-12 transition-transform group-hover:scale-110" />
                       </Link>
                    </div>
                 </div>

                 {/* High Trust Section */}
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                       { icon: Globe, label: "EX-UK Sourced", desc: "Premium Quality", href: "/products?tag=ex-uk" },
                       { icon: ShieldCheck, label: "Safe Payment", desc: "M-Pesa Integrated", href: "/delivery" },
                       { icon: ArrowRight, label: "Fast Delivery", desc: "Kenya-Wide", href: "/delivery" },
                       { icon: Package, label: "Bulk Options", desc: "Business Bales", href: "/products?tag=bulk" },
                    ].map((item, i) => (
                      <Link key={i} href={item.href} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:shadow-md transition-shadow">
                         <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            <item.icon className="w-5 h-5" />
                         </div>
                         <div className="min-w-0">
                            <p className="text-xs font-black text-gray-900 uppercase tracking-tight truncate">{item.label}</p>
                            <p className="text-[10px] font-bold text-gray-400">{item.desc}</p>
                         </div>
                      </Link>
                    ))}
                 </div>
              </div>
            </div>

            {/* FLASH SALES SECTION (Jumia Inspired) */}
            <section className="mt-16 bg-white rounded-[3rem] overflow-hidden border border-orange-100 shadow-2xl shadow-orange-50/20">
               <div className="bg-orange-600 px-8 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                       <Zap className="w-6 h-6 text-white fill-current" />
                       <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter">Flash Sales</h2>
                    </div>
                    {/* Countdown Timer Component */}
                    <div className="hidden md:flex items-center gap-3 text-white/80">
                       <span className="text-xs font-bold uppercase tracking-widest">Ending in:</span>
                       <CountdownTimer targetDate={activeFlashSale?.end_time || "2026-03-31T23:59:59"} />
                    </div>
                  </div>
                  <Link href="/products" className="text-sm font-black text-white hover:underline flex items-center gap-2">
                     SEE ALL <ChevronRight className="w-4 h-4" />
                  </Link>
               </div>
               
               <div className="p-8 overflow-x-auto">
                  <div className="flex gap-6 pb-4">
                     {featuredProducts.length > 0 ? featuredProducts.map((p) => {
                       const discount = p.discount_percentage || (p.original_price ? Math.round(((p.original_price - p.price) / p.original_price) * 100) : null);
                       return (
                        <div key={p.id} className="min-w-[200px] w-[200px] group cursor-pointer">
                           <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden mb-4 relative shadow-sm border border-gray-100">
                             {p.images?.[0] ? (
                               <img src={p.images[0].image_url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={p.name} />
                             ) : (
                               <div className="w-full h-full flex items-center justify-center"><Package className="w-10 h-10 text-gray-200" /></div>
                             )}
                             {discount && (
                               <div className="absolute top-2 right-2 bg-orange-100 text-orange-600 px-2 py-1 rounded-lg text-[10px] font-black">
                                 -{discount}%
                               </div>
                             )}
                             <button 
                               onClick={() => addItem({ ...p, image: p.images?.[0]?.image_url })}
                               className="absolute bottom-3 right-3 p-2.5 bg-white text-black rounded-xl shadow-lg hover:bg-orange-600 hover:text-white transition-all transform active:scale-95"
                             >
                               <ShoppingBag className="w-4 h-4" />
                             </button>
                           </div>
                           <div className="space-y-1">
                             <h4 className="font-bold text-xs text-gray-900 line-clamp-1 uppercase tracking-tight group-hover:text-orange-600 transition-colors">{p.name}</h4>
                             <div className="flex flex-col">
                               <p className="text-orange-600 font-black text-lg">Ksh {p.price.toLocaleString()}</p>
                               {p.original_price && (
                                 <p className="text-gray-400 text-xs font-bold line-through">Ksh {p.original_price.toLocaleString()}</p>
                               )}
                             </div>
                             {/* Stock Progress Bar */}
                             <div className="mt-3 space-y-1">
                                <div className="flex justify-between text-[8px] font-black text-gray-400 uppercase">
                                   <span>Items Left</span>
                                   <span>{p.stock || 12} Left</span>
                                </div>
                                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                   <div className="h-full bg-orange-600 rounded-full transition-all" style={{ width: '65%' }} />
                                </div>
                             </div>
                           </div>
                        </div>
                       )
                     }) : (
                        <div className="w-full text-center py-12 text-gray-400 font-bold uppercase tracking-widest">Flash Sales Starting Soon</div>
                     )}
                  </div>
               </div>
            </section>

            {/* TRENDING PRODUCTS (Professional Grid) */}
            <section className="mt-24">
               <div className="flex items-baseline justify-between mb-12">
                  <div className="space-y-1">
                    <h2 className="text-4xl font-black text-black tracking-tighter uppercase">Recommended For You</h2>
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Based on recent searches</p>
                  </div>
                  <Link href="/products" className="text-sm font-black text-indigo-600 hover:underline">VIEW HIGHLIGHTS</Link>
               </div>

               <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                  {featuredProducts.map((p) => (
                    <div key={p.id} className="bg-white rounded-[2rem] p-4 border border-gray-100 shadow-sm hover:shadow-xl transition-all group group-hover:-translate-y-1">
                       <div className="aspect-[3/4] bg-gray-50 rounded-2xl overflow-hidden mb-4 relative border border-gray-50">
                          {p.images?.[0] ? (
                            <img src={p.images[0].image_url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt={p.name} />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center"><Package className="w-10 h-10 text-gray-200" /></div>
                          )}
                          <div className="absolute top-2 left-2 flex flex-col gap-2">
                             {p.branch_name && (
                               <div className="flex items-center gap-1.5 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-white text-[9px] font-bold">
                                 <MapPin className="w-2.5 h-2.5" />
                                 {p.branch_name}
                               </div>
                             )}
                             {p.discount_percentage ? (
                               <div className="w-fit px-2 py-1 bg-indigo-600 text-white text-[9px] font-black rounded-lg">-{p.discount_percentage}% OFF</div>
                             ) : p.original_price && (
                               <div className="w-fit px-2 py-1 bg-indigo-600 text-white text-[9px] font-black rounded-lg">SALE</div>
                             )}
                          </div>
                          <button 
                            onClick={() => addItem({ ...p, image: p.images?.[0]?.image_url })}
                            className="absolute bottom-3 right-3 w-10 h-10 bg-white text-black rounded-xl shadow-lg hover:bg-indigo-600 hover:text-white transition-all transform active:scale-95 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                          >
                            <ShoppingBag className="w-5 h-5" />
                          </button>
                       </div>
                       <Link href={`/products/${p.id}`} className="space-y-2 block">
                          <h4 className="font-bold text-sm text-gray-900 line-clamp-1 uppercase tracking-tight group-hover:text-indigo-600 transition-colors">{p.name}</h4>
                          <div className="flex items-center justify-between">
                            <div>
                               <p className="text-indigo-600 font-black text-lg leading-none">Ksh {p.price.toLocaleString()}</p>
                               {p.original_price && (
                                 <p className="text-[10px] text-gray-400 font-bold line-through mt-1">Ksh {p.original_price.toLocaleString()}</p>
                               )}
                            </div>
                            <div className="flex items-center gap-1 text-yellow-400">
                               <Star className="w-3 h-3 fill-current" />
                               <span className="text-gray-500 text-[10px] font-black">4.9</span>
                            </div>
                          </div>
                       </Link>
                    </div>
                  ))}
               </div>
            </section>
          </div>

          <footer className="bg-black py-24 text-white">
             <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-16 pb-16 border-b border-white/10">
                   <div className="md:col-span-2 space-y-8">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                          <span className="text-black font-black text-2xl">B</span>
                        </div>
                        <span className="text-3xl font-black tracking-tighter uppercase">Budget Wear</span>
                      </div>
                      <p className="text-gray-400 max-w-sm text-lg leading-relaxed font-medium">
                        Quality Ex-UK fashion, curated for style and durability. Proudly serving multiple locations across Kenya with professional service.
                      </p>
                      {/* Trust Badges Footer */}
                      <div className="flex gap-4">
                         {["MPESA", "VISA", "MASTERCARD"].map(pay => (
                           <div key={pay} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-white/40 grayscale hover:grayscale-0 transition-all cursor-pointer">{pay}</div>
                         ))}
                      </div>
                   </div>
                   <div className="space-y-6">
                      <h5 className="font-black text-sm uppercase tracking-[0.2em]">Branches</h5>
                      <ul className="space-y-4 text-gray-500 font-bold text-sm">
                         {branches.slice(0, 4).map(b => (
                           <li key={b.id}><Link href="/branches" className="hover:text-white transition-colors uppercase">{b.name}</Link></li>
                         ))}
                         <li><Link href="/baby-shop" className="text-pink-500 hover:text-pink-400 font-black transition-colors uppercase">Sarabis Baby Shop</Link></li>
                      </ul>
                   </div>
                   <div className="space-y-6">
                      <h5 className="font-black text-sm uppercase tracking-[0.2em]">Customer Care</h5>
                      <ul className="space-y-4 text-gray-500 font-bold text-sm">
                         <li><Link href="/contact" className="hover:text-white transition-colors uppercase">Contact Us</Link></li>
                         <li><Link href="/delivery" className="hover:text-white transition-colors uppercase">Delivery Info</Link></li>
                      </ul>
                   </div>
                </div>
                <div className="pt-12 text-center">
                   <p className="text-xs font-black text-gray-500 uppercase tracking-widest">© 2026 Budget Wear Limited. All Rights Reserved.</p>
                </div>
             </div>
          </footer>
        </>
      )}
    </div>
  );
}
