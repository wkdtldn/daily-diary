from rest_framework.exceptions import ValidationError
from rest_framework import serializers
from drf_extra_fields.fields import Base64ImageField
from .models import UserModel, Follow, Diary, Comment
import base64
from django.db import models


# User
class UserSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    username = serializers.CharField(required=True, allow_blank=False, max_length=150)
    name = serializers.CharField(required=True, allow_blank=False, max_length=100)
    email = serializers.EmailField(required=True, allow_blank=False, max_length=254)
    password = serializers.CharField(
        required=True, allow_blank=False, max_length=128, write_only=True
    )
    image = Base64ImageField(required=False)
    followings = serializers.SerializerMethodField()
    followers = serializers.SerializerMethodField()

    def get_followings(self, obj):
        followings = Follow.objects.filter(follower=obj)
        return [following.following.username for following in followings]

    def get_followers(self, obj):
        followers = Follow.objects.filter(following=obj)
        return [follower.follower.username for follower in followers]

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        # 이미지 필드를 Base64 문자열로 변환
        if instance.image:
            with open(instance.image.path, "rb") as image_file:
                encoded_string = base64.b64encode(image_file.read()).decode("utf-8")
                representation["image"] = f"data:image/jpeg;base64,{encoded_string}"

        return representation

    def create(self, validated_data):
        user = UserModel(
            username=validated_data.get("username"),
            email=validated_data.get("email"),
            name=validated_data.get("name"),
        )
        user.set_password(validated_data.get("password"))
        user.save()
        return user

    def update(self, instance, validated_data):
        instance.name = validated_data.get("name", instance.name)
        instance.username = validated_data.get("username", instance.username)
        instance.email = validated_data.get("email", instance.email)
        instance.image = validated_data.get("image", instance.image)
        # instance.password = validated_data.get("password", instance.password)
        instance.save()

        return instance


# Follow
class FollowSerializer(serializers.ModelSerializer):
    follower = UserSerializer(read_only=True)
    following = serializers.PrimaryKeyRelatedField(queryset=UserModel.objects.all())

    class Meta:
        model = Follow
        fields = ["id", "follower", "following", "created_at"]
        read_only_fields = ["id", "follower", "created_at"]

    def validate(self, attrs):
        request = self.context.get("request")
        follower = request.user
        following = attrs.get("following")

        if follower == following:
            raise serializers.ValidationError("You cannot follow yourself.")

        if Follow.objects.filter(follower=follower, following=following).exists():
            raise serializers.ValidationError("You are already following this user.")

        return attrs

    def create(self, validated_data):
        follower = self.context.get("request").user
        following = validated_data["following"]
        follow = Follow.objects.create(follower=follower, following=following)
        return follow


# Comment
class CommentSerializer(serializers.ModelSerializer):
    like_count = serializers.SerializerMethodField()
    likes = serializers.SerializerMethodField()
    writer_name = serializers.CharField(source="writer.username", read_only=True)

    class Meta:
        model = Comment
        fields = [
            "id",
            "diary",
            "writer_name",
            "created_at",
            "comment",
            "like_count",
            "likes",
        ]
        read_only_fields = ("writer_name", "likes", "like_count", "created_at")

    def get_like_count(self, obj):
        return obj.like.count()

    def get_likes(self, obj):
        return [user.username for user in obj.like.all()]

    def create(self, validated_data):
        request = self.context.get("request")
        writer = request.user if request and request.user.is_authenticated else None

        if writer is None:
            raise serializers.ValidationError(
                "Authentication credentials are required."
            )

        validated_data["writer"] = writer
        return Comment.objects.create(**validated_data)


# Diary
class DiarySerializer(serializers.ModelSerializer):
    writer_name = serializers.CharField(source="writer.username", read_only=True)
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Diary
        fields = "__all__"
        read_only_fields = ("writer",)

    def create(self, validated_data):
        request = self.context.get("request")
        writer = request.user if request and request.user.is_authenticated else None

        if writer is None:
            raise ValidationError("Authentication credentials are required.")

        validated_data["writer"] = writer
        return Diary.objects.create(**validated_data)
