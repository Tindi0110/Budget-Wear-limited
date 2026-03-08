from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, BranchViewSet, CategoryViewSet, 
    ProductViewSet, OrderViewSet, WishlistViewSet, MpesaCallbackView, AdvertisementViewSet
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'branches', BranchViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'products', ProductViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'wishlist', WishlistViewSet)
router.register(r'adverts', AdvertisementViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('mpesa/callback/', MpesaCallbackView.as_view(), name='mpesa-callback'),
]
