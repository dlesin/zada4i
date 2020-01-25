from rest_framework.generics import ListAPIView, CreateAPIView, DestroyAPIView, UpdateAPIView

from backend.api.serializers import (ColorSerializer, ListSerializer, CreateListSerializer, TaskSerializer,
                                     CreateTaskSerializer, DepartmentSerializer)
from backend.models import Color, List, Task, User, Department


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


class DepartmentListAPIView(ListAPIView):
    # queryset = Department.objects.all()
    serializer_class = DepartmentSerializer

    def get_queryset(self):
        current_user = User.objects.get(username=self.request.user)
        print(current_user.department_id)
        return Department.objects.filter(id=current_user.department_id)


class ColorListAPIView(ListAPIView):
    queryset = Color.objects.all()
    serializer_class = ColorSerializer


class ListListAPIView(ListAPIView):
    # queryset = List.objects.all()
    serializer_class = ListSerializer

    def get_queryset(self):
        current_user = User.objects.get(username=self.request.user)
        # print(current_user.department)
        return List.objects.filter(department=current_user.department)


class TaskListAPIView(ListAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
