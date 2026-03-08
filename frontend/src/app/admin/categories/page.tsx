"use client";

import { Plus, Search, Edit2, Trash2, Folder, X } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";

interface Category {
  id: string;
  name: string;
  icon?: string;
  items?: number; // Optional if backend doesn't provide it yet
}

export default function AdminCategories() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const data = await api.get('/categories/');
      setCategories(data);
    } catch (error) {
      toast.error("Failed to fetch categories");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/categories/${id}/`);
      setCategories(categories.filter(c => c.id !== id));
      toast.success("Category deleted");
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const categoryData = {
      name: formData.get('name'),
      icon: formData.get('icon'),
    };

    try {
      if (editingCategory) {
        const updated = await api.put(`/categories/${editingCategory.id}/`, categoryData);
        setCategories(categories.map(c => c.id === updated.id ? updated : c));
        toast.success("Category updated");
      } else {
        const created = await api.post('/categories/', categoryData);
        setCategories([...categories, created]);
        toast.success("Category created");
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error(editingCategory ? "Failed to update" : "Failed to create");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
         <h2 className="text-2xl font-black text-gray-900">Manage Categories</h2>
         <button 
           onClick={() => { setEditingCategory(null); setIsModalOpen(true); }}
           className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
         >
            <Plus className="w-5 h-5" />
            New Category
         </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
               <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                     <Folder className="w-7 h-7" />
                  </div>
                  <div className="flex gap-2">
                     <button 
                       onClick={() => { setEditingCategory(cat); setIsModalOpen(true); }}
                       className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                     >
                        <Edit2 className="w-4 h-4" />
                     </button>
                     <button 
                       onClick={() => handleDelete(cat.id)}
                       className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                     >
                        <Trash2 className="w-4 h-4" />
                     </button>
                  </div>
               </div>
               <h3 className="text-lg font-black text-gray-900">{cat.name}</h3>
               <p className="text-sm text-gray-500 font-bold mt-1 uppercase tracking-widest text-[10px]">Active Category</p>
            </div>
          ))}
          {!isLoading && categories.length === 0 && (
            <div className="col-span-full py-20 text-center text-gray-500 font-bold">
              No categories found. Start by creating one!
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
            <div className="p-10 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">
                {editingCategory ? 'Edit Category' : 'New Category'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full hover:bg-white flex items-center justify-center text-gray-400 hover:text-black transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form className="p-10 space-y-8" onSubmit={handleSubmit}>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Category Name</label>
                <input 
                  name="name"
                  type="text" 
                  defaultValue={editingCategory?.name || ''}
                  placeholder="e.g. Vintage Wear" 
                  className="w-full h-16 px-6 bg-gray-50 border border-gray-100 rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold"
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Icon Selection</label>
                <select 
                  name="icon"
                  defaultValue={editingCategory?.icon || 'Shirt'}
                  className="w-full h-16 px-6 bg-gray-50 border border-gray-100 rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold"
                >
                   <option value="Shirt">Shirt (Default)</option>
                   <option value="ShoppingBag">ShoppingBag</option>
                   <option value="Baby">Baby</option>
                   <option value="Footprints">Footprints</option>
                   <option value="Box">Box</option>
                </select>
              </div>

              <button 
                type="submit"
                className="w-full py-6 bg-black text-white rounded-[2rem] font-black text-lg hover:bg-indigo-600 transition-all shadow-2xl shadow-gray-200 uppercase tracking-tighter"
              >
                {editingCategory ? 'Update Category' : 'Create Category'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
