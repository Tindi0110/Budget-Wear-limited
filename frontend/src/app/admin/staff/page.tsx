"use client";

import { 
  Users, 
  Shield, 
  Mail, 
  MapPin, 
  MoreVertical,
  UserPlus
} from "lucide-react";

const staff = [
  { id: "1", name: "Evans Matindi", email: "evans@budgetwear.co.ke", role: "Super Admin", branch: "All", status: "Active" },
  { id: "2", name: "Sarah John", email: "sarah@budgetwear.co.ke", role: "Branch Admin", branch: "Nairobi", status: "Active" },
  { id: "3", name: "Mike Peter", email: "mike@budgetwear.co.ke", role: "Sales Staff", branch: "Nakuru", status: "Away" },
];

export default function AdminStaff() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-end">
         <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-medium shadow-md shadow-indigo-200 active:scale-95">
            <UserPlus className="w-4 h-4" />
            Add Staff
          </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staff.map((person) => (
          <div key={person.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-50 to-purple-50 flex items-center justify-center border border-indigo-100/50">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
              <button className="text-gray-400 hover:text-gray-900 p-1">
                <MoreVertical className="w-4 h-4" />
              </button>
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
    </div>
  );
}
