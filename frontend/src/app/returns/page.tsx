"use client";
import Link from "next/link";
import { ArrowLeft, RefreshCcw } from "lucide-react";

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-white pt-32 px-4">
      <div className="max-w-3xl mx-auto space-y-12">
        <Link href="/" className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back Home
        </Link>
        <h1 className="text-5xl font-black tracking-tighter uppercase flex items-center gap-4">
          <RefreshCcw className="w-12 h-12" /> Returns Policy
        </h1>
        <div className="prose prose-indigo max-w-none text-gray-600 space-y-6">
          <p className="text-xl font-medium">Changed your mind? No problem. We have a 7-day return policy.</p>
          <div className="space-y-4">
            <h3 className="text-black font-black uppercase tracking-widest text-sm">Terms & Conditions</h3>
            <ul className="list-decimal pl-6 space-y-2">
              <li>Items must be returned within 7 days of purchase.</li>
              <li>Must be in original condition with tags still attached.</li>
              <li>Returns can be made at any of our physical branches.</li>
              <li>Refunds are processed to M-Pesa within 24 hours of approval.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
