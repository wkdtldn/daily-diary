from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission
import uuid
from datetime import datetime


# User
class UserModel(AbstractUser):
    name = models.CharField(max_length=100, null=False, verbose_name="name")
    # profile_img = models.ImageField(
    #     upload_to="profile_imgs/",
    #     default="profile_imgs/profile-default-imgs-for-not-edit-person.png",
    #     blank=True,
    #     null=True,
    # )

    groups = models.ManyToManyField(
        Group,
        related_name="customuser_set",  # 변경된 역참조 이름
        blank=True,
        help_text="The groups this user belongs to.",
        related_query_name="customuser",
    )

    user_permissions = models.ManyToManyField(
        Permission,
        related_name="customuser_set",  # 변경된 역참조 이름
        blank=True,
        help_text="Specific permissions for this user.",
        related_query_name="customuser",
    )

    class Meta:
        ordering = ["username"]


# Diary
class Diary(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    content = models.TextField()
    date = models.DateField()
    time = models.TimeField(auto_now_add=True)
    like = models.IntegerField(default=0)
    writer = models.ForeignKey(UserModel, on_delete=models.CASCADE)


# Comment
class Comment(models.Model):
    id = models.AutoField(primary_key=True, null=False, blank=False)
    diary = models.ForeignKey(Diary, null=False, blank=False, on_delete=models.CASCADE)
    writer = models.ForeignKey(
        UserModel,
        null=False,
        blank=False,
        on_delete=models.CASCADE,
    )
    created_at = models.DateTimeField(auto_now_add=True, null=False, blank=False)
    comment = models.TextField(null=False)
    like = models.ManyToManyField(UserModel, related_name="liked_comments", blank=True)
