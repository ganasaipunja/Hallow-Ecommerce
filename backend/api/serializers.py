import re
from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, Product, Cart, Order, OrderItem, Banner

# --- USER & AUTH ---

class UserRegisterSerializer(serializers.ModelSerializer):
    # Standard security: min_length 8 is better for complex passwords
    password = serializers.CharField(write_only=True, min_length=8)
    otp = serializers.CharField(write_only=True, required=False)
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'phone', 'otp')

    def validate_password(self, value):
        """
        Custom validation to enforce:
        - At least one uppercase letter
        - At least one number
        - At least one special character
        """
        if not re.search(r'[A-Z]', value):
            raise serializers.ValidationError("Password must contain at least one capital letter.")
        if not re.search(r'[0-9]', value):
            raise serializers.ValidationError("Password must contain at least one number.")
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', value):
            raise serializers.ValidationError("Password must contain at least one special character.")
        return value

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    # Adding this prevents the "This field is required" 400 error
    otp = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')
        
        user = authenticate(username=username, password=password)
        if not user:
            raise serializers.ValidationError('Invalid username or password.')
        
        data['user'] = user
        return data

# Flexible Serializer to handle both Email and Phone OTP requests
class OTPSendSerializer(serializers.Serializer):
    phone = serializers.CharField(required=False)
    email = serializers.EmailField(required=False)

    def validate(self, data):
        if not data.get('phone') and not data.get('email'):
            raise serializers.ValidationError("Either email or phone is required.")
        return data

class OTPVerifySerializer(serializers.Serializer):
    phone = serializers.CharField(required=False)
    email = serializers.EmailField(required=False)
    otp = serializers.CharField(max_length=6)

# --- HOME & PRODUCTS ---

class BannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Banner
        fields = ('id', 'title', 'image', 'slot_index')

class ProductSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    class Meta:
        model = Product
        fields = ('id', 'name', 'category','description', 'price', 'stock','image')
        
    def get_image(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

# --- CART ---

class CartSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all(), write_only=True)

    class Meta:
        model = Cart
        fields = ('id', 'product', 'product_id', 'quantity', 'created_at')

    def create(self, validated_data):
        validated_data['product'] = validated_data.pop('product_id')
        return super().create(validated_data)

class CartAddSerializer(serializers.Serializer):
    product_id = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())
    quantity = serializers.IntegerField(min_value=1, default=1)

# --- ORDERS ---

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_image = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ('id', 'product', 'product_name', 'product_image', 'quantity', 'price')

    def get_product_image(self, obj):
        if obj.product and obj.product.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.product.image.url)
            return obj.image.url
        return None

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = (
            'id', 'user', 'total_amount', 'status', 'created_at', 
            'items', 'street', 'city', 'pincode', 'payment_method'
        )

# In backend/api/serializers.py
class UserSerializer(serializers.ModelSerializer):
    groups = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='name'
    )
    class Meta:
        model = User
        fields = ['id', 'username', 'groups']
        