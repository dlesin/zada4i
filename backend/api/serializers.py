# from django.contrib.auth.models import User
from djoser.serializers import UserSerializer
from rest_framework.fields import SerializerMethodField
from rest_framework.serializers import ModelSerializer, PrimaryKeyRelatedField

from backend.models import Color, List, Task, User


class UserSerializer(UserSerializer):
    class Meta(UserSerializer.Meta):
        model = User
        fields = ['id', 'username', 'first_name', 'last_name']


class ColorSerializer(ModelSerializer):
    class Meta:
        model = Color
        fields = [
            'id',
            'hex',
            'name',
        ]


class TaskSerializer(ModelSerializer):
    class Meta:
        model = Task
        fields = [
            'id',
            'creator',
            'executor',
            'list',
            'color',
            'text',
            'comment',
            'completed',
            'created_at',
            'timestamp',
        ]


class ListSerializer(ModelSerializer):
    color = ColorSerializer(read_only=True)
    tasks = SerializerMethodField()

    class Meta:
        model = List
        fields = [
            'id',
            'name',
            'color',
            'tasks',
            'created_at',
            'timestamp',
        ]

    def get_tasks(self, obj):
        result = Task.objects.filter(list=obj)
        serializer = TaskSerializer(result, many=True)
        return serializer.data


class CreateListSerializer(ModelSerializer):
    # color = ColorSerializer(read_only=True)
    color = PrimaryKeyRelatedField(queryset=Color.objects.all())

    # color = SerializerMethodField()
    class Meta:
        model = List
        fields = [
            'id',
            'name',
            'color',
            'created_at',
            'timestamp',
        ]


class CreateTaskSerializer(ModelSerializer):
    # creator = PrimaryKeyRelatedField(queryset=User.objects.all())
    # executor = PrimaryKeyRelatedField(queryset=User.objects.all())
    list = PrimaryKeyRelatedField(queryset=List.objects.all())
    # color = PrimaryKeyRelatedField(queryset=Color.objects.all())

    class Meta:
        model = Task
        fields = [
            'id',
            'creator',
            'executor',
            'list',
            'color',
            'text',
            'comment',
            'completed',
            'created_at',
            'timestamp',
        ]
