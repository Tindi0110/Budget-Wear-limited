import { useQuery } from '@tanstack/react-query';
import { UserPlus, Shield, Building, Mail, Loader2, Users } from 'lucide-react';
import api from '../../api';

interface Staff {
    id: string;
    user_name: string;
    email: string;
    role: string;
    branch_name: string;
}

export function AdminStaff() {
    const { data: staff, isLoading } = useQuery({
        queryKey: ['admin-staff'],
        queryFn: async () => {
            const response = await api.get('/auth/users/'); // Assuming this endpoint returns staff
            // Filter staff or use specialized endpoint if available
            return response.data.results as Staff[];
        },
    });

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage branch staff and permissions</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                    <UserPlus className="w-5 h-5" />
                    Add Staff Member
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Contact</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Branch</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center">
                                        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
                                    </td>
                                </tr>
                            ) : staff?.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        <Users className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                        No staff members found.
                                    </td>
                                </tr>
                            ) : staff?.map((member) => (
                                <tr key={member.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4 font-semibold text-gray-900">
                                        {member.user_name}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-sm flex items-center gap-2">
                                        <Mail className="w-3 h-3 text-gray-400" />
                                        {member.email}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
                                            <Shield className="w-3 h-3" />
                                            {member.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        <span className="flex items-center gap-2">
                                            <Building className="w-3 h-3 text-gray-400" />
                                            {member.branch_name}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                                            Edit Permissions
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
