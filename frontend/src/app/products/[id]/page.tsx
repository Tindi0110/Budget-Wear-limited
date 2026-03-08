"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, MapPin, Star, ShieldCheck, Truck, RefreshCcw, Minus, Plus, Heart, ArrowLeft, Package, Share2 } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/lib/CartContext";
import { api } from "@/lib/api";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  description?: string;
  branch_name?: string;
  category_name?: string;
  images?: Array<{ image_url: string }>;
}

export default function ProductDetail({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addItem, count } = useCart();

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const data = await api.get(`/products/${params.id}/`);
        setProduct(data);
      } catch {
        toast.error("Product not found");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-3xl animate-pulse" />
          <div className="grid grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="aspect-square bg-gray-100 rounded-xl animate-pulse" />)}
          </div>
        </div>
        <div className="space-y-6 pt-8">
          <div className="h-6 bg-gray-100 rounded animate-pulse w-1/3" />
          <div className="h-12 bg-gray-100 rounded animate-pulse w-3/4" />
          <div className="h-8 bg-gray-100 rounded animate-pulse w-1/4" />
          <div className="h-24 bg-gray-100 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Package className="w-16 h-16 text-gray-200" />
        <p className="font-black text-gray-400">Product not found</p>
        <Link href="/products" className="text-indigo-600 font-bold hover:underline">← Back to Products</Link>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [];

  return (
    <div className="min-h-screen bg-white">
      {/* Minimal nav */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/products" className="flex items-center gap-2 group text-gray-500 hover:text-black transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-black">PRODUCTS</span>
          </Link>
          <Link href="/cart" className="relative p-2 text-gray-400 hover:text-black transition-colors">
            <ShoppingBag className="w-6 h-6" />
            {count > 0 && (
              <span className="absolute top-0 right-0 w-5 h-5 bg-black text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">{count}</span>
            )}
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-50 rounded-3xl border border-gray-100 overflow-hidden shadow-sm group">
              {images.length > 0 ? (
                <img src={images[selectedImage]?.image_url} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-24 h-24 text-gray-200" />
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${selectedImage === i ? "border-indigo-500 shadow-md" : "border-gray-100 hover:border-indigo-300"}`}
                  >
                    <img src={img.image_url} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col pt-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-2 flex-wrap">
                {product.category_name && (
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-black rounded-full uppercase tracking-wider">{product.category_name}</span>
                )}
                {product.stock <= 5 && product.stock > 0 && (
                  <span className="px-3 py-1 bg-orange-50 text-orange-600 text-xs font-black rounded-full uppercase">Only {product.stock} left</span>
                )}
                {product.stock === 0 && (
                  <span className="px-3 py-1 bg-red-50 text-red-600 text-xs font-black rounded-full uppercase">Out of Stock</span>
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={() => toast.success("Added to favorites")} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all">
                  <Heart className="w-5 h-5" />
                </button>
                <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied!"); }} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <h1 className="text-3xl lg:text-4xl font-black text-gray-900 mt-4 leading-tight">{product.name}</h1>

            <div className="flex items-center gap-2 mt-4">
              {[1,2,3,4,5].map((s) => <Star key={s} className={`w-4 h-4 ${s <= 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`} />)}
              <span className="text-sm text-gray-500 font-medium ml-1">Top-rated item</span>
            </div>

            <div className="mt-6">
              <span className="text-4xl font-black text-indigo-600">Ksh {Number(product.price).toLocaleString()}</span>
            </div>

            {product.description && (
              <p className="mt-6 text-gray-600 leading-relaxed">{product.description}</p>
            )}

            {product.branch_name && (
              <div className="mt-6 p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-3">
                <MapPin className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-black text-gray-900">Available at {product.branch_name}</p>
                  <p className="text-xs text-gray-500">Pick-up or same-day delivery</p>
                </div>
              </div>
            )}

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-white border border-gray-200 rounded-xl px-2 h-12 shadow-sm">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 text-gray-500 hover:text-indigo-600 transition-colors">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-black text-gray-900">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="p-2 text-gray-500 hover:text-indigo-600 transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  disabled={product.stock === 0}
                  onClick={() => {
                    for (let i = 0; i < quantity; i++) {
                      addItem({ id: product!.id, name: product!.name, price: Number(product!.price), branch_name: product!.branch_name, category_name: product!.category_name, image: product!.images?.[0]?.image_url });
                    }
                  }}
                  className="flex-1 bg-indigo-600 text-white h-12 rounded-xl font-black flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg shadow-indigo-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed uppercase tracking-wider text-sm"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-6 border-t border-gray-100">
                {[
                  { icon: ShieldCheck, label: "Authentic Quality", color: "text-green-600" },
                  { icon: Truck, label: "Fast Delivery", color: "text-blue-600" },
                  { icon: RefreshCcw, label: "Easy Returns", color: "text-orange-600" },
                ].map(({ icon: Icon, label, color }) => (
                  <div key={label} className="flex flex-col items-center gap-2 text-center p-3 bg-gray-50 rounded-2xl">
                    <Icon className={`w-5 h-5 ${color}`} />
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
