# api/views.py

from django.contrib.auth import authenticate, get_user_model
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .models import (
    BlackSpot,
    Incident,
    UserProfile,
    SOSAlert,
    CrimeHeatData,
)
from .serializers import (
    RegisterSerializer,
    UserSerializer,
    IncidentSerializer,
    UserProfileSerializer,
    SOSSerializer,
    BlackSpotSerializer,
)
from .utils import (
    fetch_route,
    calculate_safety,
    fetch_route_from_mapbox,
    analyze_route_blackspots,
)


User = get_user_model()


# =========================
# AUTH
# =========================

@api_view(["POST"])
@permission_classes([AllowAny])
def register_view(request):
    """
    POST /api/auth/register/
    Body: { first_name, last_name, email, password }
    """
    serializer = RegisterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    user = serializer.save()
    refresh = RefreshToken.for_user(user)

    return Response(
        {
            "user": UserSerializer(user).data,
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        },
        status=status.HTTP_201_CREATED,
    )


@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):
    """
    POST /api/auth/login/
    Body: { email, password }
    """
    email = request.data.get("email")
    password = request.data.get("password")

    if not email or not password:
        return Response(
            {"detail": "Email and password are required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Use email to find user, then authenticate via username
    try:
        user_obj = User.objects.get(email=email)
        username = user_obj.username
    except User.DoesNotExist:
        return Response(
            {"detail": "Invalid credentials"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    user = authenticate(request=request, username=username, password=password)
    if not user:
        return Response(
            {"detail": "Invalid credentials"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    refresh = RefreshToken.for_user(user)

    return Response(
        {
            "user": UserSerializer(user).data,
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        },
        status=status.HTTP_200_OK,
    )


# =========================
# BASIC ROUTE (local utils)
# =========================

@api_view(["GET"])
# @permission_classes([IsAuthenticated])  # enable later if needed
def get_route(request):
    """
    GET /api/route/?start=lng,lat&end=lng,lat&mode=fastest|safest
    Uses local fetch_route + calculate_safety
    """
    start = request.GET.get("start")   # "lng,lat"
    end = request.GET.get("end")       # "lng,lat"
    mode = request.GET.get("mode", "fastest")

    if not start or not end:
        return Response({"detail": "start and end required"}, status=status.HTTP_400_BAD_REQUEST)

    data = fetch_route(start, end, mode="driving")
    routes = data.get("routes", [])
    if not routes:
        return Response({"detail": "no routes"}, status=status.HTTP_404_NOT_FOUND)

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


# =========================
# ROUTE ANALYZE WITH BLACKSPOTS
# =========================


@api_view(["GET"])
@authentication_classes([])   
@permission_classes([AllowAny])

def route_analyze(request):
    start = request.GET.get("start")
    end = request.GET.get("end")

    if not start or not end:
        return Response({"detail": "start and end are required"}, status=400)

    # Dummy response for now – just to test
    return Response(
        {
            "distance_km": 12.4,
            "safety_score": 82,
            "blackspots_detected": True,
            "message": "Route analyze working ✅",
            "start": start,
            "end": end,
        },
        status=200,
    )

   
# def route_analyze(request):
#     """
#     GET /api/route-analyze/?start=lng,lat&end=lng,lat

#     Uses Mapbox + blackspot analysis.
#     """
#     try:
#         start = request.query_params.get("start")
#         end = request.query_params.get("end")

#         if not start or not end:
#             return Response(
#                 {"detail": "start and end are required as 'lng,lat'"},
#                 status=status.HTTP_400_BAD_REQUEST,
#             )

#         try:
#             start_lng, start_lat = [float(x) for x in start.split(",")]
#             end_lng, end_lat = [float(x) for x in end.split(",")]
#         except ValueError:
#             return Response(
#                 {"detail": "Invalid start/end format. Use 'lng,lat'."},
#                 status=status.HTTP_400_BAD_REQUEST,
#             )

#         # 1) Mapbox route
#         route = fetch_route_from_mapbox(start_lng, start_lat, end_lng, end_lat)
#         geometry = route["geometry"]  # GeoJSON LineString
#         distance_km = route["distance"] / 1000.0
#         duration_min = route["duration"] / 60.0  # not used but available

#         # 2) Analyze blackspots using SQLite data
#         summary, blackspots_geojson = analyze_route_blackspots(geometry, buffer_km=1.0)
#         summary["route_distance_km"] = round(distance_km, 2)

#         safety_score = summary["safety_percentage"]

#         data = {
#             "route": {
#                 "geometry": geometry,
#                 "distance": route["distance"],
#                 "duration": route["duration"],
#             },
#             "summary": summary,
#             "blackspots_geojson": blackspots_geojson,
#             "safety_score": safety_score,
#         }
#         return Response(data)
#     except Exception as e:
#         print("route_analyze error:", e)
#         return Response(
#             {"detail": "Failed to analyze route"},
#             status=status.HTTP_500_INTERNAL_SERVER_ERROR,
#         )


# =========================
# INCIDENTS
# =========================

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
        return Response({"detail": "not found"}, status=status.HTTP_404_NOT_FOUND)
    inc.upvotes += 1
    inc.save()
    return Response({"id": inc.id, "upvotes": inc.upvotes})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def road_segment(request, id):
    """
    MVP: return incident + simple safety score for given id
    """
    try:
        inc = Incident.objects.get(id=id)
    except Incident.DoesNotExist:
        return Response({"detail": "not found"}, status=status.HTTP_404_NOT_FOUND)

    score = max(0, 100 - inc.upvotes * 5)
    return Response(
        {
            "segment_id": id,
            "incident": IncidentSerializer(inc).data,
            "safety_score": score,
        }
    )


# =========================
# SOS
# =========================

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def sos(request):
    serializer = SOSSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        # TODO: trigger notifications (SMS/email) if needed
        return Response({"message": "SOS created"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# =========================
# SAFE POINTS (MOCK)
# =========================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def safe_points(request):
    """
    GET /api/safe-points/?near=lat,lng
    """
    near = request.GET.get("near")
    if not near:
        return Response(
            {"detail": "near parameter required (lat,lng)"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    lat, lng = map(float, near.split(","))
    data = [
        {"name": "Police Station", "latitude": lat + 0.001, "longitude": lng + 0.001},
        {"name": "Hospital", "latitude": lat - 0.001, "longitude": lng - 0.001},
        {"name": "24/7 Shop", "latitude": lat + 0.002, "longitude": lng},
    ]
    return Response(data)


# =========================
# USER PROFILE
# =========================

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


# =========================
# GEOJSON ENDPOINTS
# =========================

@api_view(["GET"])
@permission_classes([AllowAny])
def incidents_geojson(request):
    incidents = Incident.objects.all()
    features = []
    for inc in incidents:
        features.append(
            {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [inc.longitude, inc.latitude],
                },
                "properties": {
                    "incident_type": inc.incident_type,
                    "upvotes": inc.upvotes,
                },
            }
        )
    return Response(
        {
            "type": "FeatureCollection",
            "features": features,
        }
    )


@api_view(["GET"])
@permission_classes([AllowAny])
def crime_geojson(request):
    """
    Simple crime points with equal weight.
    """
    incidents = Incident.objects.all()
    return Response(
        {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [i.longitude, i.latitude],
                    },
                    "properties": {"weight": 1},
                }
                for i in incidents
            ],
        }
    )


@api_view(["GET"])
@permission_classes([AllowAny])
def blackspot_geojson(request):
    spots = BlackSpot.objects.all()
    return Response(
        {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [s.longitude, s.latitude],
                    },
                    "properties": {"name": s.name, "severity": s.severity},
                }
                for s in spots
            ],
        }
    )


@api_view(["GET"])
@permission_classes([AllowAny])
def blackspot_list(request):
    blackspots = BlackSpot.objects.all()
    serializer = BlackSpotSerializer(blackspots, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([AllowAny])
def crime_heatmap_geojson(request):
    """
    GeoJSON for heatmap: all CrimeHeatData rows.
    """
    features = []

    for obj in CrimeHeatData.objects.all():
        features.append(
            {
                "type": "Feature",
                "properties": {
                    "city": obj.city,
                    "crime_description": obj.crime_description,
                    "crime_domain": obj.crime_domain,
                    "victim_age": obj.victim_age,
                    "weapon_used": obj.weapon_used,
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [obj.longitude, obj.latitude],  # [lng, lat]
                },
            }
        )

    geojson = {
        "type": "FeatureCollection",
        "features": features,
    }

    return Response(geojson)


# =========================
# BLACKSPOTS ALONG ROUTE
# =========================

@api_view(["GET"])
@permission_classes([AllowAny])
def blackspots_along_route(request):
    """
    GET /api/blackspots-route/?start_lng=..&start_lat=..&end_lng=..&end_lat=..&buffer_km=1

    Returns:
    {
      "summary": {...},
      "geojson": { FeatureCollection of blackspots along route }
    }
    """
    try:
        start_lng = float(request.query_params.get("start_lng"))
        start_lat = float(request.query_params.get("start_lat"))
        end_lng = float(request.query_params.get("end_lng"))
        end_lat = float(request.query_params.get("end_lat"))
        buffer_km = float(request.query_params.get("buffer_km", 1.0))
    except (TypeError, ValueError):
        return Response(
            {"detail": "Invalid or missing route coordinates"}, status=400
        )

    route_distance_km = haversine_km(start_lat, start_lng, end_lat, end_lng)

    features = []
    severities = []
    min_distance = None

    for spot in BlackSpot.objects.all():
        d = point_segment_distance_km(
            spot.longitude,
            spot.latitude,
            start_lng,
            start_lat,
            end_lng,
            end_lat,
        )

        if d <= buffer_km:
            severities.append(spot.severity)
            if min_distance is None or d < min_distance:
                min_distance = d

            features.append(
                {
                    "type": "Feature",
                    "properties": {
                        "id": spot.id,
                        "name": spot.name,
                        "severity": spot.severity,
                        "distance_km": round(d, 3),
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [spot.longitude, spot.latitude],
                    },
                }
            )

    total_blackspots = len(features)
    avg_severity = (
        sum(severities) / total_blackspots if total_blackspots > 0 else 0
    )
    max_severity = max(severities) if severities else 0

    if route_distance_km > 0 and total_blackspots > 0:
        total_severity = sum(severities)
        risk_per_km = total_severity / max(route_distance_km, 0.1)
        normalized_risk = min(risk_per_km / 3.0, 1.0)
        safety_percentage = round((1.0 - normalized_risk) * 100)
    else:
        safety_percentage = 100  # no blackspots → fully safe

    summary = {
        "route_distance_km": round(route_distance_km, 2),
        "total_blackspots": total_blackspots,
        "avg_severity": round(avg_severity, 2),
        "max_severity": max_severity,
        "min_distance_km": round(min_distance, 2)
        if min_distance is not None
        else None,
        "buffer_km": buffer_km,
        "safety_percentage": safety_percentage,
    }

    geojson = {
        "type": "FeatureCollection",
        "features": features,
    }

    return Response(
        {
            "summary": summary,
            "geojson": geojson,
        }
    )
@api_view(["GET"])
@permission_classes([AllowAny])
def blackspots_along_route(request):
    """
    GET /api/blackspots-route/?start_lng=..&start_lat=..&end_lng=..&end_lat=..&buffer_km=1
    """
    try:
        start_lng = float(request.query_params.get("start_lng"))
        start_lat = float(request.query_params.get("start_lat"))
        end_lng = float(request.query_params.get("end_lng"))
        end_lat = float(request.query_params.get("end_lat"))
        buffer_km = float(request.query_params.get("buffer_km", 1.0))
    except (TypeError, ValueError):
        return Response({"detail": "Invalid or missing route coordinates"}, status=400)

    route_distance_km = haversine_km(start_lat, start_lng, end_lat, end_lng)

    features = []
    severities = []
    min_distance = None

    for spot in BlackSpot.objects.all():
        d = point_segment_distance_km(
            spot.longitude, spot.latitude,
            start_lng, start_lat,
            end_lng, end_lat,
        )

        if d <= buffer_km:
            severities.append(spot.severity)
            if min_distance is None or d < min_distance:
                min_distance = d

            features.append({
                "type": "Feature",
                "properties": {
                    "id": spot.id,
                    "name": spot.name,
                    "severity": spot.severity,
                    "distance_km": round(d, 3),
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [spot.longitude, spot.latitude],
                },
            })

    total_blackspots = len(features)
    avg_severity = sum(severities) / total_blackspots if total_blackspots > 0 else 0
    max_severity = max(severities) if severities else 0

    if route_distance_km > 0 and total_blackspots > 0:
        total_severity = sum(severities)
        risk_per_km = total_severity / max(route_distance_km, 0.1)
        normalized_risk = min(risk_per_km / 3.0, 1.0)
        safety_percentage = round((1.0 - normalized_risk) * 100)
    else:
        safety_percentage = 100  # no blackspots → fully safe

    summary = {
        "route_distance_km": round(route_distance_km, 2),
        "total_blackspots": total_blackspots,
        "avg_severity": round(avg_severity, 2),
        "max_severity": max_severity,
        "min_distance_km": round(min_distance, 2) if min_distance is not None else None,
        "buffer_km": buffer_km,
        "safety_percentage": safety_percentage,
    }

    geojson = {
        "type": "FeatureCollection",
        "features": features,
    }

    return Response({
        "summary": summary,
        "geojson": geojson,
    })
