

from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    emergency_contacts = models.JSONField(default=list, blank=True)
    night_safety_mode = models.BooleanField(default=False)

    def __str__(self):
        return self.user.username


class Incident(models.Model):
    INCIDENT_TYPES = (
        ("harassment", "Harassment"),
        ("theft", "Theft"),
        ("accident", "Accident"),
        ("dark_area", "Dark Area"),
        ("stray_dogs", "Stray Dogs"),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    incident_type = models.CharField(max_length=50, choices=INCIDENT_TYPES)
    description = models.TextField(blank=True)
    latitude = models.FloatField()
    longitude = models.FloatField()
    upvotes = models.IntegerField(default=0)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.incident_type} @ {self.latitude:.5f},{self.longitude:.5f}"


class SOSAlert(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    latitude = models.FloatField()
    longitude = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"SOS by {self.user.username} at {self.timestamp}"


class BlackSpot(models.Model):
    name = models.CharField(max_length=200)
    latitude = models.FloatField()
    longitude = models.FloatField()
    severity = models.IntegerField(default=1)  # 1-5 rating

    def __str__(self):
        return self.name


class CrimeHeatData(models.Model):
    city = models.CharField(max_length=100)
    crime_description = models.CharField(max_length=255, null=True, blank=True)
    crime_domain = models.CharField(max_length=255, null=True, blank=True)
    victim_age = models.IntegerField(null=True, blank=True)
    weapon_used = models.CharField(max_length=100, null=True, blank=True)
    latitude = models.FloatField()
    longitude = models.FloatField()

    def __str__(self):
        return f"{self.city} - {self.crime_description}"

