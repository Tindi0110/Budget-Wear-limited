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
import { useState } from "react";
import { toast } from "sonner";

const orders = [
  { id: "ORD-2024-001", customer: "Jane Smith", branch: "Nairobi", total: 4500, status: "Delivered", date: "2024-03-07 14:30" },
  { id: "ORD-2024-002", customer: "Robert King", branch: "Nakuru", total: 1200, status: "Pending", date: "2024-03-07 15:45" },
  { id: "ORD-2024-003", customer: "Alice Brown", branch: "Mombasa", total: 3200, status: "In Transit", date: "2024-03-07 16:10" },
  { id: "ORD-2024-004", customer: "Samuel Otieno", branch: "Eldoret", total: 2800, status: "Cancelled", date: "2024-03-07 09:20" },
];

const statusStyles = {
  "Delivered": "bg-green-50 text-green-700 border-green-100",
  "Pending": "bg-yellow-50 text-yellow-700 border-yellow-100",
  "In Transit": "bg-blue-50 text-blue-700 border-blue-100",
  "Cancelled": "bg-red-50 text-red-700 border-red-100",
};

const statusIcons = {
  "Delivered": <CheckCircle className="w-3.5 h-3.5 mr-1.5" />,
  "Pending": <Clock className="w-3.5 h-3.5 mr-1.5" />,
  "In Transit": <Truck className="w-3.5 h-3.5 mr-1.5" />,
  "Cancelled": <XCircle className="w-3.5 h-3.5 mr-1.5" />,
};

export default function AdminOrders() {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
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
                      <span className="text-sm font-bold text-gray-900 font-mono">{order.id}</span>
                      <span className="text-xs text-gray-500 flex items-center mt-1">
                        <Clock className="w-3 h-3 mr-1" /> {order.date}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <div className="w-7 h-7 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 text-[10px] font-bold">
                         {order.customer.split(' ').map(n => n[0]).join('')}
                       </div>
                       <span className="text-sm text-gray-700 font-medium">{order.customer}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      {order.branch}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">
                    Ksh {order.total.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyles[order.status as keyof typeof statusStyles]}`}>
                      {statusIcons[order.status as keyof typeof statusIcons]}
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => { setSelectedOrder(order); setIsModalOpen(true); }}
                      className="text-gray-400 hover:text-indigo-600 p-2 hover:bg-indigo-50 rounded-lg transition-all" 
                      title="View details"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100">
                    <ShoppingBag className="w-6 h-6" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">{selectedOrder.id}</h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{selectedOrder.date}</p>
                 </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full hover:bg-white flex items-center justify-center text-gray-400 hover:text-black transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-10 space-y-8">
               <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer Information</p>
                     <p className="text-lg font-black text-gray-900">{selectedOrder.customer}</p>
                     <p className="text-sm text-gray-500 font-medium">customer@example.com</p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Shipping Location</p>
                     <p className="text-lg font-black text-gray-900">{selectedOrder.branch} Branch</p>
                     <p className="text-sm text-gray-500 font-medium">Main pickup station</p>
                  </div>
               </div>

               <div className="bg-gray-50 rounded-3xl p-6">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Ordered Items</p>
                  <div className="space-y-4">
                     <div className="flex justify-between items-center text-sm font-bold text-gray-900">
                        <span>Blue Denim Jacket x 1</span>
                        <span>Ksh 2,500</span>
                     </div>
                     <div className="flex justify-between items-center text-sm font-bold text-gray-900">
                        <span>Black Cargo Pants x 1</span>
                        <span>Ksh 1,800</span>
                     </div>
                     <div className="flex justify-between items-center text-sm font-black text-indigo-600 pt-4 border-t border-gray-200 text-base">
                        <span>TOTAL</span>
                        <span>Ksh {selectedOrder.total.toLocaleString()}</span>
                     </div>
                  </div>
               </div>

               <div className="flex items-center justify-between gap-6">
                  <div className="flex-1 space-y-3">
                     <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Update Order Status</label>
                     <select className="w-full h-14 px-6 bg-gray-50 border border-gray-100 rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-sm">
                        <option>Pending</option>
                        <option>In Transit</option>
                        <option>Delivered</option>
                        <option>Cancelled</option>
                     </select>
                  </div>
                  <button 
                    onClick={() => { setIsModalOpen(false); toast.success("Order status successfully updated!"); }}
                    className="h-14 px-8 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl mt-6"
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
