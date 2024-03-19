# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Admin(models.Model):
    username = models.CharField(max_length=32)
    password = models.CharField(max_length=32)
    name = models.CharField(max_length=32)
    gender = models.CharField(max_length=1)
    age = models.DecimalField(max_digits=3, decimal_places=0)
    address = models.CharField(max_length=32)
    email = models.CharField(max_length=32)
    phone = models.CharField(max_length=11)

    class Meta:
        managed = False
        db_table = 'admin'


class Book(models.Model):
    title = models.CharField(max_length=32)
    author = models.CharField(max_length=255)
    score = models.DecimalField(max_digits=3, decimal_places=1)
    score_number = models.IntegerField()
    publish = models.CharField(max_length=32)
    date = models.DateField()
    price = models.CharField(max_length=32)
    picture = models.CharField(max_length=64)
    classification = models.CharField(max_length=32)
    intro = models.TextField()
    authorintro = models.TextField(db_column='authorIntro')  # Field name made lowercase.
    directory = models.TextField()

    class Meta:
        managed = False
        db_table = 'book'


class Borrow(models.Model):
    userid = models.ForeignKey('User', models.DO_NOTHING, db_column='userId')  # Field name made lowercase.
    bookid = models.ForeignKey(Book, models.DO_NOTHING, db_column='bookId')  # Field name made lowercase.
    borrowtime = models.DateTimeField()
    returntime = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'borrow'


class Comment(models.Model):
    userid = models.ForeignKey('User', models.DO_NOTHING, db_column='userId')  # Field name made lowercase.
    bookid = models.ForeignKey(Book, models.DO_NOTHING, db_column='bookId')  # Field name made lowercase.
    content = models.CharField(max_length=255)
    score = models.DecimalField(max_digits=3, decimal_places=1)
    time = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'comment'


class Recommend(models.Model):
    userid = models.ForeignKey('User', models.DO_NOTHING, db_column='userId')  # Field name made lowercase.
    bookid = models.CharField(db_column='bookId', max_length=255)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'recommend'


class User(models.Model):
    username = models.CharField(max_length=32)
    password = models.CharField(max_length=32)
    name = models.CharField(max_length=32)
    gender = models.CharField(max_length=1)
    age = models.DecimalField(max_digits=3, decimal_places=0)
    address = models.CharField(max_length=32)
    email = models.CharField(max_length=32)
    phone = models.CharField(max_length=11)
    education = models.CharField(max_length=32, blank=True, null=True)
    major = models.CharField(max_length=32, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'user'
