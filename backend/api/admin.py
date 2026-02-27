from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Product, Cart, Order, OrderItem
from django.utils.html import format_html
from .models import Banner


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'phone')

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    # Added 'image_preview' to the list
    list_display = ('id', 'name', 'price', 'stock', 'image_preview')
    list_display_links = ('id', 'name')
    list_editable = ('price', 'stock')
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="width: 50px; height: auto; border-radius: 5px;" />', obj.image.url)
        return "No Image"
    
    image_preview.short_description = 'Preview'


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('user', 'product', 'quantity')


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'total_amount', 'status', 'created_at')


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'product', 'quantity', 'price')


@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
    list_display = ('slot_index', 'title', 'created_at')
    ordering = ('slot_index',)