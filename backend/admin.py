from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from backend.models import Color, Task, List, User


admin.site.register(Color)
admin.site.register(Task)
admin.site.register(List)
admin.site.register(User, UserAdmin)
