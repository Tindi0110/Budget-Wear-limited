from rest_framework import viewsets, permissions, filters
from .models import User, Branch, Category, Product, ProductImage, Order, OrderItem, Wishlist
from .serializers import (
    UserSerializer, BranchSerializer, CategorySerializer, 
    ProductSerializer, OrderSerializer, WishlistSerializer
)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

class BranchViewSet(viewsets.ModelViewSet):
    queryset = Branch.objects.all()
    serializer_class = BranchSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description']

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    
class WishlistViewSet(viewsets.ModelViewSet):
    queryset = Wishlist.objects.all()
    serializer_class = WishlistSerializer

# M-Pesa Integration View
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import logging

logger = logging.getLogger(__name__)

class MpesaCallbackView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        """
        Handles the callback from Safaricom M-Pesa.
        """
        data = request.data
        logger.info(f"M-Pesa Callback Data: {data}")
        
        # Here you would process the StkCallback data
        # For example: check if 'ResultCode' is 0 (Success)
        # Update the Order status in the database
        
        return Response({"ResultCode": 0, "ResultDesc": "Success"}, status=status.HTTP_200_OK)
