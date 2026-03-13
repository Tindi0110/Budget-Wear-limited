from rest_framework import viewsets, permissions, filters
from .models import User, Branch, Category, Product, ProductImage, Order, OrderItem, Wishlist, Advertisement, FlashSale
from .serializers import (
    UserSerializer, BranchSerializer, CategorySerializer, 
    ProductSerializer, OrderSerializer, WishlistSerializer, 
    AdvertisementSerializer, FlashSaleSerializer
)
from django.db.models import Sum, Count
from django.db.models.functions import TruncMonth
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.files.storage import default_storage
from datetime import datetime, timedelta
from django.utils import timezone
import logging

logger = logging.getLogger(__name__)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

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

    def get_queryset(self):
        queryset = Product.objects.all().prefetch_related('images')
        branch_id = self.request.query_params.get('branch')
        category_name = self.request.query_params.get('category')
        subcategory = self.request.query_params.get('subcategory')

        if branch_id:
            queryset = queryset.filter(branch_id=branch_id)
        if category_name:
            queryset = queryset.filter(category__name=category_name)
        if subcategory:
            # Simple substring match for subcategory in name or description if no explicit field
            # Or if it's a specific tag. Let's assume it matches category name for now 
            # or we can just filter by category and then refined search.
            # The user requested specific baby categories: Gifts, Pacifiers, etc.
            # These are likely just categories or part of the name.
            from django.db.models import Q
            queryset = queryset.filter(
                Q(name__icontains=subcategory) | 
                Q(description__icontains=subcategory) |
                Q(category__name__icontains=subcategory)
            )
            
        return queryset

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().order_by('-created_at')
    serializer_class = OrderSerializer
    
class WishlistViewSet(viewsets.ModelViewSet):
    queryset = Wishlist.objects.all()
    serializer_class = WishlistSerializer

class AdvertisementViewSet(viewsets.ModelViewSet):
    queryset = Advertisement.objects.all().order_by('position', '-created_at')
    serializer_class = AdvertisementSerializer

class FlashSaleViewSet(viewsets.ModelViewSet):
    queryset = FlashSale.objects.filter(is_active=True).order_by('-start_time')
    serializer_class = FlashSaleSerializer

class DashboardStatsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        try:
            total_revenue = Order.objects.filter(status='DELIVERED').aggregate(Sum('total'))['total__sum'] or 0
            active_orders = Order.objects.filter(status__in=['PENDING', 'PROCESSING', 'SHIPPED']).count()
            total_products = Product.objects.count()
            total_staff = User.objects.exclude(role='CUSTOMER').count()
            
            # Recent orders (last 6)
            recent_orders = Order.objects.all().order_by('-created_at')[:6]
            recent_orders_data = OrderSerializer(recent_orders, many=True).data

            # Monthly revenue trend (last 6 months)
            six_months_ago = timezone.now() - timedelta(days=180)
            monthly_revenue = (
                Order.objects
                .filter(created_at__gte=six_months_ago, status='DELIVERED')
                .annotate(month=TruncMonth('created_at'))
                .values('month')
                .annotate(revenue=Sum('total'), orders=Count('id'))
                .order_by('month')
            )
            monthly_data = [
                {
                    "month": entry['month'].strftime('%b'),
                    "revenue": float(entry['revenue'] or 0),
                    "orders": entry['orders']
                }
                for entry in monthly_revenue
            ]

            # Category distribution (product count per category)
            category_dist = (
                Product.objects
                .values('category__name')
                .annotate(count=Count('id'))
                .order_by('-count')[:6]
            )
            category_data = [
                {"name": entry['category__name'] or 'Uncategorized', "value": entry['count']}
                for entry in category_dist
            ]

            # Order status distribution
            status_dist = (
                Order.objects
                .values('status')
                .annotate(count=Count('id'))
            )
            status_data = [
                {"status": entry['status'], "count": entry['count']}
                for entry in status_dist
            ]

            # Branch performance (revenue per branch)
            branch_perf = (
                Order.objects
                .filter(status='DELIVERED')
                .values('branch__name')
                .annotate(revenue=Sum('total'), orders=Count('id'))
                .order_by('-revenue')[:5]
            )
            branch_data = [
                {
                    "name": entry['branch__name'] or 'Unknown',
                    "revenue": float(entry['revenue'] or 0),
                    "orders": entry['orders']
                }
                for entry in branch_perf
            ]

            return Response({
                "stats": [
                    {"name": "Total Revenue", "value": f"Ksh {total_revenue:,.0f}", "icon": "TrendingUp", "change": "+12%", "trend": "up"},
                    {"name": "Active Orders", "value": str(active_orders), "icon": "ShoppingBag", "change": f"+{active_orders}", "trend": "up"},
                    {"name": "Total Products", "value": str(total_products), "icon": "Package", "change": "Catalog", "trend": "neutral"},
                    {"name": "Total Staff", "value": str(total_staff), "icon": "Users", "change": "Team", "trend": "neutral"},
                ],
                "recent_orders": recent_orders_data,
                "monthly_data": monthly_data,
                "category_data": category_data,
                "status_data": status_data,
                "branch_data": branch_data,
            })
        except Exception as e:
            logger.error(f"Dashboard Stats Error: {str(e)}")
            return Response({"error": "Failed to load dashboard statistics"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# M-Pesa Integration View
class MpesaCallbackView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        data = request.data
        logger.info(f"M-Pesa Callback Data: {data}")
        return Response({"ResultCode": 0, "ResultDesc": "Success"}, status=status.HTTP_200_OK)

class ImageUploadView(APIView):
    permission_classes = [permissions.AllowAny]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        file = request.FILES.get('image')
        if not file:
            return Response({"error": "No image provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        file_name = default_storage.save(file.name, file)
        file_url = request.build_absolute_uri(default_storage.url(file_name))
        # Ensure it works cross-protocol in case of proxy issues
        file_url = file_url.replace('http://', 'https://') if 'onrender.com' in file_url else file_url
        
        return Response({"image_url": file_url}, status=status.HTTP_201_CREATED)

# Ping endpoint for connectivity checks
class PingView(APIView):
    permission_classes = [permissions.AllowAny]
    def get(self, request):
        return Response({"status": "ok", "message": "Backend is reachable", "time": timezone.now()}, status=status.HTTP_200_OK)

