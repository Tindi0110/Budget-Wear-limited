"use client";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white pt-32 px-4">
      <div className="max-w-3xl mx-auto space-y-12">
        <Link href="/" className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back Home
        </Link>
        <h1 className="text-5xl font-black tracking-tighter">CONTACT US</h1>
        <div className="grid gap-8">
          <div className="flex gap-4 items-center p-6 bg-gray-50 rounded-2xl">
            <Mail className="w-6 h-6 text-indigo-600" />
            <div>
              <p className="font-bold">Email</p>
              <p className="text-gray-500">support@budgetwear.co.ke</p>
            </div>
          </div>
          <div className="flex gap-4 items-center p-6 bg-gray-50 rounded-2xl">
            <Phone className="w-6 h-6 text-indigo-600" />
            <div>
              <p className="font-bold">Phone</p>
              <p className="text-gray-500">+254 700 000 000</p>
            </div>
          </div>
          <div className="flex gap-4 items-center p-6 bg-gray-50 rounded-2xl">
            <MapPin className="w-6 h-6 text-indigo-600" />
            <div>
              <p className="font-bold">Headquarters</p>
              <p className="text-gray-500">Pioneer House, Nairobi CBD</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
