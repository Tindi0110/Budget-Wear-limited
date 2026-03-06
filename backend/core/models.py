import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser
from branches.models import Branch

class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    is_customer = models.BooleanField(default=False)
    is_staff_member = models.BooleanField(default=False)
    
class StaffProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='staff_profile')
    branch = models.ForeignKey(Branch, on_delete=models.PROTECT, related_name='staff_members')
    role = models.CharField(max_length=50, choices=[
        ('SuperAdmin', 'Super Admin'),
        ('BranchAdmin', 'Branch Admin'),
        ('Staff', 'Staff'),
    ])

    def __str__(self):
        return f"{self.user.username} - {self.role} at {self.branch.name}"

class CustomerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='customer_profile')
    phone_number = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    
    def __str__(self):
        return f"Customer: {self.user.username}"
