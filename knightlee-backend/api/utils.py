# api/utils.py
import requests
import math
from django.conf import settings
from .models import Incident

def fetch_route(start, end, mode="driving"):
    """
    start, end: strings "lng,lat" (Mapbox expects lng,lat)
    """
    url = "https://api.mapbox.com/directions/v5/mapbox/{mode}/{start};{end}".format(
        mode=mode, start=start, end=end
    )
    params = {
        "geometries": "geojson",
        "steps": "true",
        "alternatives": "true",
        "access_token": settings.MAPBOX_API_KEY,
    }
    resp = requests.get(url, params=params)
    resp.raise_for_status()
    return resp.json()

def get_nearby_incidents(lat, lng, radius_deg=0.002):
    """
    simple euclidean filter in degrees (approx ~200m for ~0.002)
    """
    incidents = Incident.objects.all()
    count = 0
    for inc in incidents:
        dist = math.sqrt((inc.latitude - lat)**2 + (inc.longitude - lng)**2)
        if dist < radius_deg:
            count += 1
    return count

def calculate_safety(route):
    """
    route: one Mapbox route dict (with legs -> steps -> maneuver.location)
    returns safety score 0..100
    """
    score = 100
    for leg in route.get("legs", []):
        for step in leg.get("steps", []):
            loc = step.get("maneuver", {}).get("location")
            if not loc or len(loc) < 2:
                continue
            lng, lat = loc[0], loc[1]
            incidents = get_nearby_incidents(lat, lng)
            score -= incidents * 5
    return max(int(score), 0)
# api/utils.py
import math
import requests
from django.conf import settings
from .models import BlackSpot

MAPBOX_DIRECTIONS_URL = "https://api.mapbox.com/directions/v5/mapbox"

def haversine_km(lat1, lon1, lat2, lon2):
    R = 6371.0
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)

    a = (
        math.sin(dphi / 2) ** 2
        + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c


def fetch_route_from_mapbox(start_lng, start_lat, end_lng, end_lat, profile="driving"):
    coords = f"{start_lng},{start_lat};{end_lng},{end_lat}"
    url = (
        f"{MAPBOX_DIRECTIONS_URL}/{profile}/{coords}"
        f"?geometries=geojson&steps=false&alternatives=false&access_token={settings.MAPBOX_TOKEN}"
    )

    resp = requests.get(url, timeout=15)
    resp.raise_for_status()
    data = resp.json()

    if not data.get("routes"):
        raise ValueError("No route found from Mapbox")

    return data["routes"][0]  # single route
        

def analyze_route_blackspots(route_geojson, buffer_km=1.0):
    """
    route_geojson: { 'type': 'LineString', 'coordinates': [[lng, lat], ...]}
    buffer_km: how far from route to consider blackspots
    """
    coords = route_geojson["coordinates"]
    if not coords:
        return {
            "route_distance_km": 0,
            "total_blackspots": 0,
            "avg_severity": 0,
            "max_severity": 0,
            "min_distance_km": None,
            "buffer_km": buffer_km,
            "safety_percentage": 100,
        }, {"type": "FeatureCollection", "features": []}

    # Pre-compute polyline as (lat, lng) for distance calc
    route_points = [(lat, lng) for (lng, lat) in coords]

    features = []
    severities = []
    distances_to_route = []

    for bs in BlackSpot.objects.all():
        # Approx: distance to nearest route vertex (good enough here)
        d_min = min(
            haversine_km(bs.latitude, bs.longitude, lat, lng)
            for (lat, lng) in route_points
        )

        if d_min <= buffer_km:
            severities.append(bs.severity)
            distances_to_route.append(d_min)

            features.append(
                {
                    "type": "Feature",
                    "properties": {
                        "id": bs.id,
                        "name": bs.name,
                        "severity": bs.severity,
                        "distance_km": round(d_min, 3),
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [bs.longitude, bs.latitude],
                    },
                }
            )

    total = len(features)
    if total == 0:
        summary = {
            "route_distance_km": 0,  # will be filled in by caller
            "total_blackspots": 0,
            "avg_severity": 0,
            "max_severity": 0,
            "min_distance_km": None,
            "buffer_km": buffer_km,
            "safety_percentage": 100,
        }
    else:
        avg_sev = sum(severities) / total
        max_sev = max(severities)
        min_dist = min(distances_to_route)

        # Simple scoring: higher severity + more spots → lower safety
        penalty = avg_sev * 12 + total * 3
        safety_percentage = max(0.0, 100.0 - penalty)

        summary = {
            "route_distance_km": 0,  # filled later
            "total_blackspots": total,
            "avg_severity": round(avg_sev, 2),
            "max_severity": max_sev,
            "min_distance_km": round(min_dist, 3),
            "buffer_km": buffer_km,
            "safety_percentage": round(safety_percentage, 1),
        }

    geojson = {"type": "FeatureCollection", "features": features}
    return summary, geojson
