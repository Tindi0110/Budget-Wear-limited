from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Category, Product, Inventory, Review
from .serializers import CategorySerializer, ProductSerializer, InventorySerializer, ReviewSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    search_fields = ['name']

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().select_related('category', 'branch')
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filterset_fields = ['category', 'branch', 'condition']
    search_fields = ['name', 'description', 'category__name', 'branch__name']

class InventoryViewSet(viewsets.ModelViewSet):
    queryset = Inventory.objects.all().select_related('product', 'branch')
    serializer_class = InventorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filterset_fields = ['branch', 'product']

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
