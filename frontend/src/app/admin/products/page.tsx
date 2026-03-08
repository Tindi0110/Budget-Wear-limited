"use client";

import { useState, useEffect } from "react";
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
import { api } from "@/lib/api";

interface Branch {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  stock: number;
  branch: string;
  category: string;
  category_name?: string;
  branch_name?: string;
  images?: Array<{ image_url: string }>;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [prodData, catData, branchData] = await Promise.all([
        api.get('/products/'),
        api.get('/categories/'),
        api.get('/branches/')
      ]);
      setProducts(prodData);
      setCategories(catData);
      setBranches(branchData);
    } catch (error) {
      toast.error("Failed to fetch data");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setProductToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await api.delete(`/products/${productToDelete}/`);
      setProducts(products.filter(p => p.id !== productToDelete));
      toast.success("Product deleted successfully");
      setShowDeleteModal(false);
      setProductToDelete(null);
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const productData = {
      name: formData.get('name'),
      price: formData.get('price'),
      stock: formData.get('stock'),
      category: formData.get('category'),
      branch: formData.get('branch'),
      description: formData.get('description'),
    };

    try {
      if (editingProduct) {
        const updated = await api.put(`/products/${editingProduct.id}/`, productData);
        setProducts(products.map(p => p.id === updated.id ? updated : p));
        toast.success("Product updated successfully");
      } else {
        const created = await api.post('/products/', productData);
        setProducts([...products, created]);
        toast.success("Product created successfully");
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error(editingProduct ? "Failed to update product" : "Failed to create product");
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-gray-900"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-bold">
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <button 
            onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-bold shadow-md shadow-indigo-200 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Product</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Category</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Price</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Stock</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Branch</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-100">
                           {product.images && product.images.length > 0 ? (
                             <img src={product.images[0].image_url} className="w-full h-full object-cover" />
                           ) : (
                             <Package className="w-6 h-6 text-gray-300" />
                           )}
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-900 line-clamp-1">{product.name}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">#{product.id.substring(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600 font-bold">{product.category_name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-black text-gray-900">Ksh {Number(product.price).toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600 font-bold">{product.stock} pcs</span>
                    </td>
                     <td className="px-6 py-4">
                      <span className="text-sm text-gray-600 font-bold">{product.branch_name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        product.stock > 10 ? "bg-green-50 text-green-700" :
                        product.stock > 0 ? "bg-orange-50 text-orange-700" :
                        "bg-red-50 text-red-700"
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                          product.stock > 10 ? "bg-green-500" :
                          product.stock > 0 ? "bg-orange-500" :
                          "bg-red-500"
                        }`} />
                        {product.stock > 10 ? "In Stock" : product.stock > 0 ? "Low Stock" : "Out of Stock"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
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
                {!isLoading && filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-20 text-center text-gray-500 font-bold">
                      No products found. Start by adding one!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-black font-black transition-all">X</button>
            </div>
            
            <form className="p-8 grid grid-cols-2 gap-6" onSubmit={handleSubmit}>
              <div className="col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Product Name</label>
                <input 
                  name="name"
                  type="text" 
                  defaultValue={editingProduct?.name || ''}
                  placeholder="e.g. Vintage Oversized Hoodie" 
                  className="w-full h-14 px-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Price (Ksh)</label>
                <input 
                  name="price"
                  type="number" 
                  defaultValue={editingProduct?.price || ''}
                  className="w-full h-14 px-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Stock Quantity</label>
                <input 
                  name="stock"
                  type="number" 
                  defaultValue={editingProduct?.stock || ''}
                  className="w-full h-14 px-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Category</label>
                <select 
                  name="category"
                  defaultValue={editingProduct?.category || ''}
                  className="w-full h-14 px-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold appearance-none"
                  required
                >
                   <option value="">Select Category</option>
                   {categories.map(cat => (
                     <option key={cat.id} value={cat.id}>{cat.name}</option>
                   ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Branch</label>
                <select 
                  name="branch"
                  defaultValue={editingProduct?.branch || ''}
                  className="w-full h-14 px-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold appearance-none"
                  required
                >
                   <option value="">Select Branch</option>
                   {branches.map(br => (
                     <option key={br.id} value={br.id}>{br.name}</option>
                   ))}
                </select>
              </div>

              <div className="col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Description</label>
                <textarea 
                  name="description"
                  defaultValue={editingProduct?.description || ''}
                  rows={3}
                  placeholder="Tell us about this product..."
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-gray-900"
                  required
                />
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
             <p className="text-gray-500 mb-10 leading-relaxed font-bold">
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
