from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        if hasattr(user, 'staff_profile'):
            token['role'] = user.staff_profile.role
            token['branch_id'] = str(user.staff_profile.branch.id)
        elif hasattr(user, 'customer_profile'):
            token['role'] = 'Customer'
        
        return token

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_customer', 'is_staff_member']
