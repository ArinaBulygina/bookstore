from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from .models import Seller, Book, Author, Genre, Discount, Sale, AuthorsOfBook, BookNumber
import hashlib
import os


class SellerRegistrationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Seller
        fields = ['id_seller', 'seller_last_name', 'seller_first_name', 'seller_patronymic', 'email', 'phone_number',
                  'password']
        extra_kwargs = {'password': {'write_only': True}}  # Скройте пароль при отображении данных

    def create(self, validated_data):
        # Извлекаем пароль из данных
        password = validated_data.pop('password')

        # Генерация соли
        salt = os.urandom(16).hex()

        # Генерация хэша пароля с солью
        password_hash = hashlib.sha256((password + salt).encode('utf-8')).hexdigest()

        validated_data['password'] = make_password(password)

        # Добавляем соль и хэш пароля в данные
        validated_data['salt'] = salt
        validated_data['password_hash'] = password_hash

        # Создаем объект Seller
        seller = Seller.objects.create(**validated_data)

        return seller


class SellerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seller
        fields = '__all__'


class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ['id_genre', 'name_of_genre']


class DiscountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Discount
        fields = ['id_discount', 'name_of_discount', 'discount_percentage']


class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ['id_author', 'author_last_name', 'author_first_name', 'author_patronymic']


class BookSerializer(serializers.ModelSerializer):
    genre = GenreSerializer(source='id_genre', read_only=True)
    discount = DiscountSerializer(source='id_discount', read_only=True)
    authors = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = ['id_book', 'title', 'publishing', 'price', 'rack_number', 'number_of_copies',
                  'discounted_price', 'description', 'genre', 'discount', 'authors']

    def get_authors(self, obj):
        authors_of_book = AuthorsOfBook.objects.filter(id_book=obj)
        authors = Author.objects.filter(id_author__in=[aob.id_author.id_author for aob in authors_of_book])
        return AuthorSerializer(authors, many=True).data


class BookNumberSerializerFull(serializers.ModelSerializer):
    book = BookSerializer(source='id_book', read_only=True)

    class Meta:
        model = BookNumber
        fields = ['book_number', 'book']

class BookNumberSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookNumber
        fields = '__all__'

class SaleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sale
        fields = '__all__'

class AuthorsOfBookSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuthorsOfBook
        fields = '__all__'

