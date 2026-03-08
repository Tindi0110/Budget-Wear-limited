"use client";
import Link from "next/link";
import { ArrowLeft, Truck } from "lucide-react";

export default function DeliveryPage() {
  return (
    <div className="min-h-screen bg-white pt-32 px-4">
      <div className="max-w-3xl mx-auto space-y-12">
        <Link href="/" className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back Home
        </Link>
        <h1 className="text-5xl font-black tracking-tighter uppercase flex items-center gap-4">
          <Truck className="w-12 h-12" /> Delivery Info
        </h1>
        <div className="prose prose-indigo max-w-none text-gray-600 space-y-6">
          <p className="text-xl font-medium">We offer same-day delivery within major towns across Kenya.</p>
          <div className="space-y-4">
            <h3 className="text-black font-black uppercase tracking-widest text-sm">Delivery Rates</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Nairobi CBD: Free</li>
              <li>Nairobi Suburbs: Ksh 250 - 500</li>
              <li>Mombasa & Nakuru: Ksh 300 flat rate</li>
              <li>Other regions: Via G4S or Wells Fargo (Calculated at checkout)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
