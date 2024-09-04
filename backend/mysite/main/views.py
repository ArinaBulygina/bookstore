from django.contrib.auth.hashers import check_password
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import SellerRegistrationSerializer
from rest_framework import generics
from .models import Seller, Book, Author, Genre, Discount, Sale, AuthorsOfBook, BookNumber
from .serializers import (SellerSerializer, BookSerializer, AuthorSerializer, GenreSerializer,
                          DiscountSerializer, SaleSerializer, AuthorsOfBookSerializer, BookNumberSerializer)
from django.utils import timezone


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


class UpdateLastDeauthorizationView(APIView):
    def patch(self, request, id_seller):
        try:
            seller = get_object_or_404(Seller, pk=id_seller)
            seller.date_of_last_deauthorization = timezone.now()
            seller.save()
            return Response({'status': 'success', 'message': 'Date of last deauthorization updated successfully.'}, status=status.HTTP_200_OK)
        except Seller.DoesNotExist:
            return Response({"error": "Seller not found."}, status=status.HTTP_404_NOT_FOUND)


class AddBookView(APIView):
    def post(self, request):
        data = request.data

        # Получаем жанр по его имени
        genre, created = Genre.objects.get_or_create(name_of_genre=data['genre'])
        # Получаем скидку по ее имени, если она указана
        discount = None
        if 'discount' in data:
            discount = get_object_or_404(Discount, name_of_discount=data['discount'])

        # Создаем новую запись книги
        book = Book.objects.create(
            id_genre=genre,
            title=data['title'],
            publishing=data['publishing'],
            price=data['price'],
            rack_number=data['rack_number'],
            number_of_copies=data['number_of_copies'],
            id_discount=discount,
            discounted_price=data.get('discounted_price', data['price']),
            description=data['description']
        )

        # Обработка авторов
        authors = data.get('authors', [])
        if not authors:
            return Response({"error": "No authors provided."}, status=status.HTTP_400_BAD_REQUEST)

        for author_data in authors:
            author, created = Author.objects.get_or_create(
                author_last_name=author_data['last_name'],
                author_first_name=author_data['first_name'],
                author_patronymic=author_data.get('patronymic', None)
            )
            AuthorsOfBook.objects.create(id_author=author, id_book=book)

        return Response({"status": "success", "message": "Book and authors added successfully.", "book_id": book.id_book}, status=status.HTTP_201_CREATED)


class UpdateBookView(APIView):
    def patch(self, request, id_book):
        try:
            book = get_object_or_404(Book, pk=id_book)
        except Book.DoesNotExist:
            return Response({"error": "Book not found."}, status=status.HTTP_404_NOT_FOUND)

        data = request.data

        # Обновляем жанр книги, если он указан
        if 'genre' in data:
            genre, created = Genre.objects.get_or_create(name_of_genre=data['genre'])
            book.id_genre = genre

        # Обновляем скидку книги, если она указана
        if 'discount' in data:
            discount = get_object_or_404(Discount, name_of_discount=data['discount'])
            book.id_discount = discount

        # Обновляем другие поля книги, если они указаны в запросе
        book.title = data.get('title', book.title)
        book.publishing = data.get('publishing', book.publishing)
        book.price = data.get('price', book.price)
        book.rack_number = data.get('rack_number', book.rack_number)
        book.number_of_copies = data.get('number_of_copies', book.number_of_copies)
        book.discounted_price = data.get('discounted_price', book.discounted_price)
        book.description = data.get('description', book.description)

        # Сохраняем обновленную книгу
        book.save()

        # Обновляем авторов книги, если они указаны
        if 'authors' in data:
            authors = data['authors']

            # Удаляем старые связи с авторами
            AuthorsOfBook.objects.filter(id_book=book).delete()

            for author_data in authors:
                author, created = Author.objects.get_or_create(
                    author_last_name=author_data['last_name'],
                    author_first_name=author_data['first_name'],
                    author_patronymic=author_data.get('patronymic', None)
                )
                AuthorsOfBook.objects.create(id_author=author, id_book=book)

        return Response({"status": "success", "message": "Book updated successfully.", "book_id": book.id_book}, status=status.HTTP_200_OK)


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


class BookDetailsView(APIView):
    def get(self, request, *args, **kwargs):
        book_numbers = BookNumber.objects.all()
        serializer = BookNumberSerializer(book_numbers, many=True)
        return Response(serializer.data)


