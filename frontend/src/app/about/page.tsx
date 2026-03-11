"use client";

import { Info, Target, Users, ShieldCheck, Heart, Award } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="py-24 bg-gray-50/50">
          <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
              <Info className="w-3 h-3" /> Our Story
            </div>
            <h1 className="text-6xl md:text-7xl font-black text-gray-900 tracking-tighter uppercase leading-none">
              Defining Quality <br /> <span className="text-indigo-600">Since 2024</span>
            </h1>
            <p className="text-xl text-gray-500 font-medium leading-relaxed">
              Budget Wear Limited was born out of a simple vision: to make premium Ex-UK fashion accessible to every household in Kenya. We believe that quality shouldn't come with an unattainable price tag.
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-24 max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white p-12 rounded-[3rem] border border-gray-100 shadow-xl space-y-6 group hover:-translate-y-2 transition-all">
               <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Target className="w-8 h-8" />
               </div>
               <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Our Mission</h2>
               <p className="text-gray-500 font-medium leading-relaxed">
                  To provide a seamless omnichannel shopping experience that connects Kenyan families with high-quality, sustainable fashion while maintaining the highest standards of integrity and customer service.
               </p>
            </div>
            <div className="bg-white p-12 rounded-[3rem] border border-gray-100 shadow-xl space-y-6 group hover:-translate-y-2 transition-all">
               <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-colors">
                  <Award className="w-8 h-8" />
               </div>
               <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Our Vision</h2>
               <p className="text-gray-500 font-medium leading-relaxed">
                  To become the leading multi-brand thrift and boutique retail network in East Africa, recognized for our commitment to quality, affordability, and community development.
               </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-24 bg-black text-white rounded-[4rem] mx-4 mb-24 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-600/10 skew-x-12 translate-x-1/2" />
          <div className="max-w-7xl mx-auto px-12 relative z-10">
            <h2 className="text-5xl font-black uppercase tracking-tighter mb-16">The Values We Live By</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
               {[
                 { icon: ShieldCheck, title: "Integrity", desc: "Honesty in every bale we open and every item we sell." },
                 { icon: Users, title: "Community", desc: "Building lasting relationships with our staff and customers." },
                 { icon: Heart, title: "Sustainability", desc: "Promoting circular fashion to protect our environment." },
                 { icon: Award, title: "Excellence", desc: "Striving for perfection in every delivery across Kenya." }
               ].map((v, i) => (
                 <div key={i} className="space-y-4">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                       <v.icon className="w-6 h-6 text-indigo-400" />
                    </div>
                    <h4 className="text-xl font-black uppercase tracking-tight">{v.title}</h4>
                    <p className="text-gray-400 text-sm font-medium leading-relaxed">{v.desc}</p>
                 </div>
               ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 max-w-4xl mx-auto px-4 text-center space-y-12">
           <h2 className="text-5xl font-black text-gray-900 uppercase tracking-tighter">Ready to Shop Quality?</h2>
           <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/products" className="w-full sm:w-auto px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-indigo-700 transition-all active:scale-95">Explore Collection</Link>
              <Link href="/services" className="w-full sm:w-auto px-12 py-5 bg-white border-2 border-gray-100 text-black rounded-2xl font-black uppercase tracking-widest hover:bg-gray-50 transition-all active:scale-95">Our Services</Link>
           </div>
        </section>
      </main>

      {/* Footer (Simplified) */}
      <footer className="py-12 border-t border-gray-100 text-center">
         <p className="text-xs font-black text-gray-400 uppercase tracking-widest">© 2026 Budget Wear Limited. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
