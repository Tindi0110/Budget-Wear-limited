from rest_framework import permissions

class IsSuperAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and hasattr(request.user, 'staff_profile') and request.user.staff_profile.role == 'SuperAdmin')

class IsBranchAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and hasattr(request.user, 'staff_profile') and request.user.staff_profile.role in ['SuperAdmin', 'BranchAdmin'])

    def has_object_permission(self, request, view, obj):
        # Allow SuperAdmin globally
        if request.user.staff_profile.role == 'SuperAdmin':
            return True
        # Allow BranchAdmin to modify data within their branch
        return getattr(obj, 'branch_id', None) == request.user.staff_profile.branch_id

class IsBranchStaff(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and hasattr(request.user, 'staff_profile'))

    def has_object_permission(self, request, view, obj):
        if request.user.staff_profile.role == 'SuperAdmin':
            return True
        return getattr(obj, 'branch_id', None) == request.user.staff_profile.branch_id
