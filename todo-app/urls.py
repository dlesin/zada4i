from django.contrib import admin
from django.urls import path, include


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('backend.api.urls')),
    # re_path(r'^.*', TemplateView.as_view(template_name='index.html')),
]
