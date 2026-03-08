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
import { useState } from "react";
import { toast } from "sonner";

const staff = [
  { id: "1", name: "Evans Matindi", email: "evans@budgetwear.co.ke", role: "Super Admin", branch: "All", status: "Active" },
  { id: "2", name: "Sarah John", email: "sarah@budgetwear.co.ke", role: "Branch Admin", branch: "Nairobi", status: "Active" },
  { id: "3", name: "Mike Peter", email: "mike@budgetwear.co.ke", role: "Sales Staff", branch: "Nakuru", status: "Away" },
];

export default function AdminStaff() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<any>(null);
  const [team, setTeam] = useState(staff);
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
                  onClick={() => { setTeam(team.filter(t => t.id !== person.id)); toast.error("Staff member removed"); }}
                  className="p-2 text-gray-500 hover:text-red-500 hover:bg-gray-50 hover:shadow-sm rounded-xl transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{person.name}</h4>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                  <Mail className="w-3 h-3" />
                  {person.email}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                    <Shield className="w-3.5 h-3.5 text-indigo-500" />
                    {person.role}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    {person.branch}
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  person.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                }`}>
                  {person.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Staff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
            <div className="p-10 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">
                {editingStaff ? 'Edit Staff member' : 'New Staff Invite'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full hover:bg-white flex items-center justify-center text-gray-400 hover:text-black transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form className="p-10 space-y-8" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); toast.success(editingStaff ? "Staff permissions updated" : "Staff invitation sent!"); }}>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Full Name</label>
                <input 
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
                  type="email" 
                  defaultValue={editingStaff?.email || ''}
                  placeholder="name@budgetwear.co.ke" 
                  className="w-full h-16 px-6 bg-gray-50 border border-gray-100 rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Access Role</label>
                  <select className="w-full h-16 px-6 bg-gray-50 border border-gray-100 rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold">
                     <option>Sales Staff</option>
                     <option>Branch Admin</option>
                     <option>Super Admin</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Branch</label>
                  <select className="w-full h-16 px-6 bg-gray-50 border border-gray-100 rounded-[1.5rem] focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold">
                     <option>Nairobi</option>
                     <option>Nakuru</option>
                     <option>Mombasa</option>
                     <option>Eldoret</option>
                     <option>All</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-6 bg-black text-white rounded-[2rem] font-black text-lg hover:bg-indigo-600 transition-all shadow-2xl shadow-gray-200 uppercase tracking-tighter"
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
