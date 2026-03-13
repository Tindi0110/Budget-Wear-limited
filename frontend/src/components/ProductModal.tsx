"use client";

import React, { useState, useEffect } from "react";
import { 
  X, 
  ShoppingBag, 
  MapPin, 
  Star, 
  ShieldCheck, 
  Truck, 
  RefreshCcw, 
  Minus, 
  Plus, 
  Heart, 
  Share2,
  Package,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/lib/CartContext";

interface Product {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  stock: number;
  description?: string;
  branch_name?: string;
  category_name?: string;
  images?: Array<{ image_url: string }>;
  discount_percentage?: number;
}

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addItem } = useCart();

  // Reset state when product changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setSelectedImage(0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const images = product.images && product.images.length > 0 ? product.images : [];
  const hasMultipleImages = images.length > 1;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
        addItem({ 
            id: product.id, 
            name: product.name, 
            price: Number(product.price), 
            branch_name: product.branch_name, 
            category_name: product.category_name, 
            image: images[0]?.image_url 
        });
    }
    toast.success(`Added ${quantity} ${product.name} to cart`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6 md:p-10">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      
      {/* Modal Content - Occupies ~3/4 of screen */}
      <div className="relative w-full max-w-6xl max-h-[90vh] bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-10 p-3 bg-white/80 backdrop-blur-md hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all shadow-sm group"
        >
          <X className="w-6 h-6 text-gray-400 group-hover:rotate-90 transition-transform" />
        </button>

        {/* Left: Image Gallery (Full Height on Desktop) */}
        <div className="w-full md:w-1/2 h-[400px] md:h-auto bg-gray-50 relative flex flex-col">
           <div className="flex-1 relative overflow-hidden group">
              {images.length > 0 ? (
                <img 
                  src={images[selectedImage]?.image_url} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-32 h-32 text-gray-200" />
                </div>
              )}

              {hasMultipleImages && (
                <>
                  <button 
                    onClick={() => setSelectedImage(prev => (prev === 0 ? images.length - 1 : prev - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={() => setSelectedImage(prev => (prev === images.length - 1 ? 0 : prev + 1))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
           </div>

           {/* Thumbnails */}
           {hasMultipleImages && (
             <div className="p-6 bg-white flex gap-4 overflow-x-auto custom-scrollbar">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${selectedImage === i ? "border-indigo-600 shadow-lg scale-105" : "border-gray-100 opacity-60 hover:opacity-100"}`}
                  >
                    <img src={img.image_url} className="w-full h-full object-cover" />
                  </button>
                ))}
             </div>
           )}
        </div>

        {/* Right: Product Info and Actions */}
        <div className="flex-1 p-8 md:p-12 overflow-y-auto bg-white flex flex-col">
           <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                 <div className="flex gap-2">
                    {product.category_name && (
                      <span className="px-4 py-1.5 bg-indigo-50 text-indigo-700 text-[10px] font-black rounded-full uppercase tracking-[0.2em]">
                        {product.category_name}
                      </span>
                    )}
                    {product.discount_percentage ? (
                      <span className="px-4 py-1.5 bg-indigo-600 text-white text-[10px] font-black rounded-full uppercase tracking-[0.2em]">
                        {product.discount_percentage}% OFF
                      </span>
                    ) : product.original_price && (
                      <span className="px-4 py-1.5 bg-indigo-600 text-white text-[10px] font-black rounded-full uppercase tracking-[0.2em]">
                        SALE
                      </span>
                    )}
                 </div>
                 <div className="flex gap-2">
                    <button className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Heart className="w-5 h-5" /></button>
                    <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"><Share2 className="w-5 h-5" /></button>
                 </div>
              </div>

              <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase mb-2">{product.name}</h2>
              
              <div className="flex items-center gap-3 mb-6">
                <div className="flex text-yellow-400">
                   {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">(4.9 • 120 Reviews)</span>
              </div>

              <div className="flex items-baseline gap-4 mb-8">
                <span className="text-5xl font-black text-indigo-600 tracking-tighter">Ksh {Number(product.price).toLocaleString()}</span>
                {product.original_price && (
                  <span className="text-xl text-gray-300 font-black line-through">Ksh {Number(product.original_price).toLocaleString()}</span>
                )}
              </div>

              <div className="space-y-6">
                <p className="text-gray-500 font-medium leading-relaxed text-lg italic">
                  "{product.description || "Premium quality product carefully selected for you."}"
                </p>

                {product.branch_name && (
                  <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-[2rem] border border-gray-100">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                       <MapPin className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-900 uppercase tracking-tight">Available at {product.branch_name}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Reserved for local pickup</p>
                    </div>
                  </div>
                )}
              </div>
           </div>

           {/* Actions Fixed at Bottom for Mobile, but contained in flex column */}
           <div className="space-y-8 mt-12">
              <div className="flex flex-col sm:flex-row gap-6">
                 <div className="flex items-center bg-gray-100 rounded-[2rem] p-2 h-16 shadow-inner">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 bg-white rounded-[1.5rem] flex items-center justify-center text-gray-900 hover:text-indigo-600 transition-all shadow-sm active:scale-95"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="flex-1 min-w-[60px] text-center font-black text-xl">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="w-12 h-12 bg-white rounded-[1.5rem] flex items-center justify-center text-gray-900 hover:text-indigo-600 transition-all shadow-sm active:scale-95"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                 </div>

                 <button
                   disabled={product.stock === 0}
                   onClick={handleAddToCart}
                   className="flex-1 h-16 bg-black text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all shadow-2xl active:scale-[0.98] disabled:opacity-50"
                 >
                   <ShoppingBag className="w-6 h-6" />
                   {product.stock === 0 ? "Out of Stock" : `ADD TO CART • Ksh ${(Number(product.price) * quantity).toLocaleString()}`}
                 </button>
              </div>

              <div className="grid grid-cols-3 gap-6">
                {[
                  { icon: ShieldCheck, label: "Genuine", color: "text-emerald-500" },
                  { icon: Truck, label: "Express", color: "text-blue-500" },
                  { icon: RefreshCcw, label: "Refunds", color: "text-orange-500" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
                    <item.icon className={`w-4 h-4 ${item.color}`} />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter whitespace-nowrap">{item.label}</span>
                  </div>
                ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
