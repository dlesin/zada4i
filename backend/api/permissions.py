from rest_framework.permissions import BasePermission


class IsLeader(BasePermission):
    message = 'Вы не являетесь лидером...'

    def has_permission(self, request, view):
        print(request.user.is_leader)
        return request.user and request.user.is_leader
