from django import forms
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import ReadOnlyPasswordHashField

from backend.models import Color, Task, List, User, Department


class UserCreationForm(forms.ModelForm):
    # password = ReadOnlyPasswordHashField()

    class Meta:
        model = User
        fields = ('username',)

    def save(self, commit=True):
        # Save the provided password in hashed format
        user = super(UserCreationForm, self).save(commit=False)
        user.set_password(self.cleaned_data["password"])
        if commit:
            user.save()
        return user


class CustomUserAdmin(UserAdmin):
    add_form = UserCreationForm
    list_display = ('username',)
    ordering = ('username',)

    fieldsets = (
        (
            None, {'fields': (
                'username', 'password', 'email', 'first_name', 'last_name', 'is_superuser', 'is_staff', 'is_active',
                'department', 'is_leader',
                'is_director', 'avatar')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'username', 'password', 'email', 'first_name', 'last_name', 'is_superuser', 'is_staff', 'is_active',
                'department', 'is_leader',
                'is_director', 'avatar')}
         ),
    )


admin.site.register(Color)
admin.site.register(Task)
admin.site.register(List)
admin.site.register(Department)
admin.site.register(User, CustomUserAdmin)
