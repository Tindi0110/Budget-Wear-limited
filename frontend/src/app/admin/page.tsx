"use client";

import Link from "next/link";
import { 
  ShoppingBag, 
  Users, 
  Package, 
  TrendingUp, 
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  X
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const stats = [
  { name: "Total Revenue", value: "Ksh 45,280", icon: TrendingUp, change: "+12.5%", trend: "up" },
  { name: "Active Orders", value: "12", icon: ShoppingBag, change: "+3", trend: "up" },
  { name: "Total Products", value: "124", icon: Package, change: "-2%", trend: "down" },
  { name: "Total Staff", value: "8", icon: Users, change: "0", trend: "neutral" },
];

export default function AdminDashboard() {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const recentOrders = [
    { id: "ORD-2024-1", customer: "John Doe", email: "john@example.com", status: "Pending", total: 2450, date: "2024-03-07 15:30", branch: "Nairobi" },
    { id: "ORD-2024-2", customer: "Jane Smith", email: "jane@example.com", status: "Delivered", total: 4500, date: "2024-03-07 14:30", branch: "Nairobi" },
    { id: "ORD-2024-3", customer: "Mike Ross", email: "mike@example.com", status: "In Transit", total: 1800, date: "2024-03-07 12:45", branch: "Nakuru" },
    { id: "ORD-2024-4", customer: "Harvey Specter", email: "harvey@example.com", status: "Pending", total: 6700, date: "2024-03-07 10:20", branch: "Mombasa" },
    { id: "ORD-2024-5", customer: "Rachel Zane", email: "rachel@example.com", status: "Delivered", total: 3200, date: "2024-03-07 09:15", branch: "Nairobi" },
  ];
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${
                stat.trend === "up" ? "bg-green-50 text-green-700" : 
                stat.trend === "down" ? "bg-red-50 text-red-700" : 
                "bg-gray-50 text-gray-600"
              }`}>
                {stat.trend === "up" ? <ArrowUpRight className="w-3 h-3 mr-1" /> : 
                 stat.trend === "down" ? <ArrowDownRight className="w-3 h-3 mr-1" /> : null}
                {stat.change}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h3 className="font-bold text-gray-900">Recent Orders</h3>
            <Link href="/admin/orders" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map((order) => (
                  <tr 
                    key={order.id} 
                    onClick={() => { setSelectedOrder(order); setIsModalOpen(true); }}
                    className="hover:bg-gray-50/50 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-700 font-mono">{order.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                          {order.customer.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-sm text-gray-900 font-medium">{order.customer}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === "Delivered" ? "bg-green-100 text-green-800" :
                        order.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                        "bg-blue-100 text-blue-800"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">
                      <div className="flex items-center justify-between">
                        <span>Ksh {order.total.toLocaleString()}</span>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-6">Systen Activity</h3>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center relative z-10">
                    <Clock className="w-4 h-4 text-gray-500" />
                  </div>
                  {i < 4 && <div className="absolute top-8 left-4 w-px h-full bg-gray-100 -translate-x-1/2"></div>}
                </div>
                <div>
                  <p className="text-sm text-gray-900 font-medium">New product added to Nairobi Branch</p>
                  <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
