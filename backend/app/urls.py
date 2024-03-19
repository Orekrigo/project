from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'book', views.BookViewSet, basename='book')
router.register(r'user', views.UserViewSet, basename='user')
router.register(r'admin', views.AdminViewSet, basename='admin')
router.register(r'recommend', views.RecommendViewSet, basename='recommend')
router.register(r'comment', views.CommentViewSet, basename='comment')
router.register(r'borrow', views.BorrowViewSet, basename='borrow')
urlpatterns = [
    path('', include(router.urls))
]
