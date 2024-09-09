from django.db import models


class Seller(models.Model):
    id_seller = models.IntegerField(primary_key=True)
    password = models.CharField(max_length=255)
    password_hash = models.CharField(max_length=255, unique=True)
    salt = models.CharField(max_length=255, unique=True)
    seller_last_name = models.CharField(max_length=25)
    seller_first_name = models.CharField(max_length=25)
    seller_patronymic = models.CharField(max_length=30, blank=True, null=True)
    email = models.EmailField(max_length=100, unique=True)
    phone_number = models.CharField(max_length=20, unique=True)
    date_of_registration = models.DateField(auto_now_add=True)
    date_of_last_authorization = models.DateField(auto_now=True)
    date_of_last_deauthorization = models.DateField(blank=True, null=True)

    class Meta:
        unique_together = ('password_hash', 'salt')


class Genre(models.Model):
    id_genre = models.AutoField(primary_key=True)
    name_of_genre = models.CharField(max_length=25, unique=True)


class Discount(models.Model):
    id_discount = models.AutoField(primary_key=True)
    name_of_discount = models.CharField(max_length=100, unique=True)
    discount_percentage = models.IntegerField()


class Book(models.Model):
    id_book = models.AutoField(primary_key=True)
    id_genre = models.ForeignKey(Genre, on_delete=models.CASCADE)
    title = models.CharField(max_length=25)
    publishing = models.CharField(max_length=30)
    price = models.FloatField()
    rack_number = models.IntegerField()
    number_of_copies = models.IntegerField(default=0)
    id_discount = models.ForeignKey(Discount, on_delete=models.CASCADE, blank=True, null=True)
    discounted_price = models.FloatField(null=True)
    description = models.CharField(max_length=255)

    class Meta:
        unique_together = ('id_genre', 'title', 'publishing')


class BookNumber(models.Model):
    book_number = models.CharField(max_length=17, primary_key=True)
    id_book = models.ForeignKey(Book, on_delete=models.CASCADE)


class Sale(models.Model):
    id_sale = models.AutoField(primary_key=True)
    book_number = models.ForeignKey(BookNumber, on_delete=models.CASCADE)
    id_seller = models.ForeignKey(Seller, on_delete=models.CASCADE)
    date_of_sale = models.DateField(auto_now=True)
    price_of_sale = models.FloatField()


class Author(models.Model):
    id_author = models.AutoField(primary_key=True)
    author_last_name = models.CharField(max_length=25)
    author_first_name = models.CharField(max_length=25)
    author_patronymic = models.CharField(max_length=25, blank=True, null=True)

    class Meta:
        unique_together = ('author_last_name', 'author_first_name', 'author_patronymic')


class AuthorsOfBook(models.Model):
    id_author = models.ForeignKey(Author, on_delete=models.CASCADE)
    id_book = models.ForeignKey(Book, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('id_author', 'id_book')


