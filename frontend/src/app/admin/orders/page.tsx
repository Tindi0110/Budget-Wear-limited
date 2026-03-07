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
  Truck
} from "lucide-react";

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
                    <button className="text-gray-400 hover:text-indigo-600 p-2 hover:bg-indigo-50 rounded-lg transition-all" title="View details">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
