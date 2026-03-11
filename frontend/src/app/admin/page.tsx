"use client";

import Link from "next/link";
import {
  ShoppingBag,
  Users,
  Package,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  X,
  ChevronRight,
  BarChart3,
  Clock,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const PIE_COLORS = ["#4f46e5", "#7c3aed", "#ec4899", "#f59e0b", "#10b981", "#3b82f6"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return percent > 0.05 ? (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight="bold">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  ) : null;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl shadow-xl p-4">
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} className="text-sm font-bold" style={{ color: p.color }}>
            {p.name === "revenue" ? `Ksh ${Number(p.value).toLocaleString()}` : `${p.value} orders`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AdminDashboard() {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [branchData, setBranchData] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    fetchDashboardData();
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      await api.get('/ping/');
      setConnectionStatus('online');
    } catch (err) {
      setConnectionStatus('offline');
    }
  };

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const data = await api.get("/dashboard-stats/");
      setStats(data.stats);
      setRecentOrders(data.recent_orders);
      setMonthlyData(data.monthly_data || []);
      setCategoryData(data.category_data || []);
      setBranchData(data.branch_data || []);
      setStatusData(data.status_data || []);
    } catch (error: any) {
      toast.error(`Dashboard Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "DELIVERED": return "bg-green-100 text-green-800";
      case "PENDING": return "bg-yellow-100 text-yellow-800";
      case "PROCESSING": return "bg-blue-100 text-blue-800";
      case "SHIPPED": return "bg-indigo-100 text-indigo-800";
      case "CANCELLED": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const statIcons: Record<string, any> = { TrendingUp, ShoppingBag, Package, Users };

  const Skeleton = ({ className }: { className: string }) => (
    <div className={`bg-gray-100 rounded-2xl animate-pulse ${className}`} />
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Connectivity Status Badge */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Overview</h2>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${
          connectionStatus === 'online' ? 'bg-green-50 text-green-700 border-green-100' :
          connectionStatus === 'offline' ? 'bg-red-50 text-red-700 border-red-100' :
          'bg-gray-50 text-gray-400 border-gray-100'
        }`}>
          <div className={`w-2 h-2 rounded-full animate-pulse ${
            connectionStatus === 'online' ? 'bg-green-500' :
            connectionStatus === 'offline' ? 'bg-red-500' :
            'bg-gray-300'
          }`} />
          Backend {connectionStatus}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {isLoading
          ? [1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-32" />)
          : stats.map((stat) => {
              const Icon = statIcons[stat.icon] || TrendingUp;
              return (
                <div key={stat.name} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 bg-indigo-50 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 transition-colors duration-300">
                      <Icon className="w-5 h-5 text-indigo-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                      stat.trend === "up" ? "bg-green-50 text-green-700" :
                      stat.trend === "down" ? "bg-red-50 text-red-700" :
                      "bg-gray-50 text-gray-500"
                    }`}>
                      {stat.trend === "up" && <ArrowUpRight className="w-3 h-3" />}
                      {stat.trend === "down" && <ArrowDownRight className="w-3 h-3" />}
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 font-medium">{stat.name}</p>
                  <p className="text-2xl font-black text-gray-900 mt-1 tracking-tight">{stat.value}</p>
                </div>
              );
            })
        }
      </div>

      {/* Revenue Chart + Category Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Area Chart: Monthly Revenue */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-black text-gray-900 uppercase tracking-tight">Revenue Trend</h3>
              <p className="text-xs text-gray-400 font-medium mt-0.5">Last 6 months delivery revenue</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl">
              <BarChart3 className="w-3.5 h-3.5" />
              Monthly
            </div>
          </div>
          {isLoading ? (
            <Skeleton className="h-52 w-full" />
          ) : monthlyData.length === 0 ? (
            <div className="h-52 flex items-center justify-center text-gray-400 font-bold text-sm">
              No revenue data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthlyData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af", fontWeight: 700 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af", fontWeight: 700 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" name="revenue" stroke="#4f46e5" strokeWidth={2.5} fill="url(#revenueGrad)" dot={{ fill: "#4f46e5", strokeWidth: 0, r: 4 }} activeDot={{ r: 6, fill: "#4f46e5" }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie Chart: Category Distribution */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="mb-4">
            <h3 className="font-black text-gray-900 uppercase tracking-tight">Category Mix</h3>
            <p className="text-xs text-gray-400 font-medium mt-0.5">Products by category</p>
          </div>
          {isLoading ? (
            <Skeleton className="h-52 w-full" />
          ) : categoryData.length === 0 ? (
            <div className="h-52 flex items-center justify-center text-gray-400 font-bold text-sm">No data</div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" outerRadius={80} dataKey="value" labelLine={false} label={renderCustomizedLabel}>
                    {categoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val, name) => [`${val} products`, name]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-1.5 mt-2">
                {categoryData.slice(0, 6).map((cat, i) => (
                  <div key={cat.name} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                    <span className="text-[10px] text-gray-600 font-bold truncate">{cat.name}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Branch Bar Chart + Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <div>
              <h3 className="font-black text-gray-900 uppercase tracking-tight">Recent Orders</h3>
              <p className="text-xs text-gray-400 font-medium mt-0.5">Latest transactions</p>
            </div>
            <Link href="/admin/orders" className="text-xs font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest bg-indigo-50 px-3 py-1.5 rounded-xl hover:bg-indigo-100 transition-colors">
              View All →
            </Link>
          </div>
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-8 space-y-3">
                {[1,2,3].map(i => <Skeleton key={i} className="h-10 w-full" />)}
              </div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">ID</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      onClick={() => { setSelectedOrder(order); setIsModalOpen(true); }}
                      className="hover:bg-indigo-50/30 transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-4 text-xs font-mono font-bold text-gray-500">#{order.id.slice(0, 8)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-black text-[10px] flex-shrink-0">
                            {(order.customer_name || "G")[0]}
                          </div>
                          <span className="text-sm text-gray-900 font-bold">{order.customer_name || "Guest"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-black text-gray-900">Ksh {Number(order.total).toLocaleString()}</span>
                          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-500 transition-colors" />
                        </div>
                      </td>
                    </tr>
                  ))}
                  {recentOrders.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-16 text-center text-gray-400 font-bold text-sm">
                        No orders yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Bar Chart: Branch Performance */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="mb-4">
            <h3 className="font-black text-gray-900 uppercase tracking-tight">Branch Revenue</h3>
            <p className="text-xs text-gray-400 font-medium mt-0.5">Delivered orders per branch</p>
          </div>
          {isLoading ? (
            <Skeleton className="h-52 w-full" />
          ) : branchData.length === 0 ? (
            <div className="h-52 flex items-center justify-center text-gray-400 font-bold text-sm">No branch data</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={branchData} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: "#9ca3af", fontWeight: 700 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                <YAxis dataKey="name" type="category" width={70} tick={{ fontSize: 10, fill: "#6b7280", fontWeight: 700 }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(val) => [`Ksh ${Number(val).toLocaleString()}`, "Revenue"]} contentStyle={{ borderRadius: "1rem", border: "1px solid #f0f0f0", boxShadow: "0 10px 40px rgba(0,0,0,0.08)" }} />
                <Bar dataKey="revenue" fill="#4f46e5" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Order Details</h3>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order ID</p>
                  <p className="text-lg font-mono font-bold text-gray-900 mt-0.5">#{selectedOrder.id}</p>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${getStatusColor(selectedOrder.status)}`}>
                  {selectedOrder.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Customer", value: selectedOrder.customer_name || "Guest" },
                  { label: "Branch", value: selectedOrder.branch_name || "N/A" },
                  { label: "Date", value: new Date(selectedOrder.created_at).toLocaleDateString() },
                  { label: "Total Amount", value: `Ksh ${Number(selectedOrder.total).toLocaleString()}` },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-gray-50 p-4 rounded-2xl">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
                    <p className="font-bold text-gray-900 mt-0.5 text-sm">{value}</p>
                  </div>
                ))}
              </div>

              {selectedOrder.items?.length > 0 && (
                <div className="pt-2">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Items</p>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between text-sm items-center">
                        <span className="text-gray-700 font-medium">{item.product_name} <span className="text-gray-400">× {item.quantity}</span></span>
                        <span className="text-gray-900 font-black text-xs bg-gray-100 py-0.5 px-2.5 rounded-lg">
                          Ksh {Number(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full py-4 bg-black text-white rounded-2xl font-black text-sm hover:bg-indigo-600 transition-all uppercase tracking-widest active:scale-95"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
