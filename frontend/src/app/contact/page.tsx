"use client";

import { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import Header from "@/components/Header";
import { toast } from "sonner";

interface Branch {
  id: string;
  name: string;
  location: string;
  map_url?: string;
  type: string;
}

export default function ContactPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const data = await api.get("/branches/");
        setBranches(data);
      } catch (error) {
        console.error("Failed to load branches", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBranches();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          
          {/* Left Side: Contact Info & Form */}
          <div className="space-y-12">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                <MessageSquare className="w-3 h-3" /> Contact Us
              </div>
              <h1 className="text-6xl font-black text-gray-900 tracking-tighter uppercase">Get in <span className="text-indigo-600">Touch</span></h1>
              <p className="text-xl text-gray-500 font-medium">Have a question about our bales or looking for a specific item? Our team is here to help you.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
               <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100 flex flex-col gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                     <Mail className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Us</p>
                    <p className="text-lg font-black text-gray-900">info@budgetwear.co.ke</p>
                  </div>
               </div>
               <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100 flex flex-col gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                     <Phone className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Call Us</p>
                    <p className="text-lg font-black text-gray-900">+254 700 000 000</p>
                  </div>
               </div>
            </div>

            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); toast.success("Message sent! We'll get back to you soon."); }}>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Your Name</label>
                    <input type="text" placeholder="John Doe" className="w-full h-14 px-6 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold outline-none" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Email Address</label>
                    <input type="email" placeholder="john@example.com" className="w-full h-14 px-6 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold outline-none" required />
                  </div>
               </div>
               <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Message</label>
                <textarea rows={6} placeholder="How can we help you?" className="w-full p-6 bg-gray-50 border border-gray-100 rounded-3xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold outline-none resize-none" required />
               </div>
               <button type="submit" className="w-full py-5 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-3">
                  <Send className="w-4 h-4" /> Send Message
               </button>
            </form>
          </div>

          {/* Right Side: Branches & Maps */}
          <div className="space-y-12">
             <div className="space-y-4">
                <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Our Branches</h2>
                <p className="text-gray-500 font-medium">Visit any of our physical locations for an in-person shopping experience.</p>
             </div>

             <div className="space-y-8 h-[800px] overflow-y-auto pr-4 custom-scrollbar">
                {isLoading ? (
                  <div className="flex items-center justify-center h-40">
                    <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : branches.map((branch) => (
                  <div key={branch.id} className="p-8 bg-white border border-gray-100 rounded-[3rem] shadow-sm hover:shadow-xl transition-all space-y-6">
                     <div className="flex items-start justify-between">
                        <div className="space-y-2">
                           <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${branch.type === 'baby_shop' ? 'bg-pink-50 text-pink-600' : 'bg-indigo-50 text-indigo-600'}`}>
                              {branch.type.replace('_', ' ')}
                           </div>
                           <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">{branch.name}</h3>
                           <div className="flex items-center gap-2 text-gray-400 text-sm font-bold">
                              <MapPin className="w-4 h-4" /> {branch.location}
                           </div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-2xl text-gray-400">
                           <Clock className="w-6 h-6" />
                        </div>
                     </div>

                     {/* Map Embed or Link */}
                     <div className="aspect-video bg-gray-100 rounded-3xl overflow-hidden relative group">
                        {branch.map_url ? (
                           <iframe 
                             src={branch.map_url}
                             className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-700"
                             loading="lazy"
                           ></iframe>
                        ) : (
                           <div className="w-full h-full flex items-center justify-center flex-col gap-4 text-center p-8">
                              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border border-gray-100">
                                 <MapPin className="w-8 h-8 text-indigo-600" />
                              </div>
                              <p className="text-sm font-black text-gray-400 uppercase">Map preview not available</p>
                           </div>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all pointer-events-none" />
                     </div>
                  </div>
                ))}
             </div>
          </div>

        </div>
      </main>

      <footer className="py-20 bg-gray-50 text-center">
         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Budget Wear Limited - Connecting You to Quality</p>
         <Link href="/services" className="text-sm font-black text-indigo-600 hover:underline">Explore Our Professional Services</Link>
      </footer>
    </div>
  );
}
