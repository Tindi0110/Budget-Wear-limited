from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PaymentViewSet, MpesaTransactionViewSet

router = DefaultRouter()
router.register(r'payments', PaymentViewSet)
router.register(r'mpesa-transactions', MpesaTransactionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
