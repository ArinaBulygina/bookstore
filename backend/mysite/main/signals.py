from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import BookNumber, Book, Sale


@receiver(post_save, sender=BookNumber)
def update_number_of_copies_on_add(sender, instance, created, **kwargs):
    # Обновляем количество копий только для созданных записей
    if created:
        book = instance.id_book
    else:
        # Если запись была обновлена, нужно также пересчитывать копии
        book = instance.id_book

    # Считаем только те экземпляры, которые не проданы
    book.number_of_copies = BookNumber.objects.filter(id_book=book, status="Не продан").count()
    book.save()


@receiver(post_delete, sender=BookNumber)
def update_number_of_copies_on_delete(sender, instance, **kwargs):
    book = instance.id_book
    # Считаем только те экземпляры, которые не проданы
    book.number_of_copies = BookNumber.objects.filter(id_book=book, status="Не продан").count()
    book.save()


@receiver(post_save, sender=Sale)
def update_book_status(sender, instance, created, **kwargs):
    if created:
        # Получаем номер книги, который был продан
        book_number = instance.book_number
        # Обновляем статус книги
        book_number.status = "Продан"
        book_number.save()