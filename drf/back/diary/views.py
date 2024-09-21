from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.contrib.auth import authenticate, login, logout


from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import permissions
from rest_framework import status
from rest_framework import generics
from rest_framework.views import APIView

from .models import UserModel, Diary, Comment
from .serializers import UserSerializer, DiarySerializer, CommentSerializer


# Other
@ensure_csrf_cookie
def get_csrf_token(request):
    csrf_token = get_token(request)
    return JsonResponse({"csrftoken": csrf_token})


# User
class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({"details": "login success"}, status=status.HTTP_200_OK)
        else:
            return JsonResponse(
                {"details": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST
            )


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        logout(request)
        return JsonResponse(
            {"details": "Successfully logged out."}, status=status.HTTP_200_OK
        )


class CheckAuthView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        serializer = UserSerializer(user)
        return JsonResponse(serializer.data, status=status.HTTP_200_OK)


class UserCreateView(generics.CreateAPIView):
    queryset = UserModel.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]


class UserDetailView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        username = self.kwargs.get("username")  # URL 경로에서 username 추출
        return get_object_or_404(UserModel, username=username)


class UserUpdateView(generics.UpdateAPIView):
    queryset = UserModel.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


# Diary
class DiaryCreateView(generics.CreateAPIView):
    queryset = Diary.objects.all()
    serializer_class = DiarySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_context(self):
        return {"request": self.request}  # 요청 객체를 serializer의 context에 추가


class DiaryDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        date = request.query_params.get("date")
        month = request.query_params.get("month")
        option = request.query_params.get("option")
        if date:
            diaries = Diary.objects.filter(date=date).order_by("-time")
        if month:
            year, month = month.split("-")
            if option == "old":
                diaries = Diary.objects.filter(
                    date__year=year, date__month=month
                ).order_by("date", "time")
            elif option == "like":
                diaries = Diary.objects.filter(
                    date__year=year, date__month=month
                ).order_by("-like")
            else:
                diaries = Diary.objects.filter(
                    date__year=year, date__month=month
                ).order_by("-date", "-time")

        serializer = DiarySerializer(diaries, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class DiaryDestoryView(generics.DestroyAPIView):
    queryset = Diary.objects.all()
    serializer_class = DiarySerializer
    permission_classes = [permissions.IsAuthenticated]


# Comment
class CommentCreateView(generics.CreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]
