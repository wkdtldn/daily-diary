from rest_framework.exceptions import ValidationError
from rest_framework import serializers
from .models import UserModel, Diary, Comment


# User
class UserSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    username = serializers.CharField(required=True, allow_blank=False, max_length=150)
    name = serializers.CharField(required=True, allow_blank=False, max_length=100)
    email = serializers.EmailField(required=True, allow_blank=False, max_length=254)
    password = serializers.CharField(
        required=True, allow_blank=False, max_length=128, write_only=True
    )

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
        instance.password = validated_data.get("password", instance.password)
        instance.save()

        return instance


# Comment
class CommentSerializer(serializers.ModelSerializer):
    like_count = serializers.SerializerMethodField()
    writer_name = serializers.CharField(source="writer.username", read_only=True)
    likes = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = [
            "id",
            "diary",
            "writer_name",
            "created_at",
            "comment",
            "likes",
            "like_count",
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
