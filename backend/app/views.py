from rest_framework import viewsets
from .models import Admin, Borrow, Book, Recommend, User, Comment
from .pagination import BookPageNumberPagination
from .serializers import AdminSerializer, BookSerializer, BorrowSerializer, UserSerializer, CommentSerializer, \
    RecommendSerializer


# Create your views here.

class AdminViewSet(viewsets.ModelViewSet):
    queryset = Admin.objects.all()
    serializer_class = AdminSerializer
    filterset_fields = ["username"]


class BorrowViewSet(viewsets.ModelViewSet):
    queryset = Borrow.objects.all()
    serializer_class = BorrowSerializer
    filterset_fields = ["bookid", "userid"]
    ordering_fields = ["borrowtime"]


class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    pagination_class = BookPageNumberPagination
    filterset_fields = ["title", "author", "publish", "classification"]


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    filterset_fields = ["username"]


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    filterset_fields = ["bookid", "userid"]
    ordering_fields = ["time"]


class RecommendViewSet(viewsets.ModelViewSet):
    queryset = Recommend.objects.all()
    serializer_class = RecommendSerializer
