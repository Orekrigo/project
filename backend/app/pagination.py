from rest_framework.pagination import PageNumberPagination


class BookPageNumberPagination(PageNumberPagination):
    page_size = 5
