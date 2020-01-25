from django.urls import path, include
# from rest_framework_simplejwt.views import (
#     TokenObtainPairView,
#     TokenRefreshView,
#     TokenVerifyView)
from backend.api.views import (
    ColorListAPIView, ListListAPIView, ListCreateAPIView, ListDestroyAPIView, TaskListAPIView,
    ListUpdateAPIView, TaskCreateAPIView, TaskDestroyAPIView, TaskUpdateAPIView, DepartmentListAPIView)

urlpatterns = [
    path('colors/', ColorListAPIView.as_view(), name='colors'),
    path('tasks/', TaskListAPIView.as_view(), name='tasks'),
    path('lists/', ListListAPIView.as_view(), name='list'),
    path('department/', DepartmentListAPIView.as_view(), name='department'),
    path('lists/create/', ListCreateAPIView.as_view(), name='list-create'),
    path('tasks/create/', TaskCreateAPIView.as_view(), name='task-create'),
    path('tasks/update/<int:pk>/', TaskUpdateAPIView.as_view(), name='task-update'),
    path('tasks/destroy/<int:pk>/', TaskDestroyAPIView.as_view(), name='task-destroy'),
    path('lists/update/<int:pk>/', ListUpdateAPIView.as_view(), name='list-update'),
    path('lists/destroy/<int:pk>/', ListDestroyAPIView.as_view(), name='list-destroy'),

    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.authtoken')),
    # path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # path('auth/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
]
