"use client";

import { ShoppingBag, Star, Package, Truck, ShieldCheck, Zap, Globe, Heart } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-24 space-y-32">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
           <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
              <Star className="w-3 h-3" /> Professional Retail
           </div>
           <h1 className="text-6xl font-black text-gray-900 tracking-tighter uppercase leading-none">
              Services Tailored <br /> <span className="text-indigo-600">For Your Style</span>
           </h1>
           <p className="text-xl text-gray-500 font-medium">
              From individual premium pieces to wholesale business bales, we provide top-tier fashion services across Kenya.
           </p>
        </div>

        {/* Core Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { 
               icon: ShoppingBag, 
               title: "Premium Thrift", 
               desc: "Hand-picked Ex-UK fashion items. Quality checked, washed, and ready to wear. Discover unique pieces you won't find anywhere else.",
               color: "indigo"
             },
             { 
               icon: Heart, 
               title: "Sarabis Baby Shop", 
               desc: "A dedicated collection for your little ones. From newborns to toddlers, we provide gentle, high-quality clothing at budget prices.",
               color: "pink"
             },
             { 
               icon: Package, 
               title: "Wholesale Bales", 
               desc: "Start your own business today! We supply premium, un-opened Bales directly from the UK to your doorstep anywhere in Kenya.",
               color: "orange"
             }
           ].map((s, i) => (
             <div key={i} className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-xl space-y-8 group hover:-translate-y-2 transition-all">
                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform bg-${s.color}-50 text-${s.color}-600`}>
                   <s.icon className="w-10 h-10" />
                </div>
                <div className="space-y-4">
                   <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">{s.title}</h3>
                   <p className="text-gray-500 font-medium leading-relaxed">{s.desc}</p>
                </div>
                <Link href="/products" className="inline-flex items-center gap-2 text-sm font-black text-indigo-600 hover:underline">
                   VIEW ALL ITEMS <Zap className="w-4 h-4 fill-current" />
                </Link>
             </div>
           ))}
        </div>

        {/* Why Choose Us Section */}
        <div className="bg-black text-white rounded-[4rem] p-16 md:p-24 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-600/20 -skew-x-12 translate-x-1/2" />
           <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                 <h2 className="text-5xl font-black uppercase tracking-tighter leading-none">The Budget Wear <br /> Advantage</h2>
                 <p className="text-gray-400 text-lg font-medium leading-relaxed max-w-md">
                    We aren't just selling clothes; we're providing a platform for sustainable, affordable, and high-end fashion.
                 </p>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[
                      { icon: Truck, title: "Country-Wide Delivery", sub: "24-48 Hour Turnaround" },
                      { icon: ShieldCheck, title: "Quality Guaranteed", sub: "Strict Grade-A Filtering" },
                      { icon: Globe, title: "Ethically Sourced", sub: "Directly from UK Hubs" },
                      { icon: Zap, title: "Fast Checkout", sub: "Secure M-Pesa Payment" }
                    ].map((v, i) => (
                      <div key={i} className="flex gap-4 items-start">
                         <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                            <v.icon className="w-5 h-5 text-indigo-400" />
                         </div>
                         <div>
                            <p className="text-sm font-black uppercase tracking-tight">{v.title}</p>
                            <p className="text-xs text-gray-500 font-bold">{v.sub}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
              <div className="aspect-square bg-white/5 rounded-[4rem] border border-white/10 flex items-center justify-center relative group">
                 <ShoppingBag className="w-40 h-40 text-white/10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform group-hover:scale-125" />
                 <div className="text-center space-y-4">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Join our community</p>
                    <p className="text-6xl font-black tracking-tighter uppercase whitespace-pre-line">Trusted by{'\n'}Thousands</p>
                 </div>
              </div>
           </div>
        </div>

        {/* FAQ Preview */}
        <div className="max-w-4xl mx-auto space-y-12 text-center">
           <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">Frequently Asked</h2>
           <div className="grid grid-cols-1 gap-4 text-left">
              {[
                { q: "How do you source your bales?", a: "We source our bales directly from reputable charitable and recycling centers in the UK. Every bale is graded before shipping." },
                { q: "Can I choose specific items in a bale?", a: "Wholesale bales are sold sealed. For individual items, please shop through our thrift or baby shop sections." },
                { q: "Do you deliver to my town?", a: "Yes! We coordinate with leading logistics partners to deliver to all major towns across Kenya." }
              ].map((f, i) => (
                <div key={i} className="p-8 bg-white border border-gray-100 rounded-3xl transition-all hover:border-indigo-100 group">
                   <h4 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-2 group-hover:text-indigo-600 transition-colors">{f.q}</h4>
                   <p className="text-gray-500 font-medium leading-relaxed">{f.a}</p>
                </div>
              ))}
           </div>
        </div>

      </main>

      <footer className="py-20 text-center space-y-8">
         <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-sm">B</span>
            </div>
            <span className="text-lg font-black tracking-tighter text-black uppercase">Budget Wear Limited</span>
         </div>
         <p className="text-xs font-black text-gray-400 uppercase tracking-widest px-4 leading-relaxed">Defining the next generation of thrift in East Africa. Quality, Integrity, Excellence.</p>
      </footer>
    </div>
  );
}
