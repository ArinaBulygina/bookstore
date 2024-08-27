from django.contrib.auth.hashers import check_password
from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Seller
from .serializers import SellerRegistrationSerializer
from rest_framework import generics
from .models import Seller, Book, Author, Genre, Discount, Sale, AuthorsOfBook, BookNumber
from .serializers import (SellerSerializer, BookSerializer, AuthorSerializer, GenreSerializer,
                          DiscountSerializer, SaleSerializer, AuthorsOfBookSerializer, BookNumberSerializer)

#def index(request):
 #   return render(request, 'main/index.html')


#def book(request, bookid):
 #   return HttpResponse(f"<h4>Страница книги {bookid}</h4>")


class SellerRegistrationView(APIView):
    def post(self, request):
        serializer = SellerRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Seller registered successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request):
        # Получаем данные из запроса
        id_seller = request.data.get("id_seller")
        password = request.data.get("password")

        # Проверяем, что оба поля были отправлены
        if not id_seller or not password:
            return Response({"error": "Please provide both id_seller and password."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Ищем пользователя по id_seller
            user = Seller.objects.get(id_seller=id_seller)
        except Seller.DoesNotExist:
            return Response({"error": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)

        # Проверка пароля
        if not check_password(password, user.password):
            return Response({"error": "Invalid credentials. Wrong password"}, status=status.HTTP_401_UNAUTHORIZED)

        # Генерация JWT токенов
        refresh = RefreshToken()
        refresh['id_seller'] = user.id_seller
        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }, status=status.HTTP_200_OK)



# Для Seller
class SellerListCreateView(generics.ListCreateAPIView):
    queryset = Seller.objects.all()
    serializer_class = SellerSerializer

class SellerRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Seller.objects.all()
    serializer_class = SellerSerializer


# Для Book
class BookListCreateView(generics.ListCreateAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

class BookRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer


# Для Author
class AuthorListCreateView(generics.ListCreateAPIView):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer

class AuthorRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer


# Для Genre
class GenreListCreateView(generics.ListCreateAPIView):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer

class GenreRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer


# Для Discount
class DiscountListCreateView(generics.ListCreateAPIView):
    queryset = Discount.objects.all()
    serializer_class = DiscountSerializer

class DiscountRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Discount.objects.all()
    serializer_class = DiscountSerializer


# Для Sale
class SaleListCreateView(generics.ListCreateAPIView):
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer

class SaleRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer


# Для AuthorsOfBook
class AuthorsOfBookListCreateView(generics.ListCreateAPIView):
    queryset = AuthorsOfBook.objects.all()
    serializer_class = AuthorsOfBookSerializer

class AuthorsOfBookRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = AuthorsOfBook.objects.all()
    serializer_class = AuthorsOfBookSerializer


# Для BookNumber
class BookNumberListCreateView(generics.ListCreateAPIView):
    queryset = BookNumber.objects.all()
    serializer_class = BookNumberSerializer

class BookNumberRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = BookNumber.objects.all()
    serializer_class = BookNumberSerializer