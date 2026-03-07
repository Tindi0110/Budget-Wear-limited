"use client";

import { Plus, Search, Edit2, Trash2, Folder } from "lucide-react";

const categories = [
  { id: "1", name: "Men", icon: "Shirt", items: 45 },
  { id: "2", name: "Women", icon: "ShoppingBag", items: 112 },
  { id: "3", name: "Kids", icon: "Baby", items: 28 },
  { id: "4", name: "Shoes", icon: "Footprints", items: 64 },
  { id: "5", name: "Bales", icon: "Box", items: 12 },
];

export default function AdminCategories() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
         <h2 className="text-2xl font-black text-gray-900">Manage Categories</h2>
         <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95">
            <Plus className="w-5 h-5" />
            New Category
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
             <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                   <Folder className="w-7 h-7" />
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                      <Edit2 className="w-4 h-4" />
                   </button>
                   <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                      <Trash2 className="w-4 h-4" />
                   </button>
                </div>
             </div>
             <h3 className="text-lg font-black text-gray-900">{cat.name}</h3>
             <p className="text-sm text-gray-500 font-medium mt-1">{cat.items} Products</p>
          </div>
        ))}
      </div>
    </div>
  );
}
