from django.contrib import admin
from django.urls import path
from .views import SellerRegistrationView, LoginView
from .views import (SellerListCreateView, SellerRetrieveUpdateDestroyView, BookListCreateView,
                    BookRetrieveUpdateDestroyView, AuthorListCreateView, AuthorRetrieveUpdateDestroyView,
                    GenreListCreateView, GenreRetrieveUpdateDestroyView, DiscountListCreateView,
                    DiscountRetrieveUpdateDestroyView, SaleListCreateView, SaleRetrieveUpdateDestroyView,
                    AuthorsOfBookListCreateView, AuthorsOfBookRetrieveUpdateDestroyView, BookNumberListCreateView,
                    BookNumberRetrieveUpdateDestroyView, BookDetailsView, UpdateLastDeauthorizationView, UpdateBookView,
                    AddBookView, BookInfForSaleView)

urlpatterns = [
    path('register/', SellerRegistrationView.as_view(), name='seller-registration'),
    path('login/', LoginView.as_view(), name='login'),
    path('book-details/', BookDetailsView.as_view(), name='book-details'),
    path('book/add/', AddBookView.as_view(), name='add_book'),
    path('book/<int:id_book>/update/', UpdateBookView.as_view(), name='update_book'),
    path('book-infforsale/', BookInfForSaleView.as_view(), name='book-infforsale'),
    # Seller
    path('sellers/', SellerListCreateView.as_view(), name='seller-list-create'),
    path('sellers/<int:pk>/', SellerRetrieveUpdateDestroyView.as_view(), name='seller-detail'),
    path('seller/<int:id_seller>/deauthorize/', UpdateLastDeauthorizationView.as_view(), name='update_last_deauthorization'),
    # Book
    path('books/', BookListCreateView.as_view(), name='book-list-create'),
    path('books/<int:pk>/', BookRetrieveUpdateDestroyView.as_view(), name='book-detail'),

    # Author
    path('authors/', AuthorListCreateView.as_view(), name='author-list-create'),
    path('authors/<int:pk>/', AuthorRetrieveUpdateDestroyView.as_view(), name='author-detail'),

    # Genre
    path('genres/', GenreListCreateView.as_view(), name='genre-list-create'),
    path('genres/<int:pk>/', GenreRetrieveUpdateDestroyView.as_view(), name='genre-detail'),

    # Discount
    path('discounts/', DiscountListCreateView.as_view(), name='discount-list-create'),
    path('discounts/<int:pk>/', DiscountRetrieveUpdateDestroyView.as_view(), name='discount-detail'),

    # Sale
    path('sales/', SaleListCreateView.as_view(), name='sale-list-create'),
    path('sales/<int:pk>/', SaleRetrieveUpdateDestroyView.as_view(), name='sale-detail'),

    # Authors of Book
    path('authors-of-book/', AuthorsOfBookListCreateView.as_view(), name='authors-of-book-list-create'),
    path('authors-of-book/<int:pk>/', AuthorsOfBookRetrieveUpdateDestroyView.as_view(), name='authors-of-book-detail'),

    # Book Number
    path('book-numbers/', BookNumberListCreateView.as_view(), name='book-number-list-create'),
    path('book-numbers/<str:pk>/', BookNumberRetrieveUpdateDestroyView.as_view(), name='book-number-detail'),

]