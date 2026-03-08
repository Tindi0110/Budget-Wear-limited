from django.contrib import admin
from .models import User, Branch, Category, Product, ProductImage, Order, OrderItem, Wishlist, Advertisement

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'name', 'role', 'branch', 'created_at')
    search_fields = ('email', 'name')
    list_filter = ('role', 'branch')

@admin.register(Branch)
class BranchAdmin(admin.ModelAdmin):
    list_display = ('name', 'location', 'type', 'created_at')
    search_fields = ('name', 'location')
    list_filter = ('type',)

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'icon')
    search_fields = ('name',)

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'stock', 'branch', 'category', 'created_at')
    search_fields = ('name', 'description')
    list_filter = ('branch', 'category')
    inlines = [ProductImageInline]

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'customer_name', 'total', 'status', 'branch', 'created_at')
    search_fields = ('customer_name', 'id')
    list_filter = ('status', 'branch')
    inlines = [OrderItemInline]

@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ('user_id', 'product')
    search_fields = ('user_id',)

@admin.register(Advertisement)
class AdvertisementAdmin(admin.ModelAdmin):
    list_display = ('title', 'is_active', 'position', 'created_at')
    list_editable = ('is_active', 'position')
    search_fields = ('title', 'description')
    list_filter = ('is_active',)
