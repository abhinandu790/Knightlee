# # api/views.py

# from django.contrib.auth import authenticate, get_user_model
# from rest_framework import status
# from rest_framework.permissions import AllowAny, IsAuthenticated
# from rest_framework.response import Response
# from rest_framework_simplejwt.tokens import RefreshToken
# from rest_framework.decorators import api_view, permission_classes, authentication_classes

# from .models import (
#     BlackSpot,
#     Incident,
#     UserProfile,
#     SOSAlert,
#     CrimeHeatData,
# )
# from .serializers import (
#     RegisterSerializer,
#     UserSerializer,
#     IncidentSerializer,
#     UserProfileSerializer,
#     SOSSerializer,
#     BlackSpotSerializer,
# )
# from .utils import (
#     fetch_route,
#     calculate_safety,
#     fetch_route_from_mapbox,
#     analyze_route_blackspots,
# )


# User = get_user_model()


# # =========================
# # AUTH
# # =========================

# @api_view(["POST"])
# @permission_classes([AllowAny])
# def register_view(request):
#     """
#     POST /api/auth/register/
#     Body: { first_name, last_name, email, password }
#     """
#     serializer = RegisterSerializer(data=request.data)
#     serializer.is_valid(raise_exception=True)

#     user = serializer.save()
#     refresh = RefreshToken.for_user(user)

#     return Response(
#         {
#             "user": UserSerializer(user).data,
#             "access": str(refresh.access_token),
#             "refresh": str(refresh),
#         },
#         status=status.HTTP_201_CREATED,
#     )


# @api_view(["POST"])
# @permission_classes([AllowAny])
# def login_view(request):
#     """
#     POST /api/auth/login/
#     Body: { email, password }
#     """
#     email = request.data.get("email")
#     password = request.data.get("password")

#     if not email or not password:
#         return Response(
#             {"detail": "Email and password are required."},
#             status=status.HTTP_400_BAD_REQUEST,
#         )

#     # Use email to find user, then authenticate via username
#     try:
#         user_obj = User.objects.get(email=email)
#         username = user_obj.username
#     except User.DoesNotExist:
#         return Response(
#             {"detail": "Invalid credentials"},
#             status=status.HTTP_400_BAD_REQUEST,
#         )

#     user = authenticate(request=request, username=username, password=password)
#     if not user:
#         return Response(
#             {"detail": "Invalid credentials"},
#             status=status.HTTP_400_BAD_REQUEST,
#         )

#     refresh = RefreshToken.for_user(user)

#     return Response(
#         {
#             "user": UserSerializer(user).data,
#             "access": str(refresh.access_token),
#             "refresh": str(refresh),
#         },
#         status=status.HTTP_200_OK,
#     )


# # =========================
# # BASIC ROUTE (local utils)
# # =========================

# @api_view(["GET"])
# # @permission_classes([IsAuthenticated])  # enable later if needed
# def get_route(request):
#     """
#     GET /api/route/?start=lng,lat&end=lng,lat&mode=fastest|safest
#     Uses local fetch_route + calculate_safety
#     """
#     start = request.GET.get("start")   # "lng,lat"
#     end = request.GET.get("end")       # "lng,lat"
#     mode = request.GET.get("mode", "fastest")

#     if not start or not end:
#         return Response({"detail": "start and end required"}, status=status.HTTP_400_BAD_REQUEST)

#     data = fetch_route(start, end, mode="driving")
#     routes = data.get("routes", [])
#     if not routes:
#         return Response({"detail": "no routes"}, status=status.HTTP_404_NOT_FOUND)

#     if mode == "fastest":
#         chosen = routes[0]
#         chosen["safety_score"] = calculate_safety(chosen)
#     else:  # safest
#         best = None
#         best_score = -1
#         for r in routes:
#             s = calculate_safety(r)
#             if s > best_score:
#                 best_score = s
#                 best = r
#         chosen = best
#         chosen["safety_score"] = best_score

#     return Response(chosen)


# # =========================
# # ROUTE ANALYZE WITH BLACKSPOTS
# # =========================


# # @api_view(["GET"])
# # @authentication_classes([])   
# # @permission_classes([AllowAny])

# # def route_analyze(request):
# #     start = request.GET.get("start")
# #     end = request.GET.get("end")

# #     if not start or not end:
# #         return Response({"detail": "start and end are required"}, status=400)

# #     # Dummy response for now – just to test
# #     return Response(
# #         {
# #             "distance_km": 12.4,
# #             "safety_score": 82,
# #             "blackspots_detected": True,
# #             "message": "Route analyze working ✅",
# #             "start": start,
# #             "end": end,
# #         },
# #         status=200,
# #     )

   
# # def route_analyze(request):
# #     """
# #     GET /api/route-analyze/?start=lng,lat&end=lng,lat

# #     Uses Mapbox + blackspot analysis.
# #     """
# #     try:
# #         start = request.query_params.get("start")
# #         end = request.query_params.get("end")

# #         if not start or not end:
# #             return Response(
# #                 {"detail": "start and end are required as 'lng,lat'"},
# #                 status=status.HTTP_400_BAD_REQUEST,
# #             )

# #         try:
# #             start_lng, start_lat = [float(x) for x in start.split(",")]
# #             end_lng, end_lat = [float(x) for x in end.split(",")]
# #         except ValueError:
# #             return Response(
# #                 {"detail": "Invalid start/end format. Use 'lng,lat'."},
# #                 status=status.HTTP_400_BAD_REQUEST,
# #             )

# #         # 1) Mapbox route
# #         route = fetch_route_from_mapbox(start_lng, start_lat, end_lng, end_lat)
# #         geometry = route["geometry"]  # GeoJSON LineString
# #         distance_km = route["distance"] / 1000.0
# #         duration_min = route["duration"] / 60.0  # not used but available

# #         # 2) Analyze blackspots using SQLite data
# #         summary, blackspots_geojson = analyze_route_blackspots(geometry, buffer_km=1.0)
# #         summary["route_distance_km"] = round(distance_km, 2)

# #         safety_score = summary["safety_percentage"]

# #         data = {
# #             "route": {
# #                 "geometry": geometry,
# #                 "distance": route["distance"],
# #                 "duration": route["duration"],
# #             },
# #             "summary": summary,
# #             "blackspots_geojson": blackspots_geojson,
# #             "safety_score": safety_score,
# #         }
# #         return Response(data)
# #     except Exception as e:
# #         print("route_analyze error:", e)
# #         return Response(
# #             {"detail": "Failed to analyze route"},
# #             status=status.HTTP_500_INTERNAL_SERVER_ERROR,
# #         )

# @api_view(["GET"])
# @authentication_classes([])      # ✅ disable JWT here so no 401 even if token is bad
# @permission_classes([AllowAny])  # ✅ public endpoint
# def route_analyze(request):
#     """
#     Analyze a route between start and end, and compute safety based on nearby blackspots.

#     Query params:
#       - start: "lng,lat"
#       - end:   "lng,lat"
#     """
#     # Accept both request.query_params and request.GET for safety
#     start = request.query_params.get("start") or request.GET.get("start")
#     end = request.query_params.get("end") or request.GET.get("end")

#     if not start or not end:
#         return Response(
#             {"detail": "start and end are required as 'lng,lat'"},
#             status=status.HTTP_400_BAD_REQUEST,
#         )

#     # Parse "lng,lat" → floats
#     try:
#         start_lng, start_lat = [float(x) for x in start.split(",")]
#         end_lng, end_lat = [float(x) for x in end.split(",")]
#     except (ValueError, TypeError):
#         return Response(
#             {"detail": "Invalid start/end format. Use 'lng,lat'."},
#             status=status.HTTP_400_BAD_REQUEST,
#         )

#     try:
#         # 1) Fetch route from Mapbox
#         route = fetch_route_from_mapbox(start_lng, start_lat, end_lng, end_lat)
#         geometry = route["geometry"]      # GeoJSON LineString
#         distance_km = route["distance"] / 1000.0  # meters → km

#         # 2) Analyze blackspots along the route
#         summary, blackspots_geojson = analyze_route_blackspots(
#             geometry,
#             buffer_km=1.0,  # you can tweak this if needed
#         )
#         summary["route_distance_km"] = round(distance_km, 2)

#         safety_score = summary.get("safety_percentage")

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
#         # Good for debugging in your runserver console
#         print("route_analyze error:", e)
#         return Response(
#             {"detail": "Failed to analyze route"},
#             status=status.HTTP_500_INTERNAL_SERVER_ERROR,
#         )

# # =========================
# # INCIDENTS
# # =========================

# @api_view(["GET"])
# @permission_classes([IsAuthenticated])
# def list_incidents(request):
#     incidents = Incident.objects.all().order_by("-timestamp")
#     serializer = IncidentSerializer(incidents, many=True)
#     return Response(serializer.data)


# @api_view(["POST"])
# @permission_classes([IsAuthenticated])
# def report_incident(request):
#     serializer = IncidentSerializer(data=request.data)
#     if serializer.is_valid():
#         serializer.save(user=request.user)
#         return Response(serializer.data, status=status.HTTP_201_CREATED)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# @api_view(["POST"])
# @permission_classes([IsAuthenticated])
# def upvote_incident(request, id):
#     try:
#         inc = Incident.objects.get(id=id)
#     except Incident.DoesNotExist:
#         return Response({"detail": "not found"}, status=status.HTTP_404_NOT_FOUND)
#     inc.upvotes += 1
#     inc.save()
#     return Response({"id": inc.id, "upvotes": inc.upvotes})


# @api_view(["GET"])
# @permission_classes([IsAuthenticated])
# def road_segment(request, id):
#     """
#     MVP: return incident + simple safety score for given id
#     """
#     try:
#         inc = Incident.objects.get(id=id)
#     except Incident.DoesNotExist:
#         return Response({"detail": "not found"}, status=status.HTTP_404_NOT_FOUND)

#     score = max(0, 100 - inc.upvotes * 5)
#     return Response(
#         {
#             "segment_id": id,
#             "incident": IncidentSerializer(inc).data,
#             "safety_score": score,
#         }
#     )


# # =========================
# # SOS
# # =========================

# @api_view(["POST"])
# @permission_classes([IsAuthenticated])
# def sos(request):
#     serializer = SOSSerializer(data=request.data)
#     if serializer.is_valid():
#         serializer.save(user=request.user)
#         # TODO: trigger notifications (SMS/email) if needed
#         return Response({"message": "SOS created"}, status=status.HTTP_201_CREATED)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# # =========================
# # SAFE POINTS (MOCK)
# # =========================

# @api_view(["GET"])
# @permission_classes([IsAuthenticated])
# def safe_points(request):
#     """
#     GET /api/safe-points/?near=lat,lng
#     """
#     near = request.GET.get("near")
#     if not near:
#         return Response(
#             {"detail": "near parameter required (lat,lng)"},
#             status=status.HTTP_400_BAD_REQUEST,
#         )

#     lat, lng = map(float, near.split(","))
#     data = [
#         {"name": "Police Station", "latitude": lat + 0.001, "longitude": lng + 0.001},
#         {"name": "Hospital", "latitude": lat - 0.001, "longitude": lng - 0.001},
#         {"name": "24/7 Shop", "latitude": lat + 0.002, "longitude": lng},
#     ]
#     return Response(data)


# # =========================
# # USER PROFILE
# # =========================

# @api_view(["GET"])
# @permission_classes([IsAuthenticated])
# def user_profile(request):
#     prof, _ = UserProfile.objects.get_or_create(user=request.user)
#     serializer = UserProfileSerializer(prof)
#     return Response(serializer.data)


# @api_view(["PUT"])
# @permission_classes([IsAuthenticated])
# def update_profile(request):
#     prof, _ = UserProfile.objects.get_or_create(user=request.user)
#     serializer = UserProfileSerializer(prof, data=request.data, partial=True)
#     if serializer.is_valid():
#         serializer.save()
#         return Response(serializer.data)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# # =========================
# # GEOJSON ENDPOINTS
# # =========================

# @api_view(["GET"])
# @authentication_classes([])   
# @permission_classes([AllowAny])
# def incidents_geojson(request):
#     incidents = Incident.objects.all()
#     features = []
#     for inc in incidents:
#         features.append(
#             {
#                 "type": "Feature",
#                 "geometry": {
#                     "type": "Point",
#                     "coordinates": [inc.longitude, inc.latitude],
#                 },
#                 "properties": {
#                     "incident_type": inc.incident_type,
#                     "upvotes": inc.upvotes,
#                 },
#             }
#         )
#     return Response(
#         {
#             "type": "FeatureCollection",
#             "features": features,
#         }
#     )


# @api_view(["GET"])
# @permission_classes([AllowAny])
# def crime_geojson(request):
#     """
#     Simple crime points with equal weight.
#     """
#     incidents = Incident.objects.all()
#     return Response(
#         {
#             "type": "FeatureCollection",
#             "features": [
#                 {
#                     "type": "Feature",
#                     "geometry": {
#                         "type": "Point",
#                         "coordinates": [i.longitude, i.latitude],
#                     },
#                     "properties": {"weight": 1},
#                 }
#                 for i in incidents
#             ],
#         }
#     )


# @api_view(["GET"])
# @permission_classes([AllowAny])
# def blackspot_geojson(request):
#     spots = BlackSpot.objects.all()
#     return Response(
#         {
#             "type": "FeatureCollection",
#             "features": [
#                 {
#                     "type": "Feature",
#                     "geometry": {
#                         "type": "Point",
#                         "coordinates": [s.longitude, s.latitude],
#                     },
#                     "properties": {"name": s.name, "severity": s.severity},
#                 }
#                 for s in spots
#             ],
#         }
#     )


# @api_view(["GET"])
# @permission_classes([AllowAny])
# def blackspot_list(request):
#     blackspots = BlackSpot.objects.all()
#     serializer = BlackSpotSerializer(blackspots, many=True)
#     return Response(serializer.data)


# @api_view(["GET"])
# @permission_classes([AllowAny])
# def crime_heatmap_geojson(request):
#     """
#     GeoJSON for heatmap: all CrimeHeatData rows.
#     """
#     features = []

#     for obj in CrimeHeatData.objects.all():
#         features.append(
#             {
#                 "type": "Feature",
#                 "properties": {
#                     "city": obj.city,
#                     "crime_description": obj.crime_description,
#                     "crime_domain": obj.crime_domain,
#                     "victim_age": obj.victim_age,
#                     "weapon_used": obj.weapon_used,
#                 },
#                 "geometry": {
#                     "type": "Point",
#                     "coordinates": [obj.longitude, obj.latitude],  # [lng, lat]
#                 },
#             }
#         )

#     geojson = {
#         "type": "FeatureCollection",
#         "features": features,
#     }

#     return Response(geojson)


# # =========================
# # BLACKSPOTS ALONG ROUTE
# # =========================

# @api_view(["GET"])
# @permission_classes([AllowAny])
# def blackspots_along_route(request):
#     """
#     GET /api/blackspots-route/?start_lng=..&start_lat=..&end_lng=..&end_lat=..&buffer_km=1

#     Returns:
#     {
#       "summary": {...},
#       "geojson": { FeatureCollection of blackspots along route }
#     }
#     """
#     try:
#         start_lng = float(request.query_params.get("start_lng"))
#         start_lat = float(request.query_params.get("start_lat"))
#         end_lng = float(request.query_params.get("end_lng"))
#         end_lat = float(request.query_params.get("end_lat"))
#         buffer_km = float(request.query_params.get("buffer_km", 1.0))
#     except (TypeError, ValueError):
#         return Response(
#             {"detail": "Invalid or missing route coordinates"}, status=400
#         )

#     route_distance_km = haversine_km(start_lat, start_lng, end_lat, end_lng)

#     features = []
#     severities = []
#     min_distance = None

#     for spot in BlackSpot.objects.all():
#         d = point_segment_distance_km(
#             spot.longitude,
#             spot.latitude,
#             start_lng,
#             start_lat,
#             end_lng,
#             end_lat,
#         )

#         if d <= buffer_km:
#             severities.append(spot.severity)
#             if min_distance is None or d < min_distance:
#                 min_distance = d

#             features.append(
#                 {
#                     "type": "Feature",
#                     "properties": {
#                         "id": spot.id,
#                         "name": spot.name,
#                         "severity": spot.severity,
#                         "distance_km": round(d, 3),
#                     },
#                     "geometry": {
#                         "type": "Point",
#                         "coordinates": [spot.longitude, spot.latitude],
#                     },
#                 }
#             )

#     total_blackspots = len(features)
#     avg_severity = (
#         sum(severities) / total_blackspots if total_blackspots > 0 else 0
#     )
#     max_severity = max(severities) if severities else 0

#     if route_distance_km > 0 and total_blackspots > 0:
#         total_severity = sum(severities)
#         risk_per_km = total_severity / max(route_distance_km, 0.1)
#         normalized_risk = min(risk_per_km / 3.0, 1.0)
#         safety_percentage = round((1.0 - normalized_risk) * 100)
#     else:
#         safety_percentage = 100  # no blackspots → fully safe

#     summary = {
#         "route_distance_km": round(route_distance_km, 2),
#         "total_blackspots": total_blackspots,
#         "avg_severity": round(avg_severity, 2),
#         "max_severity": max_severity,
#         "min_distance_km": round(min_distance, 2)
#         if min_distance is not None
#         else None,
#         "buffer_km": buffer_km,
#         "safety_percentage": safety_percentage,
#     }

#     geojson = {
#         "type": "FeatureCollection",
#         "features": features,
#     }

#     return Response(
#         {
#             "summary": summary,
#             "geojson": geojson,
#         }
#     )
# @api_view(["GET"])
# @permission_classes([AllowAny])
# def blackspots_along_route(request):
#     """
#     GET /api/blackspots-route/?start_lng=..&start_lat=..&end_lng=..&end_lat=..&buffer_km=1
#     """
#     try:
#         start_lng = float(request.query_params.get("start_lng"))
#         start_lat = float(request.query_params.get("start_lat"))
#         end_lng = float(request.query_params.get("end_lng"))
#         end_lat = float(request.query_params.get("end_lat"))
#         buffer_km = float(request.query_params.get("buffer_km", 1.0))
#     except (TypeError, ValueError):
#         return Response({"detail": "Invalid or missing route coordinates"}, status=400)

#     route_distance_km = haversine_km(start_lat, start_lng, end_lat, end_lng)

#     features = []
#     severities = []
#     min_distance = None

#     for spot in BlackSpot.objects.all():
#         d = point_segment_distance_km(
#             spot.longitude, spot.latitude,
#             start_lng, start_lat,
#             end_lng, end_lat,
#         )

#         if d <= buffer_km:
#             severities.append(spot.severity)
#             if min_distance is None or d < min_distance:
#                 min_distance = d

#             features.append({
#                 "type": "Feature",
#                 "properties": {
#                     "id": spot.id,
#                     "name": spot.name,
#                     "severity": spot.severity,
#                     "distance_km": round(d, 3),
#                 },
#                 "geometry": {
#                     "type": "Point",
#                     "coordinates": [spot.longitude, spot.latitude],
#                 },
#             })

#     total_blackspots = len(features)
#     avg_severity = sum(severities) / total_blackspots if total_blackspots > 0 else 0
#     max_severity = max(severities) if severities else 0

#     if route_distance_km > 0 and total_blackspots > 0:
#         total_severity = sum(severities)
#         risk_per_km = total_severity / max(route_distance_km, 0.1)
#         normalized_risk = min(risk_per_km / 3.0, 1.0)
#         safety_percentage = round((1.0 - normalized_risk) * 100)
#     else:
#         safety_percentage = 100  # no blackspots → fully safe

#     summary = {
#         "route_distance_km": round(route_distance_km, 2),
#         "total_blackspots": total_blackspots,
#         "avg_severity": round(avg_severity, 2),
#         "max_severity": max_severity,
#         "min_distance_km": round(min_distance, 2) if min_distance is not None else None,
#         "buffer_km": buffer_km,
#         "safety_percentage": safety_percentage,
#     }

#     geojson = {
#         "type": "FeatureCollection",
#         "features": features,
#     }

#     return Response({
#         "summary": summary,
#         "geojson": geojson,
#     })
from django.contrib.auth import authenticate, get_user_model
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from django.conf import settings

from shapely.geometry import LineString, Point
import requests
from math import radians, sin, cos, sqrt, atan2

from .models import BlackSpot, Incident, UserProfile, SOSAlert, CrimeHeatData
from .serializers import (
    RegisterSerializer, UserSerializer, IncidentSerializer,
    UserProfileSerializer, SOSSerializer, BlackSpotSerializer
)

User = get_user_model()


# =========================================================
# AUTH
# =========================================================
@api_view(["POST"])
@permission_classes([AllowAny])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    user = serializer.save()
    refresh = RefreshToken.for_user(user)

    return Response(
        {"user": UserSerializer(user).data, "access": str(refresh.access_token), "refresh": str(refresh)},
        status=201
    )


@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):
    email = request.data.get("email")
    password = request.data.get("password")

    if not email or not password:
        return Response({"detail": "Email and password required"}, status=400)

    try:
        user_obj = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"detail": "Invalid credentials"}, status=400)

    user = authenticate(request=request, username=user_obj.username, password=password)
    if not user:
        return Response({"detail": "Invalid credentials"}, status=400)

    refresh = RefreshToken.for_user(user)

    return Response(
        {"user": UserSerializer(user).data, "access": str(refresh.access_token), "refresh": str(refresh)},
        status=200
    )


# =========================================================
# HELPER: Distance Function
# =========================================================
def haversine(lat1, lon1, lat2, lon2):
    R = 6371  # km
    d_lat = radians(lat2 - lat1)
    d_lon = radians(lon2 - lon1)

    a = sin(d_lat/2)**2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(d_lon/2)**2
    return R * (2 * atan2(sqrt(a), sqrt(1 - a)))


# =========================================================
# MAIN FEATURE: ROUTE SAFETY ANALYSIS
# =========================================================
# @api_view(["GET"])
# @authentication_classes([])  # public
# @permission_classes([AllowAny])
# def route_analyze(request):
#     start = request.GET.get("start")
#     end = request.GET.get("end")

#     if not start or not end:
#         return Response({"detail": "start and end required as lng,lat"}, status=400)

#     try:
#         start_lng, start_lat = map(float, start.split(","))
#         end_lng, end_lat = map(float, end.split(","))
#     except:
#         return Response({"detail": "Invalid coordinate format"}, status=400)

#     # ---- Fetch route from Mapbox ----
#     url = (
#         f"https://api.mapbox.com/directions/v5/mapbox/driving/"
#         f"{start_lng},{start_lat};{end_lng},{end_lat}"
#         f"?overview=full&geometries=geojson&access_token={settings.MAPBOX_TOKEN}"
#     )

#     res = requests.get(url).json()

#     try:
#         coords = res["routes"][0]["geometry"]["coordinates"]
#         distance_km = round(res["routes"][0]["distance"] / 1000, 2)
#     except:
#         return Response({"detail": "No route found"}, status=404)

#     route_line = LineString(coords)

#     # ---- Detect Blackspots (manual distance check) ----
#     detected = 0
#     severity_sum = 0

#     for spot in BlackSpot.objects.all():
#         dist = haversine(route_line.centroid.y, route_line.centroid.x, spot.latitude, spot.longitude)

#         if dist <= 2:  # 2km tolerance
#             detected += 1
#             severity_sum += spot.severity

#     # ---- Safety Score ----
#     safety_score = max(10, 100 - (severity_sum * 2)) if detected > 0 else 100

#     return Response(
#         {
#             "start": start,
#             "end": end,
#             "distance_km": distance_km,
#             "blackspots_detected": detected,
#             "safety_score": safety_score,
#             "message": "Route analyzed successfully 🚦",
#         },
#         status=200,
#     )

@api_view(["GET"])
@authentication_classes([])  # Public
@permission_classes([AllowAny])
def route_analyze(request):
    """
    Analyze route safety based on proximity of blackspots to the road.
    """

    start = request.GET.get("start")
    end = request.GET.get("end")

    if not start or not end:
        return Response({"detail": "start and end required as lng,lat"}, status=400)

    try:
        start_lng, start_lat = map(float, start.split(","))
        end_lng, end_lat = map(float, end.split(","))
    except:
        return Response({"detail": "Invalid coordinate format"}, status=400)

    # ---- Fetch Mapbox Route ----
    url = (
        f"https://api.mapbox.com/directions/v5/mapbox/driving/"
        f"{start_lng},{start_lat};{end_lng},{end_lat}"
        f"?overview=full&geometries=geojson&access_token={settings.MAPBOX_TOKEN}"
    )

    res = requests.get(url).json()

    try:
        coords = res["routes"][0]["geometry"]["coordinates"]
        distance_km = round(res["routes"][0]["distance"] / 1000, 2)
    except:
        return Response({"detail": "No route found"}, status=404)

    route_line = LineString(coords)  # FULL line, not centroid

    # ---- Blackspot Distance + Severity Calculation ----
    detected_blackspots = 0
    total_severity = 0
    buffer_distance_km = 1.2  # max distance allowed per blackspot along road

    for spot in BlackSpot.objects.all():
        # convert blackspot into point
        spot_point = Point(spot.longitude, spot.latitude)

        # measure perpendicular distance from blackspot → route polyline
        dist_deg = route_line.distance(spot_point)

        # Convert degrees to km (approx for Kerala)
        dist_km = dist_deg * 111  # Approx conversion

        if dist_km <= buffer_distance_km:
            detected_blackspots += 1
            total_severity += spot.severity

    # ---- Safety Scoring ----
    if detected_blackspots == 0:
        safety_score = 100
    else:
        # severity impact (adjustable formula)
        impact = min(total_severity * 4, 95)
        safety_score = max(5, 100 - impact)

    return Response(
        {
            "start": start,
            "end": end,
            "distance_km": distance_km,
            "blackspots_detected": detected_blackspots,
            "total_severity_points": total_severity,
            "safety_score": safety_score,
            "message": "Route analyzed successfully 🚦",
        },
        status=200,
    )

# =========================================================
# INCIDENT API
# =========================================================
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_incidents(request):
    return Response(IncidentSerializer(Incident.objects.all(), many=True).data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def report_incident(request):
    serializer = IncidentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


# =========================================================
# SOS
# =========================================================
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def sos(request):
    serializer = SOSSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response({"message": "SOS sent"}, status=201)
    return Response(serializer.errors, status=400)


# =========================================================
# USER PROFILE
# =========================================================
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_profile(request):
    profile, _ = UserProfile.objects.get_or_create(user=request.user)
    return Response(UserProfileSerializer(profile).data)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_profile(request):
    profile, _ = UserProfile.objects.get_or_create(user=request.user)
    serializer = UserProfileSerializer(profile, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)


# =========================================================
# GEOJSON ENDPOINTS
# =========================================================
@api_view(["GET"])
@authentication_classes([])
@permission_classes([AllowAny])
def incidents_geojson(request):
    return Response({
        "type": "FeatureCollection",
        "features": [
            {"type": "Feature", "geometry": {"type": "Point", "coordinates": [i.longitude, i.latitude]},
             "properties": {"type": i.incident_type}}
            for i in Incident.objects.all()
        ]
    })


@api_view(["GET"])
@authentication_classes([])
@permission_classes([AllowAny])
def blackspot_geojson(request):
    return Response({
        "type": "FeatureCollection",
        "features": [
            {"type": "Feature", "geometry": {"type": "Point", "coordinates": [s.longitude, s.latitude]},
             "properties": {"name": s.name, "severity": s.severity}}
            for s in BlackSpot.objects.all()
        ]
    })
@api_view(["GET"])
@authentication_classes([])   
@permission_classes([AllowAny])
def crime_heatmap_geojson(request):
    """Return crime data as GeoJSON for heatmap display."""
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
                    "weight": 1  # required for heatmap intensity
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [obj.longitude, obj.latitude],
                },
            }
        )

    return Response(
        {
            "type": "FeatureCollection",
            "features": features,
        }
    )
