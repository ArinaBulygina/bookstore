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

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = '__all__'

class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = '__all__'

class DiscountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Discount
        fields = '__all__'

class SaleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sale
        fields = '__all__'

class AuthorsOfBookSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuthorsOfBook
        fields = '__all__'

class BookNumberSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookNumber
        fields = '__all__'
