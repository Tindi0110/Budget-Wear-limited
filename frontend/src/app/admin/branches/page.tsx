"use client";

import { Plus, MapPin, Phone, Clock, Edit2, Trash2, Building2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const branches = [
  { id: "1", name: "Nairobi CBD", location: "Tom Mboya Street", type: "Thrift Store", status: "Open" },
  { id: "2", name: "Nakuru Town", location: "Kenyatta Ave", type: "Thrift Store", status: "Open" },
  { id: "3", name: "Mombasa Nyali", location: "Nyali Center", type: "Thrift Store", status: "Closed" },
  { id: "4", name: "Baby Shop Branch", location: "Nairobi Mall", type: "Baby Shop", status: "Open" },
];

export default function AdminBranches() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<any>(null);
  const [locs, setLocs] = useState(branches);
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {locs.map((br) => (
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
                      onClick={() => { setLocs(locs.filter(l => l.id !== br.id)); toast.error("Branch deleted"); }}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    >
                       <Trash2 className="w-4 h-4" />
                    </button>
                </div>
             </div>
             
             <div className="space-y-4">
                <div>
                   <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                     br.status === "Open" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                   }`}>
                     {br.status}
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
                   <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{br.type}</span>
                   <button className="text-sm font-bold text-indigo-600 hover:underline">View Staff</button>
                </div>
             </div>
          </div>
        ))}
      </div>

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
            
            <form className="p-10 space-y-6" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); toast.success(editingBranch ? "Branch updated" : "Branch added"); }}>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Branch Name</label>
                <input 
                  type="text" 
                  defaultValue={editingBranch?.name || ''}
                  placeholder="e.g. Kisumu Dala" 
                  className="w-full h-14 px-6 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Location Details</label>
                <input 
                  type="text" 
                  defaultValue={editingBranch?.location || ''}
                  placeholder="e.g. Mega Plaza, Floor 2" 
                  className="w-full h-14 px-6 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Store Type</label>
                  <select className="w-full h-14 px-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold">
                     <option>Thrift Store</option>
                     <option>Baby Shop</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Opening Status</label>
                  <select className="w-full h-14 px-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold">
                     <option>Open</option>
                     <option>Closed</option>
                  </select>
                </div>
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
