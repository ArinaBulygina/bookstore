from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import BookNumber, Book

@receiver(post_save, sender=BookNumber)
def update_number_of_copies_on_add(sender, instance, created, **kwargs):
    if created:
        book = instance.id_book
        book.number_of_copies = BookNumber.objects.filter(id_book=book).count()
        book.save()

@receiver(post_delete, sender=BookNumber)
def update_number_of_copies_on_delete(sender, instance, **kwargs):
    book = instance.id_book
    book.number_of_copies = BookNumber.objects.filter(id_book=book).count()
    book.save()