from rest_framework import serializers
from .models import User, Branch, Category, Product, ProductImage, Order, OrderItem, Wishlist, Advertisement, FlashSale
from .mpesa import initiate_stk_push

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'name', 'role', 'branch', 'created_at')

class BranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branch
        fields = '__all__'

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = '__all__'
        read_only_fields = ('product',)

class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, required=False)
    category_name = serializers.ReadOnlyField(source='category.name')
    branch_name = serializers.ReadOnlyField(source='branch.name')
    discount_percentage = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = '__all__'

    def get_discount_percentage(self, obj):
        if obj.original_price and obj.original_price > 0:
            discount = ((obj.original_price - obj.price) / obj.original_price) * 100
            return round(discount)
        return 0

    def create(self, validated_data):
        images_data = validated_data.pop('images', [])
        product = Product.objects.create(**validated_data)
        for index, image_data in enumerate(images_data):
            ProductImage.objects.create(product=product, position=index, **image_data)
        return product

    def update(self, instance, validated_data):
        images_data = validated_data.pop('images', None)
        instance = super().update(instance, validated_data)
        
        if images_data is not None:
            # Simple approach: replace all images
            instance.images.all().delete()
            for index, image_data in enumerate(images_data):
                ProductImage.objects.create(product=instance, position=index, **image_data)
        
        return instance

class FlashSaleSerializer(serializers.ModelSerializer):
    products = ProductSerializer(many=True, read_only=True)
    
    class Meta:
        model = FlashSale
        fields = '__all__'

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')

    class Meta:
        model = OrderItem
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, required=False)
    branch_name = serializers.ReadOnlyField(source='branch.name')

    class Meta:
        model = Order
        fields = '__all__'

    def create(self, validated_data):
        items_data = self.context['request'].data.get('items', [])
        # If branch is not provided, use the first available branch or handle as needed
        if 'branch' not in validated_data:
            from .models import Branch
            branch = Branch.objects.first()
            if branch:
                validated_data['branch'] = branch
        
        order = Order.objects.create(**validated_data)
        
        for item_data in items_data:
            try:
                product = Product.objects.get(id=item_data['product'])
                OrderItem.objects.create(
                    order=order,
                    product=product,
                    quantity=item_data['quantity'],
                    price=item_data['price']
                )
            except Product.DoesNotExist:
                continue

        # Trigger STK Push
        # We need a phone number. In the frontend it's passed as customer_phone
        phone = self.context['request'].data.get('customer_phone')
        if phone:
            initiate_stk_push(phone, order.total, str(order.id))
            
        return order

class WishlistSerializer(serializers.ModelSerializer):
    product_details = ProductSerializer(source='product', read_only=True)

    class Meta:
        model = Wishlist
        fields = '__all__'

class AdvertisementSerializer(serializers.ModelSerializer):
    image = serializers.URLField(source='image_url', read_only=True)

    class Meta:
        model = Advertisement
        fields = ('id', 'title', 'description', 'image', 'image_url', 'link', 'is_active', 'position', 'created_at')
