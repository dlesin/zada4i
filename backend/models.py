from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import User
from django.db import models
from django.shortcuts import reverse


class Department(models.Model):
    name = models.CharField(max_length=128)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return "{0}".format(self.name)


class User(AbstractUser):
    is_director = models.BooleanField(default=False)
    is_leader = models.BooleanField(default=False)
    department = models.ForeignKey(Department, related_name='user_department', on_delete=models.SET_NULL, null=True)
    avatar = models.ImageField(blank=True, null=True)
    REQUIRED_FIELDS = ['first_name', 'last_name']
    USERNAME_FIELD = 'username'


class Color(models.Model):
    hex = models.CharField(max_length=10, blank=True, null=True)
    name = models.CharField(max_length=20)

    def __str__(self):
        return "{0}".format(self.name)


class List(models.Model):
    name = models.CharField(max_length=60, unique=True)
    color = models.ForeignKey(Color, related_name='listcolor', on_delete=models.SET_NULL, null=True)
    department = models.ForeignKey(Department, related_name='list_department', on_delete=models.SET_NULL, blank=True,
                                   null=True)
    created_at = models.DateField(auto_now_add=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return "{0}".format(self.name)

    def get_absolute_url(self):
        return reverse('list_detail_url', kwargs={'pk': self.pk})


class Task(models.Model):
    creator = models.ForeignKey(User, related_name='creator', on_delete=models.SET_NULL, null=True)
    executor = models.ForeignKey(User, related_name='executor', on_delete=models.SET_NULL, null=True)
    list = models.ForeignKey(List, related_name='list', on_delete=models.SET_NULL, null=True)
    color = models.ForeignKey(Color, related_name='taskcolor', on_delete=models.SET_NULL, blank=True, null=True)
    department = models.ForeignKey(Department, related_name='task_department', on_delete=models.SET_NULL, null=True)
    text = models.CharField(max_length=200)
    comment = models.TextField(blank=True, null=True)
    un_comment = models.TextField(blank=True, null=True)
    completed = models.BooleanField(default=False)
    priority = models.BooleanField(default=False)
    created_at = models.DateField(auto_now_add=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return "{0}".format(self.text)
