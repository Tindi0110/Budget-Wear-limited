"use client";

import { 
  ShoppingBag, 
  Clock, 
  MapPin, 
  User, 
  ChevronRight,
  MoreVertical,
  CheckCircle,
  XCircle,
  Truck,
  X
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";

const statusStyles: Record<string, string> = {
  "DELIVERED": "bg-green-50 text-green-700 border-green-100",
  "PENDING": "bg-yellow-50 text-yellow-700 border-yellow-100",
  "PROCESSING": "bg-blue-50 text-blue-700 border-blue-100",
  "SHIPPED": "bg-indigo-50 text-indigo-700 border-indigo-100",
  "CANCELLED": "bg-red-50 text-red-700 border-red-100",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const data = await api.get('/orders/');
      setOrders(data);
    } catch (error) {
      toast.error("Failed to fetch orders");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (status: string) => {
    if (!selectedOrder) return;
    try {
      const updated = await api.patch(`/orders/${selectedOrder.id}/`, { status });
      setOrders(orders.map(o => o.id === updated.id ? updated : o));
      setSelectedOrder(updated);
      toast.success("Order status updated");
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DELIVERED': return <CheckCircle className="w-3.5 h-3.5 mr-1.5" />;
      case 'PENDING': return <Clock className="w-3.5 h-3.5 mr-1.5" />;
      case 'SHIPPED': return <Truck className="w-3.5 h-3.5 mr-1.5" />;
      case 'CANCELLED': return <XCircle className="w-3.5 h-3.5 mr-1.5" />;
      default: return <Clock className="w-3.5 h-3.5 mr-1.5" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
        {isLoading ? (
          <div className="p-20 text-center">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Order Details</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Branch</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900 font-mono">#{order.id.slice(0, 8)}</span>
                        <span className="text-[10px] text-gray-500 flex items-center mt-1 uppercase font-bold tracking-wider">
                          <Clock className="w-3 h-3 mr-1" /> {new Date(order.created_at).toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                         <div className="w-7 h-7 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 text-[10px] font-bold">
                           {(order.customer_name || 'G').split(' ').map((n: string) => n[0]).join('')}
                         </div>
                         <span className="text-sm text-gray-700 font-medium">{order.customer_name || 'Guest'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                      {order.branch_name}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">
                      Ksh {Number(order.total).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-widest ${statusStyles[order.status] || 'bg-gray-100'}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => { setSelectedOrder(order); setIsModalOpen(true); }}
                        className="text-gray-400 hover:text-indigo-600 p-2 hover:bg-indigo-50 rounded-lg transition-all" 
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center text-gray-500 font-bold uppercase tracking-widest">
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center shadow-lg">
                    <ShoppingBag className="w-6 h-6" />
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-gray-900 tracking-tighter uppercase whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">#{selectedOrder.id}</h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{new Date(selectedOrder.created_at).toLocaleString()}</p>
                 </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full hover:bg-white flex items-center justify-center text-gray-400 hover:text-black transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-10 space-y-8">
               <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</p>
                     <p className="text-lg font-black text-gray-900">{selectedOrder.customer_name || 'Guest'}</p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Branch Location</p>
                     <p className="text-lg font-black text-gray-900">{selectedOrder.branch_name}</p>
                  </div>
               </div>

               <div className="bg-gray-50 rounded-3xl p-6">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Ordered Items</p>
                  <div className="space-y-4 max-h-[200px] overflow-y-auto pr-2">
                     {selectedOrder.items?.map((item: any, idx: number) => (
                       <div key={idx} className="flex justify-between items-center text-sm font-bold text-gray-900">
                          <span>{item.product_name} x {item.quantity}</span>
                          <span className="text-xs bg-white px-2 py-1 rounded-lg">Ksh {Number(item.price * item.quantity).toLocaleString()}</span>
                       </div>
                     ))}
                     <div className="flex justify-between items-center text-sm font-black text-indigo-600 pt-4 border-t border-gray-200 text-base">
                        <span>TOTAL</span>
                        <span>Ksh {Number(selectedOrder.total).toLocaleString()}</span>
                     </div>
                  </div>
               </div>

               <div className="flex items-center justify-between gap-6 pt-4">
                  <div className="flex-1 space-y-3">
                     <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Update Status</label>
                     <select 
                       className="w-full h-14 px-6 bg-gray-50 border border-gray-100 rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-black text-sm uppercase"
                       defaultValue={selectedOrder.status}
                       id="statusSelect"
                     >
                        <option value="PENDING">Pending</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                     </select>
                  </div>
                  <button 
                    onClick={() => {
                      const select = document.getElementById('statusSelect') as HTMLSelectElement;
                      handleUpdateStatus(select.value);
                    }}
                    className="h-14 px-8 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl mt-6 active:scale-95"
                  >
                     Apply Update
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
