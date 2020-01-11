from rest_framework.generics import ListAPIView, CreateAPIView, DestroyAPIView, UpdateAPIView

from backend.api.serializers import (ColorSerializer, ListSerializer, CreateListSerializer, TaskSerializer,
                                     CreateTaskSerializer)
from backend.models import Color, List, Task


class ListCreateAPIView(CreateAPIView):
    queryset = List.objects.all()
    serializer_class = CreateListSerializer


class TaskCreateAPIView(CreateAPIView):
    queryset = Task.objects.all()
    serializer_class = CreateTaskSerializer


class TaskDestroyAPIView(DestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    lookup_field = 'pk'


class TaskUpdateAPIView(UpdateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    lookup_field = 'pk'


class ListUpdateAPIView(UpdateAPIView):
    queryset = List.objects.all()
    serializer_class = ListSerializer
    lookup_field = 'pk'


class ListDestroyAPIView(DestroyAPIView):
    queryset = List.objects.all()
    serializer_class = ListSerializer
    lookup_field = 'pk'


class ColorListAPIView(ListAPIView):
    queryset = Color.objects.all()
    serializer_class = ColorSerializer


class ListListAPIView(ListAPIView):
    queryset = List.objects.all()
    serializer_class = ListSerializer


class TaskListAPIView(ListAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
