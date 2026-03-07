"use client";

import { useState } from "react";
import { 
  CreditCard, 
  MapPin, 
  ChevronRight, 
  Lock, 
  Smartphone,
  CheckCircle2,
  Calendar,
  User,
  Phone,
  ArrowRight
} from "lucide-react";
import { toast } from "sonner";

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left Column: Form */}
        <div className="space-y-10">
          <div className="flex items-center gap-4 text-sm font-bold text-gray-400">
             <span className={step >= 1 ? "text-indigo-600" : ""}>Shipping</span>
             <ChevronRight className="w-4 h-4" />
             <span className={step >= 2 ? "text-indigo-600" : ""}>Payment</span>
             <ChevronRight className="w-4 h-4" />
             <span className={step >= 3 ? "text-indigo-600" : ""}>Confirmation</span>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <MapPin className="w-6 h-6 text-indigo-600" />
                Shipping Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-1.5">
                   <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
                   <input type="text" className="w-full h-12 px-4 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium" placeholder="Jane Doe" />
                 </div>
                 <div className="space-y-1.5">
                   <label className="text-xs font-bold text-gray-500 uppercase">Phone Number</label>
                   <input type="tel" className="w-full h-12 px-4 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium" placeholder="0712 345 678" />
                 </div>
                 <div className="md:col-span-2 space-y-1.5">
                   <label className="text-xs font-bold text-gray-500 uppercase">Branch or Street Address</label>
                   <input type="text" className="w-full h-12 px-4 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium" placeholder="Nairobi Branch / Tom Mboya St" />
                 </div>
              </div>
            </section>

            <section className="pt-8 border-t border-gray-50">
               <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <Smartphone className="w-6 h-6 text-indigo-600" />
                Payment via M-Pesa
              </h2>
              <div className="p-6 bg-indigo-50/50 border border-indigo-100 rounded-3xl space-y-4">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-indigo-100 shadow-sm">
                      <img src="https://placehold.co/40x40/00bf00/white?text=M" className="rounded-md" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Lipa na M-Pesa</p>
                      <p className="text-xs text-gray-500 font-medium">Safe and Instant Payment</p>
                    </div>
                 </div>
                 <div className="space-y-1.5 pt-4">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">M-Pesa Phone Number</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">+254</div>
                      <input 
                        type="tel" 
                        className="w-full h-14 pl-16 pr-4 bg-white border border-indigo-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-lg text-gray-900" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="712 345 678" 
                      />
                    </div>
                 </div>
                 <p className="text-[11px] text-gray-500 flex items-center gap-2 mt-2">
                    <Lock className="w-3 h-3" /> Secure checkout. You will receive an STK push on your phone.
                 </p>
              </div>
            </section>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div>
           <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-2xl sticky top-24">
              <h3 className="text-xl font-black text-gray-900 mb-8 pb-4 border-b border-gray-50">Confirm Order</h3>
              
              <div className="space-y-6">
                 {[1, 2].map(i => (
                   <div key={i} className="flex gap-4">
                      <div className="w-16 h-16 bg-gray-50 rounded-xl border border-gray-100 shrink-0">
                         <img src="https://placehold.co/100x100/png" className="w-full h-full object-cover rounded-xl" />
                      </div>
                      <div className="flex-1">
                         <p className="text-sm font-bold text-gray-900 leading-tight">Blue Denim Jacket</p>
                         <p className="text-xs text-gray-500 mt-1">Qt: 1 • Ksh 2,500</p>
                      </div>
                   </div>
                 ))}
              </div>

              <div className="mt-10 space-y-4 pt-10 border-t border-gray-100">
                <div className="flex justify-between text-gray-500 font-bold text-sm">
                  <span>Shipping</span>
                  <span className="text-green-600">FREE</span>
                </div>
                <div className="flex justify-between text-gray-900 font-black text-2xl pt-2">
                  <span>Total</span>
                  <span className="text-indigo-600">Ksh 5,000</span>
                </div>
              </div>

              <button 
                onClick={() => {
                  toast.promise(new Promise(resolve => setTimeout(resolve, 2000)), {
                    loading: 'Sending STK Push...',
                    success: 'Payment Request Sent!',
                    error: 'Failed to send request',
                  });
                }}
                className="w-full mt-10 bg-indigo-600 text-white h-16 rounded-3xl font-black flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl shadow-indigo-100 group active:scale-95"
              >
                Pay with M-Pesa
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="mt-8 flex justify-center items-center gap-6 opacity-40">
                <Smartphone className="w-5 h-5" />
                <CreditCard className="w-5 h-5" />
                <CheckCircle2 className="w-5 h-5" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
