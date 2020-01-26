from datetime import date

from django.db.models import Q
# from djoser.serializers import UserSerializer
from rest_framework.fields import SerializerMethodField
from rest_framework.serializers import ModelSerializer, PrimaryKeyRelatedField

from backend.models import Color, List, Task, User, Department


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'department', 'is_director', 'is_leader']


class DepartmentSerializer(ModelSerializer):
    # user = PrimaryKeyRelatedField(queryset=User.objects.all())
    users = SerializerMethodField()

    class Meta:
        model = Department
        fields = ['id', 'name', 'timestamp', 'users']

    def get_users(self, obj):
        result = User.objects.filter(department=obj)
        serializer = UserSerializer(result, many=True)
        return serializer.data


class ColorSerializer(ModelSerializer):
    class Meta:
        model = Color
        fields = ['id', 'hex', 'name']


class TaskSerializer(ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'creator', 'executor', 'list', 'color', 'text', 'comment', 'completed', 'created_at',
                  'timestamp']


class ListSerializer(ModelSerializer):
    color = ColorSerializer(read_only=True)
    tasks = SerializerMethodField()

    class Meta:
        model = List
        fields = ['id', 'name', 'color', 'department', 'tasks', 'created_at', 'timestamp']

    def get_tasks(self, obj):
        today = date.today()
        result = Task.objects.filter(Q(list=obj),
                                     Q(created_at__year=today.year, created_at__month=today.month,
                                       created_at__day=today.day) |
                                     Q(completed=False))
        serializer = TaskSerializer(result, many=True)
        return serializer.data


class CreateListSerializer(ModelSerializer):
    color = PrimaryKeyRelatedField(queryset=Color.objects.all())

    class Meta:
        model = List
        fields = ['id', 'name', 'color', 'department', 'created_at', 'timestamp']


class CreateTaskSerializer(ModelSerializer):
    list = PrimaryKeyRelatedField(queryset=List.objects.all())

    class Meta:
        model = Task
        fields = ['id', 'creator', 'executor', 'list', 'color', 'text', 'comment', 'completed', 'created_at',
                  'timestamp']
