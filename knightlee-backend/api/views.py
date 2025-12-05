# api/views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.conf import settings

from .serializers import (
    RegisterSerializer, IncidentSerializer, UserProfileSerializer, SOSSerializer
)
from .models import Incident, UserProfile, SOSAlert
from .utils import fetch_route, calculate_safety

# Auth
@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "User registered"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
@permission_classes([AllowAny])
def login(request):
    username = request.data.get("username")
    password = request.data.get("password")
    user = authenticate(username=username, password=password)
    if not user:
        return Response({"detail": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)
    refresh = RefreshToken.for_user(user)
    return Response({"refresh": str(refresh), "access": str(refresh.access_token)})

# Route
@api_view(["GET"])
# @permission_classes([IsAuthenticated])
def get_route(request):
    start = request.GET.get("start")   # expected "lng,lat"
    end = request.GET.get("end")       # expected "lng,lat"
    mode = request.GET.get("mode", "fastest")
    if not start or not end:
        return Response({"detail":"start and end required"}, status=status.HTTP_400_BAD_REQUEST)

    data = fetch_route(start, end, mode="driving")
    routes = data.get("routes", [])
    if not routes:
        return Response({"detail":"no routes"}, status=status.HTTP_404_NOT_FOUND)

    if mode == "fastest":
        chosen = routes[0]
        chosen["safety_score"] = calculate_safety(chosen)
    else:  # safest
        best = None
        best_score = -1
        for r in routes:
            s = calculate_safety(r)
            if s > best_score:
                best_score = s
                best = r
        chosen = best
        chosen["safety_score"] = best_score

    return Response(chosen)

# Incidents
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_incidents(request):
    incidents = Incident.objects.all().order_by("-timestamp")
    serializer = IncidentSerializer(incidents, many=True)
    return Response(serializer.data)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def report_incident(request):
    serializer = IncidentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def upvote_incident(request, id):
    try:
        inc = Incident.objects.get(id=id)
    except Incident.DoesNotExist:
        return Response({"detail":"not found"}, status=status.HTTP_404_NOT_FOUND)
    inc.upvotes += 1
    inc.save()
    return Response({"id": inc.id, "upvotes": inc.upvotes})

# Road segment placeholder (using incidents as proxy)
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def road_segment(request, id):
    # for MVP we return incidents for that id (you can replace with real segments later)
    try:
        inc = Incident.objects.get(id=id)
    except Incident.DoesNotExist:
        return Response({"detail":"not found"}, status=status.HTTP_404_NOT_FOUND)
    score = max(0, 100 - inc.upvotes * 5)
    return Response({
        "segment_id": id,
        "incident": IncidentSerializer(inc).data,
        "safety_score": score
    })

# SOS
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def sos(request):
    serializer = SOSSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        # Optionally: trigger notifications here (SMS/email) — omitted for MVP
        return Response({"message":"SOS created"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Safe points (mocked)
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def safe_points(request):
    near = request.GET.get("near")
    if not near:
        return Response({"detail":"near parameter required (lat,lng)"}, status=status.HTTP_400_BAD_REQUEST)
    lat, lng = map(float, near.split(","))
    data = [
        {"name":"Police Station","latitude":lat+0.001,"longitude":lng+0.001},
        {"name":"Hospital","latitude":lat-0.001,"longitude":lng-0.001},
        {"name":"24/7 Shop","latitude":lat+0.002,"longitude":lng},
    ]
    return Response(data)

# User profile
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_profile(request):
    prof, _ = UserProfile.objects.get_or_create(user=request.user)
    serializer = UserProfileSerializer(prof)
    return Response(serializer.data)

@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_profile(request):
    prof, _ = UserProfile.objects.get_or_create(user=request.user)
    serializer = UserProfileSerializer(prof, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
