# api/serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Incident, UserProfile, SOSAlert

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("username", "email", "password")
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email", ""),
            password=validated_data["password"]
        )
        UserProfile.objects.create(user=user)
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ("emergency_contacts", "night_safety_mode")

class IncidentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Incident
        fields = ("id","user","incident_type","description","latitude","longitude","upvotes","timestamp")
        read_only_fields = ("user","upvotes","timestamp")

class SOSSerializer(serializers.ModelSerializer):
    class Meta:
        model = SOSAlert
        fields = ("id","user","latitude","longitude","timestamp")
        read_only_fields = ("user","timestamp")
from rest_framework import serializers
from .models import BlackSpot

class BlackSpotSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlackSpot
        fields = '__all__'
from django.contrib.auth.models import User
from rest_framework import serializers

class RegisterSerializer(serializers.ModelSerializer):
    firstName = serializers.CharField(write_only=True)
    lastName = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["id", "email", "password", "firstName", "lastName"]
        extra_kwargs = {
            "password": {"write_only": True},
        }

    def create(self, validated_data):
        first_name = validated_data.pop("firstName")
        last_name = validated_data.pop("lastName")
        email = validated_data.get("email")

        # Use email as username
        user = User(
            username=email,
            email=email,
            first_name=first_name,
            last_name=last_name,
        )
        user.set_password(validated_data["password"])
        user.save()
        return user
# api/serializers.py
from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # adjust fields if your user model differs
        fields = ("id", "first_name", "last_name", "email")


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ("id", "first_name", "last_name", "email", "password")

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user
# api/serializers.py
from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "first_name", "last_name", "email")


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ("id", "first_name", "last_name", "email", "password")

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user
# api/serializers.py
from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "first_name", "last_name", "email")


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ("id", "first_name", "last_name", "email", "password")

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user
