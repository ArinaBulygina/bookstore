# Generated by Django 5.1 on 2024-08-22 09:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0002_alter_book_description'),
    ]

    operations = [
        migrations.AlterField(
            model_name='seller',
            name='id_seller',
            field=models.IntegerField(primary_key=True, serialize=False),
        ),
    ]
