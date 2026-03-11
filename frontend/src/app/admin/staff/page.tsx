"use client";

import { 
  Users, 
  Shield, 
  Mail, 
  MapPin, 
  MoreVertical,
  UserPlus,
  X
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";

const roleMapping: Record<string, string> = {
  "SUPERADMIN": "Super Admin",
  "BRANCH_ADMIN": "Branch Admin",
  "BRANCH_STAFF": "Sales Staff",
  "CUSTOMER": "Customer"
};

const revRoleMapping: Record<string, string> = {
  "Super Admin": "SUPERADMIN",
  "Branch Admin": "BRANCH_ADMIN",
  "Sales Staff": "BRANCH_STAFF"
};

export default function AdminStaff() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<any>(null);
  const [team, setTeam] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [usersData, branchesData] = await Promise.all([
        api.get('/users/'),
        api.get('/branches/')
      ]);
      // Filter out customers from the staff list
      setTeam(usersData.filter((u: any) => u.role !== 'CUSTOMER'));
      setBranches(branchesData);
    } catch (error) {
      toast.error("Failed to load staff data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      username: formData.get('email'), // Use email as username for simplicity
      role: revRoleMapping[formData.get('role') as string] || 'BRANCH_STAFF',
      branch: formData.get('branch') === 'All' ? null : formData.get('branch'),
    };

    try {
      if (editingStaff) {
        await api.put(`/users/${editingStaff.id}/`, data);
        toast.success("Staff profile updated");
      } else {
        // For new staff, we might need a password. For MVP, we'll set a default if backend requires it.
        await api.post('/users/', { ...data, password: 'ChangeMe123!' });
        toast.success("Staff invitation sent!");
      }
      fetchData();
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Operation failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this staff member?")) return;
    try {
      await api.delete(`/users/${id}/`);
      setTeam(team.filter(t => t.id !== id));
      toast.success("Staff member removed");
    } catch (error) {
      toast.error("Failed to remove staff");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-end">
         <button 
            onClick={() => { setEditingStaff(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-2xl hover:bg-indigo-600 transition-all font-black shadow-xl shadow-gray-200 active:scale-95 text-xs uppercase tracking-widest"
          >
            <UserPlus className="w-5 h-5" />
            Add Staff
          </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-gray-50 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((person) => (
            <div key={person.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-50 to-purple-50 flex items-center justify-center border border-indigo-100/50">
                  <Users className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => { setEditingStaff(person); setIsModalOpen(true); }}
                    className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-50 hover:shadow-sm rounded-xl transition-all"
                  >
                    <Shield className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(person.id)}
                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-gray-50 hover:shadow-sm rounded-xl transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{person.name}</h4>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1 uppercase font-bold tracking-tight">
                    <Mail className="w-3 h-3" />
                    {person.email || person.username}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-700">
                      <Shield className="w-3.5 h-3.5 text-indigo-500" />
                      {roleMapping[person.role] || person.role}
                    </div>
                    {person.branch_name && (
                      <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                        <MapPin className="w-3.5 h-3.5" />
                        {person.branch_name}
                      </div>
                    )}
                  </div>
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-green-50 text-green-700`}>
                    Active
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 max-h-[90vh] flex flex-col">
            <div className="p-10 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">
                {editingStaff ? 'Edit Staff member' : 'New Staff Invite'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full hover:bg-white flex items-center justify-center text-gray-400 hover:text-black transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form className="p-10 space-y-8 overflow-y-auto" onSubmit={handleSubmit}>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Full Name</label>
                <input 
                  name="name"
                  type="text" 
                  defaultValue={editingStaff?.name || ''}
                  placeholder="e.g. Jane Smith" 
                  className="w-full h-16 px-6 bg-gray-50 border border-gray-100 rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold"
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Email Address</label>
                <input 
                  name="email"
                  type="email" 
                  defaultValue={editingStaff?.email || editingStaff?.username || ''}
                  placeholder="name@budgetwear.co.ke" 
                  className="w-full h-16 px-6 bg-gray-50 border border-gray-100 rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Access Role</label>
                  <select name="role" className="w-full h-16 px-6 bg-gray-50 border border-gray-100 rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-black text-xs uppercase" defaultValue={roleMapping[editingStaff?.role] || 'Sales Staff'}>
                     <option>Sales Staff</option>
                     <option>Branch Admin</option>
                     <option>Super Admin</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Branch</label>
                  <select name="branch" className="w-full h-16 px-6 bg-gray-50 border border-gray-100 rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-black text-xs uppercase" defaultValue={editingStaff?.branch || 'All'}>
                     <option>All</option>
                     {branches.map(b => (
                       <option key={b.id} value={b.id}>{b.name}</option>
                     ))}
                  </select>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-6 bg-black text-white rounded-[2rem] font-black text-lg hover:bg-indigo-600 transition-all shadow-2xl shadow-gray-200 uppercase tracking-tighter active:scale-95"
              >
                {editingStaff ? 'Update Permissions' : 'Send Invite'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
