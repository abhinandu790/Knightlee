import csv
import requests
from django.conf import settings
from .models import BlackSpot

MAPBOX_TOKEN = settings.MAPBOX_API_KEY  # ensure this exists in settings.py


def geocode(location, state):
    """Returns (lat, lng) using Mapbox."""
    query = f"{location}, {state}, India"
    url = f"https://api.mapbox.com/geocoding/v5/mapbox.places/{query}.json?access_token={MAPBOX_TOKEN}"

    response = requests.get(url).json()

    if "features" in response and len(response["features"]) > 0:
        lng, lat = response["features"][0]["geometry"]["coordinates"]
        return lat, lng

    return None, None


def load_blackspots(csv_path):
    count = 0

    with open(csv_path, encoding="utf-8") as f:
        reader = csv.DictReader(f)

        for row in reader:
            name = row["Name of Location Place"].strip()
            state = row["State"].strip()

            # Severity calculation → based on "Numbers of Fatalities - Total of all three years"
            fatalities = row["Numbers of Fatalities - Total of all three years"]
            try:
                fatalities = int(fatalities)
            except:
                fatalities = 1

            if fatalities >= 40:
                severity = 5  # extreme
            elif fatalities >= 25:
                severity = 4
            elif fatalities >= 15:
                severity = 3
            elif fatalities >= 5:
                severity = 2
            else:
                severity = 1

            # Get coordinates
            lat, lng = geocode(name, state)

            if not lat or not lng:
                print(f"⚠ Could not geocode: {name}, {state}")
                continue

            BlackSpot.objects.create(
                name=name,
                latitude=lat,
                longitude=lng,
                severity=severity
            )

            count += 1
            print(f"✔ Imported: {name} ({lat}, {lng}) severity {severity}")

    print(f"\n🎉 DONE — Imported {count} blackspots.")
