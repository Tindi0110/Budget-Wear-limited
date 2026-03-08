"use client";

import { Plus, MapPin, Phone, Clock, Edit2, Trash2, Building2, X } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";

interface Branch {
  id: string;
  name: string;
  location: string;
  type: string; // "thrift_store" or "baby_shop"
}

export default function AdminBranches() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      setIsLoading(true);
      const data = await api.get('/branches/');
      setBranches(data);
    } catch (error) {
      toast.error("Failed to fetch branches");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/branches/${id}/`);
      setBranches(branches.filter(b => b.id !== id));
      toast.success("Branch removed");
    } catch (error) {
      toast.error("Failed to remove branch");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const branchData = {
      name: formData.get('name'),
      location: formData.get('location'),
      type: formData.get('type'),
    };

    try {
      if (editingBranch) {
        const updated = await api.put(`/branches/${editingBranch.id}/`, branchData);
        setBranches(branches.map(b => b.id === updated.id ? updated : b));
        toast.success("Branch updated");
      } else {
        const created = await api.post('/branches/', branchData);
        setBranches([...branches, created]);
        toast.success("Branch added");
      }
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Operation failed");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
         <h2 className="text-2xl font-black text-gray-900">Branch Locations</h2>
         <button 
           onClick={() => { setEditingBranch(null); setIsModalOpen(true); }}
           className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
         >
            <Plus className="w-5 h-5" />
            Add Branch
         </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {branches.map((br) => (
            <div key={br.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
               <div className="flex justify-between items-start mb-6">
                  <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                     <Building2 className="w-8 h-8" />
                  </div>
                  <div className="flex gap-2">
                      <button 
                        onClick={() => { setEditingBranch(br); setIsModalOpen(true); }}
                        className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                      >
                         <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(br.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      >
                         <Trash2 className="w-4 h-4" />
                      </button>
                  </div>
               </div>
               
               <div className="space-y-4">
                  <div>
                     <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-green-50 text-green-700">
                       Active
                     </span>
                     <h3 className="text-2xl font-black text-gray-900 mt-2">{br.name}</h3>
                  </div>

                  <div className="flex flex-col gap-2">
                     <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                        <MapPin className="w-4 h-4 text-indigo-500" />
                        {br.location}
                     </div>
                     <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                        <Clock className="w-4 h-4 text-indigo-500" />
                        08:00 AM - 07:00 PM
                     </div>
                  </div>

                  <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                     <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{br.type.replace('_', ' ')}</span>
                  </div>
               </div>
            </div>
          ))}
          {!isLoading && branches.length === 0 && (
            <div className="col-span-full py-20 text-center text-gray-500 font-bold">
              No branches found. Start by adding one!
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Branch Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
            <div className="p-10 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">
                {editingBranch ? 'Edit Location' : 'Add Location'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full hover:bg-white flex items-center justify-center text-gray-400 hover:text-black transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form className="p-10 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Branch Name</label>
                <input 
                  name="name"
                  type="text" 
                  defaultValue={editingBranch?.name || ''}
                  placeholder="e.g. Kisumu Dala" 
                  className="w-full h-14 px-6 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Location Details</label>
                <input 
                  name="location"
                  type="text" 
                  defaultValue={editingBranch?.location || ''}
                  placeholder="e.g. Mega Plaza, Floor 2" 
                  className="w-full h-14 px-6 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Store Type</label>
                <select 
                  name="type"
                  defaultValue={editingBranch?.type || 'thrift_store'}
                  className="w-full h-14 px-6 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold"
                >
                   <option value="thrift_store">Thrift Store</option>
                   <option value="baby_shop">Baby Shop</option>
                </select>
              </div>

              <button 
                type="submit"
                className="w-full py-5 bg-black text-white rounded-2xl font-black text-lg hover:bg-indigo-600 transition-all shadow-xl shadow-gray-200 uppercase tracking-tighter"
              >
                {editingBranch ? 'Save Changes' : 'Publish Location'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
