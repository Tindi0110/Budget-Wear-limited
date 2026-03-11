"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Trash2, 
  Edit, 
  Flame, 
  ToggleLeft, 
  ToggleRight,
  Upload,
  Calendar,
  Package
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";

interface Product {
  id: string;
  name: string;
}

interface FlashSale {
  id: string;
  title: string;
  end_time: string;
  products: string[]; // List of product IDs
  image_url?: string;
  is_active: boolean;
  created_at?: string;
}

export default function AdminFlashSales() {
  const [flashSales, setFlashSales] = useState<FlashSale[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState<string | null>(null);
  const [editingSale, setEditingSale] = useState<FlashSale | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [title, setTitle] = useState("");
  const [endTime, setEndTime] = useState<string>("");
  const [imageUrl, setImageUrl] = useState("");
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      const [fsData, prodData] = await Promise.all([
        api.get('/flash-sales/'),
        api.get('/products/')
      ]);
      setFlashSales(fsData);
      setAllProducts(prodData);
    } catch (error) {
      toast.error("Failed to load flash sales data");
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingSale(null);
    setTitle("");
    setEndTime("");
    setImageUrl("");
    setSelectedProductIds([]);
    setIsModalOpen(true);
  };

  const openEditModal = (sale: FlashSale) => {
    setEditingSale(sale);
    setTitle(sale.title);
    // Format timestamp for datetime-local input
    const formattedDate = new Date(sale.end_time).toISOString().slice(0, 16);
    setEndTime(formattedDate);
    setImageUrl(sale.image_url || "");
    setSelectedProductIds(sale.products);
    setIsModalOpen(true);
  };

  const handleToggleProduct = (productId: string) => {
    setSelectedProductIds(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId]
    );
  };

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    const toastId = toast.loading("Uploading flash sale poster...");
    try {
      const response = await api.upload('/upload/', file, 'image');
      setImageUrl(response.url);
      toast.success("Poster uploaded successfully", { id: toastId });
    } catch (err) {
      toast.error("Failed to upload poster", { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !endTime || selectedProductIds.length === 0) {
      toast.error("Please fill in all required fields and select at least one product.");
      return;
    }

    const payload = {
      title,
      end_time: new Date(endTime).toISOString(),
      products: selectedProductIds,
      image_url: imageUrl || null
    };

    try {
      if (editingSale) {
        const updated = await api.put(`/flash-sales/${editingSale.id}/`, payload);
        setFlashSales(flashSales.map(f => f.id === updated.id ? updated : f));
        toast.success("Flash Sale updated successfully");
      } else {
        const created = await api.post('/flash-sales/', payload);
        setFlashSales([...flashSales, created]);
        toast.success("Flash Sale created successfully");
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  const handleDelete = async () => {
    if (!saleToDelete) return;
    try {
      await api.delete(`/flash-sales/${saleToDelete}/`);
      setFlashSales(flashSales.filter(f => f.id !== saleToDelete));
      toast.success("Flash Sale deleted");
      setShowDeleteModal(false);
      setSaleToDelete(null);
    } catch (error) {
      toast.error("Failed to delete Flash Sale");
    }
  };

  const toggleActive = async (sale: FlashSale) => {
    try {
      // Typically the API might handle full updates, so we patch or just put
      const updated = await api.put(`/flash-sales/${sale.id}/`, { ...sale, is_active: !sale.is_active });
      setFlashSales(flashSales.map(f => f.id === updated.id ? updated : f));
      toast.success(updated.is_active ? "Flash Sale Activated" : "Flash Sale Paused");
    } catch (error) {
      toast.error("Failed to toggle status");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">FLASH SALES & CAMPAIGNS</h2>
          <p className="text-sm text-gray-500 mt-1 font-medium italic">Manage time-limited offers and campaign posters.</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="bg-black text-white px-6 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-orange-600 transition-all shadow-xl active:scale-95 text-xs uppercase tracking-widest"
        >
          <Plus className="w-5 h-5" />
          Create Flash Sale
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden min-h-[400px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-50">
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] w-32">Poster</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Campaign Name</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">End Time</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Products</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                 {flashSales.length === 0 && (
                   <tr>
                      <td colSpan={6} className="text-center py-12 text-sm text-gray-500 font-bold uppercase tracking-widest">No Flash Sales Created</td>
                   </tr>
                 )}
                {flashSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="px-8 py-4">
                      <div className="w-24 h-16 rounded-xl bg-gray-100 overflow-hidden border border-gray-200">
                         {sale.image_url ? (
                           <img src={sale.image_url} alt={sale.title} className="w-full h-full object-cover" />
                         ) : (
                           <div className="w-full h-full flex items-center justify-center"><Flame className="w-6 h-6 text-orange-200" /></div>
                         )}
                      </div>
                    </td>
                    <td className="px-8 py-6 font-black text-gray-900 uppercase tracking-tight">
                      {sale.title}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                         <Calendar className="w-4 h-4 text-orange-400" />
                         {new Date(sale.end_time).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-8 py-6 font-bold text-gray-500">
                       <div className="flex items-center gap-2 text-xs">
                          <Package className="w-4 h-4 text-gray-400" />
                          {sale.products.length} Items included
                       </div>
                    </td>
                    <td className="px-8 py-6">
                      <button 
                        onClick={() => toggleActive(sale)}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-colors ${sale.is_active ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'}`}
                      >
                        {sale.is_active ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                        {sale.is_active ? 'Active' : 'Paused'}
                      </button>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openEditModal(sale)}
                          className="p-3 text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => { setSaleToDelete(sale.id); setShowDeleteModal(true); }}
                          className="p-3 text-red-600 bg-red-50 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-[2rem] w-full max-w-2xl relative z-10 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-8 border-b border-gray-100 bg-gray-50/50 flex-shrink-0">
               <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">
                 {editingSale ? "Edit Campaign" : "New Flash Sale Campaign"}
               </h3>
               <p className="text-sm font-medium text-gray-500 mt-2">Create a time-limited event and select participating items.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Campaign Title</label>
                   <input 
                     type="text" 
                     value={title}
                     onChange={(e) => setTitle(e.target.value)}
                     className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all"
                     required
                   />
                 </div>
                 
                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">End Time</label>
                   <input 
                     type="datetime-local" 
                     value={endTime}
                     onChange={(e) => setEndTime(e.target.value)}
                     className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all"
                     required
                   />
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Campaign Poster URL (or Upload)</label>
                 <div className="flex gap-2">
                    <input 
                      type="url" 
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://... or click upload"
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all"
                    />
                    <label className="bg-orange-100 text-orange-600 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center hover:bg-orange-200 cursor-pointer transition-all active:scale-95">
                      {isUploading ? <div className="w-5 h-5 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" /> : <Upload className="w-5 h-5" />}
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleImageUpload(e.target.files[0]);
                        }
                      }} />
                    </label>
                 </div>
                 {imageUrl && (
                   <div className="mt-4 h-48 rounded-2xl border border-gray-200 bg-gray-50 overflow-hidden relative">
                     <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                     <div className="absolute top-2 right-2 bg-black/50 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest backdrop-blur-sm">PREVIEW</div>
                   </div>
                 )}
              </div>

              <div className="space-y-4">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Target Products ({selectedProductIds.length} selected)</label>
                 <div className="bg-gray-50 rounded-2xl border border-gray-200 p-4 max-h-60 overflow-y-auto space-y-2">
                   {allProducts.map(product => (
                     <label key={product.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white transition-colors cursor-pointer border border-transparent hover:border-gray-100 shadow-sm">
                       <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${selectedProductIds.includes(product.id) ? 'bg-orange-600 border-orange-600' : 'bg-white border-gray-300'}`}>
                          {selectedProductIds.includes(product.id) && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                       </div>
                       <span className="text-sm font-bold text-gray-700">{product.name}</span>
                     </label>
                   ))}
                 </div>
              </div>
            </form>

            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3 flex-shrink-0">
               <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-colors">
                 Cancel
               </button>
               <button onClick={handleSubmit} className="px-8 py-3 bg-black text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-orange-600 transition-colors shadow-xl">
                 Save Campaign
               </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)}></div>
          <div className="bg-white rounded-3xl p-8 max-w-md w-full relative z-10 shadow-2xl text-center space-y-6">
            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trash2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">END CAMPAIGN FOREVER?</h3>
            <p className="text-gray-500 font-medium leading-relaxed">This action cannot be undone. This flash sale will be permanently archived.</p>
            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50 rounded-2xl transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-700 shadow-xl shadow-red-200 transition-all active:scale-95"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
