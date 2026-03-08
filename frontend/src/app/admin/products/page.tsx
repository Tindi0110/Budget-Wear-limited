"use client";

import { useState } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Eye,
  ExternalLink,
  Package 
} from "lucide-react";
import { toast } from "sonner";

const products = [
  { id: "1", name: "Blue Denim Jacket", category: "Men", price: 2500, stock: 15, branch: "Nairobi", status: "In Stock" },
  { id: "2", name: "Nike Air Sneakers", category: "Shoes", price: 3200, stock: 8, branch: "Nakuru", status: "Low Stock" },
  { id: "3", name: "Red Summer Dress", category: "Women", price: 2100, stock: 0, branch: "Mombasa", status: "Out of Stock" },
  { id: "4", name: "Kids Winter Jacket", category: "Kids", price: 1500, stock: 24, branch: "Eldoret", status: "In Stock" },
];

export default function AdminProducts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const handleDeleteClick = (id: string) => {
    setProductToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    toast.success("Product deleted successfully");
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium">
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <button 
            onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-medium shadow-md shadow-indigo-200 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Branch</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-100">
                         <Package className="w-6 h-6 text-gray-300" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 line-clamp-1">{product.name}</p>
                        <p className="text-xs text-gray-500 font-mono">#{product.id.padStart(4, '0')}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600 font-medium">{product.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-gray-900">Ksh {product.price.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{product.stock} pcs</span>
                  </td>
                   <td className="px-6 py-4">
                    <span className="text-sm text-gray-600 font-medium">{product.branch}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.status === "In Stock" ? "bg-green-50 text-green-700" :
                      product.status === "Low Stock" ? "bg-orange-50 text-orange-700" :
                      "bg-red-50 text-red-700"
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                        product.status === "In Stock" ? "bg-green-500" :
                        product.status === "Low Stock" ? "bg-orange-500" :
                        "bg-red-500"
                      }`} />
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 transition-all">
                      <button className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="View details">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" 
                        title="Edit product"
                        onClick={() => { setEditingProduct(product); setIsModalOpen(true); }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" 
                        title="Delete product"
                        onClick={() => handleDeleteClick(product.id)}
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
        
        {/* Pagination Placeholder */}
        <div className="p-4 border-t border-gray-50 flex items-center justify-between bg-gray-50/30">
          <p className="text-sm text-gray-500">Showing 1 to 4 of 124 results</p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 text-sm font-medium text-gray-500 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 text-sm font-medium text-indigo-600 bg-white border border-indigo-200 rounded-lg shadow-sm">1</button>
            <button className="px-3 py-1 text-sm font-medium text-gray-600 hover:bg-white hover:border-gray-300 rounded-lg">2</button>
            <button className="px-3 py-1 text-sm font-medium text-gray-600 hover:bg-white hover:border-gray-300 rounded-lg">3</button>
            <button className="px-3 py-1 text-sm font-medium text-gray-500 border border-gray-200 rounded-lg hover:bg-white">Next</button>
          </div>
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-black font-black">X</button>
            </div>
            
            <form className="p-8 grid grid-cols-2 gap-6" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); toast.success(editingProduct ? "Product updated" : "Product created"); }}>
              <div className="col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Product Name</label>
                <input 
                  type="text" 
                  defaultValue={editingProduct?.name || ''}
                  placeholder="e.g. Vintage Oversized Hoodie" 
                  className="w-full h-14 px-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Price (Ksh)</label>
                <input 
                  type="number" 
                  defaultValue={editingProduct?.price || ''}
                  className="w-full h-14 px-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Stock Quantity</label>
                <input 
                  type="number" 
                  defaultValue={editingProduct?.stock || ''}
                  className="w-full h-14 px-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Category</label>
                <select className="w-full h-14 px-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold">
                   <option>Men</option>
                   <option>Women</option>
                   <option>Kids</option>
                   <option>Shoes</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Branch</label>
                <select className="w-full h-14 px-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold">
                   <option>Nairobi</option>
                   <option>Nakuru</option>
                   <option>Mombasa</option>
                   <option>Eldoret</option>
                </select>
              </div>

              <div className="col-span-2 py-4">
                <button 
                  type="submit"
                  className="w-full py-5 bg-black text-white rounded-2xl font-black text-lg hover:bg-indigo-600 transition-all shadow-xl shadow-gray-200 uppercase tracking-tighter"
                >
                  {editingProduct ? 'Update Product' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-300">
             <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mb-8">
                <Trash2 className="w-10 h-10 text-red-600" />
             </div>
             <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tighter">Confirm Deletion</h3>
             <p className="text-gray-500 mb-10 leading-relaxed font-medium">
               Are you sure you want to delete this product? This action is permanent and cannot be undone.
             </p>
             <div className="flex gap-4">
               <button 
                 onClick={() => setShowDeleteModal(false)}
                 className="flex-1 h-14 rounded-2xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-all"
               >
                 Cancel
               </button>
               <button 
                 onClick={confirmDelete}
                 className="flex-1 h-14 rounded-2xl bg-red-600 text-white font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200"
               >
                 Delete Now
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
