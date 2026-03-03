from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve
import os

urlpatterns = [
    # 1. Django Admin Panel
    path('admin/', admin.site.urls),
    
    # 2. API Routes (Connecting to api/urls.py)
    path('api/', include('api.urls')),
]

# 3. Static & Media Files Support for Render (Live/Production Fix)
# DEBUG False unnaa Render lo CSS mariyu Images ravalante ee 'serve' function kachithanga undali
if not settings.DEBUG:
    urlpatterns += [
        path('static/<path:path>', serve, {'document_root': settings.STATIC_ROOT}),
        path('media/<path:path>', serve, {'document_root': settings.MEDIA_ROOT}),
    ]
else:
    # Local ga run chesetappudu idi panichesthundi
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)