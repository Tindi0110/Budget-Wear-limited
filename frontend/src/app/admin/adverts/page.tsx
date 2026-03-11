"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Megaphone,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
  Image as ImageIcon,
  X
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";

interface Advert {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  link?: string;
  is_active: boolean;
  position: number;
}

export default function AdminAdverts() {
  const [adverts, setAdverts] = useState<Advert[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [advertToDelete, setAdvertToDelete] = useState<string | null>(null);
  const [editingAdvert, setEditingAdvert] = useState<Advert | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAdverts();
  }, []);

  const fetchAdverts = async () => {
    try {
      setIsLoading(true);
      const data = await api.get('/adverts/');
      setAdverts(data);
    } catch (error) {
      toast.error("Failed to load advertisements");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setAdvertToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!advertToDelete) return;
    try {
      await api.delete(`/adverts/${advertToDelete}/`);
      setAdverts(adverts.filter(a => a.id !== advertToDelete));
      toast.success("Advertisement deleted");
      setShowDeleteModal(false);
      setAdvertToDelete(null);
    } catch (error) {
      toast.error("Failed to delete advertisement");
    }
  };

  const handleToggleActive = async (advert: Advert) => {
    try {
      const updated = await api.patch(`/adverts/${advert.id}/`, { is_active: !advert.is_active });
      setAdverts(adverts.map(a => a.id === updated.id ? updated : a));
      toast.success(`Advert ${updated.is_active ? 'activated' : 'deactivated'}`);
    } catch (error) {
      toast.error("Failed to toggle status");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const advertData = {
      title: formData.get('title'),
      image_url: formData.get('image_url'),
      link: formData.get('link'),
      position: Number(formData.get('position')),
      description: formData.get('description'),
      is_active: editingAdvert ? editingAdvert.is_active : true
    };

    try {
      if (editingAdvert) {
        const updated = await api.put(`/adverts/${editingAdvert.id}/`, advertData);
        setAdverts(adverts.map(a => a.id === updated.id ? updated : a));
        toast.success("Advertisement updated");
      } else {
        const created = await api.post('/adverts/', advertData);
        setAdverts([...adverts, created]);
        toast.success("Advertisement published");
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">ADVERTISEMENTS</h2>
          <p className="text-sm text-gray-500 mt-1 font-medium italic">Manage homepage banners and promotional campaigns.</p>
        </div>
        <button 
          onClick={() => { setEditingAdvert(null); setIsModalOpen(true); }}
          className="bg-black text-white px-6 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-indigo-600 transition-all shadow-xl shadow-gray-200 active:scale-95 text-xs uppercase tracking-widest"
        >
          <Plus className="w-5 h-5" />
          Create New Advert
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden relative group min-h-[400px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-50">
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Preview</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Advert Details</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Redirect Link</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Live Status</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {adverts.map((advert) => (
                  <tr key={advert.id} className="hover:bg-gray-50/30 transition-colors group/row">
                    <td className="px-8 py-6">
                      <div className="w-40 h-16 rounded-2xl bg-gray-100 overflow-hidden border border-gray-100 shadow-sm transition-transform group-hover/row:scale-105 duration-500">
                        <img src={advert.image_url} alt={advert.title} className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-base font-black text-gray-900 uppercase tracking-tight">{advert.title}</p>
                      <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-black flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        Priority: {advert.position}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-[11px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1.5 rounded-full w-fit">
                        <ExternalLink className="w-3.5 h-3.5" />
                        {advert.link || 'Internal'}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <button 
                        onClick={() => handleToggleActive(advert)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          advert.is_active 
                            ? "bg-green-100 text-green-700 shadow-sm" 
                            : "bg-gray-100 text-gray-400 opacity-60"
                        }`}
                      >
                        {advert.is_active ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                        {advert.is_active ? "Enabled" : "Disabled"}
                      </button>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 transition-all duration-300">
                        <button 
                          onClick={() => { setEditingAdvert(advert); setIsModalOpen(true); }}
                          className="w-10 h-10 bg-white shadow-md border border-gray-100 text-gray-600 hover:text-black hover:border-black rounded-xl flex items-center justify-center transition-all"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(advert.id)}
                          className="w-10 h-10 bg-white shadow-md border border-gray-100 text-gray-600 hover:text-red-500 hover:border-red-500 rounded-xl flex items-center justify-center transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!isLoading && adverts.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center text-gray-500 font-bold uppercase tracking-widest">
                      No advertisements found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modern Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
            <div className="p-10 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-2xl font-black text-gray-900 tracking-tighter flex items-center gap-4">
                <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center shadow-lg">
                  <Megaphone className="w-6 h-6" />
                </div>
                {editingAdvert ? 'EDIT ADVERT' : 'CREATE ADVERT'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full hover:bg-white hover:shadow-md flex items-center justify-center text-gray-400 hover:text-black transition-all font-black">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form className="p-10 space-y-8" onSubmit={handleSubmit}>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 px-1">Campaign Title</label>
                <input 
                  name="title"
                  type="text" 
                  defaultValue={editingAdvert?.title || ''}
                  placeholder="e.g. End of Season Sale" 
                  className="w-full h-16 px-6 bg-gray-50 border border-gray-100 rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-gray-900"
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 px-1">Banner Image URL</label>
                <div className="relative">
                  <ImageIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    name="image_url"
                    type="url" 
                    defaultValue={editingAdvert?.image_url || ''}
                    placeholder="https://images.unsplash.com/..." 
                    className="w-full h-16 pl-16 pr-6 bg-gray-50 border border-gray-100 rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-gray-900"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 px-1">Target Route</label>
                  <input 
                    name="link"
                    type="text" 
                    defaultValue={editingAdvert?.link || ''}
                    placeholder="/products?sale=true" 
                    className="w-full h-16 px-6 bg-gray-50 border border-gray-100 rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-gray-900"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 px-1">Display Priority</label>
                  <input 
                    name="position"
                    type="number" 
                    defaultValue={editingAdvert?.position || 0}
                    className="w-full h-16 px-6 bg-gray-50 border border-gray-100 rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-gray-900"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 px-1">Description (Optional)</label>
                <textarea 
                  name="description"
                  defaultValue={editingAdvert?.description || ''}
                  rows={2}
                  className="w-full p-6 bg-gray-50 border border-gray-100 rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-gray-900"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-6 bg-black text-white rounded-[2rem] font-black text-xl hover:bg-indigo-600 transition-all shadow-2xl shadow-indigo-100 active:scale-[0.98] uppercase tracking-tighter"
              >
                {editingAdvert ? 'SAVE CHANGES' : 'PUBLISH ADVERTISEMENT'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
