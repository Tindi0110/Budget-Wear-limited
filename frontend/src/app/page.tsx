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
  Loader2
} from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  price: number;
  branch_name?: string;
  category_name?: string;
  images?: Array<{ image_url: string }>;
}

interface Category {
  id: string;
  name: string;
  image?: string;
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

export default function Home() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { addItem, count } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [adverts, setAdverts] = useState<Advert[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [prodData, catData, advData, branchData] = await Promise.all([
          api.get("/products/"),
          api.get("/categories/"),
          api.get("/adverts/"),
          api.get("/branches/")
        ]);
        setProducts(prodData);
        setCategories(catData);
        setAdverts(advData.filter((a: Advert) => a.is_active));
        setBranches(branchData);
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
  const featuredProducts = products.slice(0, 5);

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
            <Link href="/baby-shop" className="text-sm font-bold text-pink-600 hover:text-pink-700 transition-colors">BABY SHOP</Link>
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
                    className="w-full h-12 px-4 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-gray-900"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery.length > 0 && (
                    <div className="mt-6 space-y-4">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Suggested Results</p>
                      {searchResults.length > 0 ? searchResults.map((res, i) => (
                        <Link key={i} href={`/products/${res.id}`} className="flex gap-4 p-2 hover:bg-gray-50 rounded-2xl cursor-pointer transition-colors group">
                           <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden">
                              {res.images && res.images[0] ? (
                                <img src={res.images[0].image_url} alt={res.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="w-6 h-6 text-gray-300" />
                                </div>
                              )}
                           </div>
                           <div>
                              <p className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{res.name}</p>
                              <p className="text-xs text-gray-500 font-medium">Ksh {res.price.toLocaleString()}</p>
                           </div>
                        </Link>
                      )) : (
                        <p className="text-xs text-gray-400 font-medium text-center py-4">No matching items found</p>
                      )}
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
              {count > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-indigo-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-in zoom-in-50 duration-300">{count}</span>
              )}
            </Link>
            <button className="md:hidden p-2"><Menu className="w-6 h-6 text-black" /></button>
          </div>
        </div>
      </nav>

      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
        </div>
      ) : (
        <>
          <section className="pt-32 pb-20 px-4">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Left Sidebar - Quick Access */}
              <aside className="hidden lg:col-span-2 lg:block space-y-8 h-fit sticky top-32">
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Quick Access</p>
                  
                  <nav className="space-y-1">
                    <Link href="/baby-shop" className="flex items-center gap-3 p-3 bg-pink-50 text-pink-700 rounded-2xl border border-pink-100 group transition-all hover:bg-pink-100">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-110">
                        <Baby className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-black transition-colors">Baby Shop</p>
                        <p className="text-[9px] font-bold opacity-70">Premium Kids Wear</p>
                      </div>
                    </Link>

                    <Link href="/products?trend=new" className="flex items-center gap-3 p-3 text-gray-500 rounded-2xl hover:bg-gray-50 group transition-all">
                      <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110">
                        <Flame className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-bold group-hover:text-black transition-colors">New Drops</span>
                    </Link>

                    <Link href="/branches" className="flex items-center gap-3 p-3 text-gray-500 rounded-2xl hover:bg-gray-50 group transition-all">
                      <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110">
                        <Globe className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-bold group-hover:text-black transition-colors">All Branches</span>
                    </Link>
                  </nav>

                  <hr className="border-gray-50" />

                  <div className="space-y-4 px-2">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Collections</p>
                    <div className="space-y-3">
                      {categories.slice(0, 5).map((cat) => (
                        <Link key={cat.id} href={`/products?category=${cat.name}`} className="block text-sm font-bold text-gray-500 hover:text-black transition-colors">
                          {cat.name}
                        </Link>
                      ))}
                      <Link href="/categories" className="block text-xs font-black text-indigo-600 hover:underline uppercase">View All</Link>
                    </div>
                  </div>
                </div>
              </aside>

              {/* Main Content */}
              <div className="lg:col-span-7 space-y-12">
                {/* Advert Banner */}
                {featuredAd && (
                  <div className="relative w-full aspect-[21/9] bg-black rounded-[2.5rem] overflow-hidden group shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black/20 z-10" />
                    <img 
                      src={featuredAd.image} 
                      className="w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-110" 
                      alt={featuredAd.title}
                    />
                    <div className="absolute inset-0 z-20 p-10 flex flex-col justify-center max-w-sm space-y-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest w-fit">
                         <TrendingUp className="w-3.5 h-3.5" />
                         TRENDING NOW
                      </div>
                      <h2 className="text-4xl font-black text-white tracking-tighter leading-none uppercase">
                         {featuredAd.title}
                      </h2>
                      <p className="text-gray-300 text-sm font-medium">{featuredAd.description}</p>
                      <Link href={featuredAd.link || "/products"} className="bg-white text-black px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest w-fit hover:bg-indigo-500 hover:text-white transition-all transform hover:-translate-y-1">
                         SHOP NOW
                      </Link>
                    </div>
                  </div>
                )}

                <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-xs font-black uppercase tracking-widest">
                    <Zap className="w-4 h-4 fill-indigo-700" />
                    Premium Ex-UK Thrift
                  </div>
                  <h1 className="text-6xl md:text-7xl font-black text-black leading-[0.9] tracking-tighter">
                    CURATED <br/> THRIFT <br/> <span className="text-indigo-600">REDEFINED.</span>
                  </h1>
                  <p className="text-xl text-gray-500 max-w-lg leading-relaxed font-medium">
                    Discover unique clothing across our multiple branches. High quality, sustainable, and budget-friendly.
                  </p>
                  <div className="flex items-center gap-6">
                    <Link 
                      href="/products" 
                      className="px-10 py-5 bg-black text-white rounded-2xl font-black flex items-center gap-3 hover:bg-indigo-600 transition-all shadow-xl shadow-gray-200 active:scale-95"
                    >
                      EXPLORE ALL
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>

                <div className="relative animate-in fade-in duration-1000">
                  <div className="aspect-[16/9] bg-gray-100 rounded-[3rem] overflow-hidden shadow-2xl relative">
                     <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover" alt="Sustainable Fashion" />
                     <div className="absolute inset-0 bg-black/20" />
                  </div>
                </div>
              </div>

              {/* Right Sidebar */}
              <aside className="lg:col-span-3 space-y-8 h-fit lg:sticky lg:top-32">
                {/* Branch Widget */}
                {branches.length > 0 && (
                  <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 text-indigo-600 mb-4">
                        <MapPin className="w-5 h-5" />
                        <span className="text-xs font-black uppercase tracking-widest">Main Branch</span>
                      </div>
                      <h3 className="text-2xl font-black text-gray-900">{branches[0].name}</h3>
                      <p className="text-sm text-gray-500 font-medium mt-1">{branches[0].location || "Visit us today"}</p>
                      <div className="mt-6 space-y-3">
                         <div className="flex justify-between text-xs font-bold text-gray-400">
                            <span>STATUS</span>
                            <span className="text-green-600">OPEN NOW</span>
                         </div>
                         <p className="text-sm font-bold text-gray-900">08:00 AM - 07:00 PM</p>
                      </div>
                      <Link href="/branches" className="block text-center w-full mt-8 py-4 bg-gray-50 text-gray-900 rounded-2xl font-bold hover:bg-gray-100 transition-all border border-gray-100">
                         View All Branches
                      </Link>
                    </div>
                  </div>
                )}

                {/* Categories Quick Grid */}
                <div className="bg-black p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-4">
                      <div className="bg-indigo-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Popular</div>
                   </div>
                   <div className="relative z-10">
                      <h4 className="text-xl font-black mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-indigo-400" />
                        Categories
                      </h4>
                      <div className="space-y-3">
                         {categories.slice(0, 3).map((cat, i) => (
                           <Link key={cat.id} href={`/products?category=${cat.name}`} className="flex gap-4 p-3 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors group">
                              <div className="w-10 h-10 rounded-xl bg-gray-800 shrink-0 flex items-center justify-center font-black text-indigo-400">
                                {cat.name[0]}
                              </div>
                              <div className="flex-1 flex items-center justify-between">
                                 <p className="text-xs font-bold">{cat.name}</p>
                                 <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all" />
                              </div>
                           </Link>
                         ))}
                      </div>
                      <Link href="/categories" className="block text-center mt-6 text-[10px] font-black text-indigo-400 hover:text-indigo-300 uppercase tracking-[0.2em]">View All Collections</Link>
                   </div>
                </div>
              </aside>
            </div>
          </section>

          {/* Featured Categories */}
          <section className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex items-baseline justify-between mb-12">
                <h2 className="text-4xl font-black text-black tracking-tighter">BROWSE COLLECTIONS</h2>
                <Link href="/categories" className="text-sm font-bold text-indigo-600 hover:underline">VIEW ALL</Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {categories.slice(0, 4).map((cat, i) => (
                  <Link key={cat.id} href={`/products?category=${cat.name}`} className="group relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-lg transition-transform hover:-translate-y-2 bg-white">
                    {cat.image ? (
                      <img src={cat.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={cat.name} />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center">
                        <Package className="w-12 h-12 text-indigo-100" />
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                      <p className="text-xl font-black text-white">{cat.name}</p>
                      <p className="text-sm text-white/70 font-bold uppercase tracking-widest text-[10px]">Explore Now</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Trending Section */}
          <section className="py-24">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex items-baseline justify-between mb-12">
                <h2 className="text-4xl font-black text-black tracking-tighter">TRENDING NOW</h2>
                <Link href="/products" className="text-sm font-bold text-indigo-600 hover:underline">VIEW ALL</Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                {featuredProducts.length > 0 ? featuredProducts.map((p) => (
                  <div key={p.id} className="group cursor-pointer">
                    <div className="aspect-[3/4] bg-gray-50 rounded-2xl overflow-hidden mb-4 relative shadow-sm border border-gray-100">
                      {p.images && p.images[0] ? (
                        <img src={p.images[0].image_url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt={p.name} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-10 h-10 text-gray-200" />
                        </div>
                      )}
                      <button 
                        onClick={() => addItem({ 
                          id: p.id, 
                          name: p.name, 
                          price: p.price, 
                          branch_name: p.branch_name, 
                          image: p.images?.[0]?.image_url,
                          category_name: p.category_name
                        })}
                        className="absolute bottom-3 right-3 p-2.5 bg-white text-black rounded-xl shadow-lg hover:bg-indigo-600 hover:text-white transition-all transform active:scale-95 flex items-center justify-center"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                      {p.branch_name && (
                        <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-white text-[9px] font-bold">
                          <MapPin className="w-2.5 h-2.5" />
                          {p.branch_name}
                        </div>
                      )}
                    </div>
                    <Link href={`/products/${p.id}`} className="space-y-1 block">
                      <h4 className="font-bold text-sm text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{p.name}</h4>
                      <div className="flex items-center justify-between">
                        <p className="text-indigo-600 font-black text-sm">Ksh {p.price.toLocaleString()}</p>
                        <div className="flex items-center gap-1 text-yellow-500">
                           <Star className="w-3 h-3 fill-current" />
                           <span className="text-gray-500 text-[10px] font-bold text-black">4.9</span>
                        </div>
                      </div>
                    </Link>
                  </div>
                )) : (
                  <div className="col-span-full py-12 text-center text-gray-400 font-bold">No products available</div>
                )}
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
                      {branches.slice(0, 4).map(b => (
                        <li key={b.id}><Link href="/branches" className="hover:text-white transition-colors">{b.name}</Link></li>
                      ))}
                      <li><Link href="/baby-shop" className="text-pink-500 hover:text-pink-400 font-black transition-colors">Special: Baby Shop</Link></li>
                   </ul>
                </div>
                <div className="space-y-6">
                   <h5 className="font-bold text-lg">CUSTOMER CARE</h5>
                   <ul className="space-y-4 text-gray-500 font-medium">
                      <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                      <li><Link href="/delivery" className="hover:text-white transition-colors">Delivery Info</Link></li>
                      <li><Link href="/returns" className="hover:text-white transition-colors">Returns & Exchanges</Link></li>
                      <li><Link href="/admin" className="text-indigo-400 hover:text-indigo-300 font-black transition-colors underline decoration-2 underline-offset-4">Admin Dashboard</Link></li>
                   </ul>
                </div>
             </div>
          </footer>
        </>
      )}
    </div>
  );
}
