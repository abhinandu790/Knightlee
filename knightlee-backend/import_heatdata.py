import csv
from api.models import CrimeHeatData

city_to_coords = {
    "Ahmedabad": (72.5714, 23.0225),
    "Bangalore": (77.5946, 12.9716),
    "Bhopal": (77.4126, 23.2599),
    "Chennai": (80.2707, 13.0827),
    "Delhi": (77.1025, 28.7041),
    "Ghaziabad": (77.4538, 28.6692),
    "Hyderabad": (78.4867, 17.3850),
    "Kolkata": (88.3639, 22.5726),
    "Ludhiana": (75.8573, 30.9009),
    "Mumbai": (72.8777, 19.0760),
    "Pune": (73.8567, 18.5204),
    "Surat": (72.8311, 21.1702),
    "Visakhapatnam": (83.2185, 17.6868),
}

inserted = 0

with open("heatdata.csv", encoding="utf-8") as f:
    reader = csv.DictReader(f)

    for row in reader:
        city = row.get("City")
        if not city:
            continue

        coords = city_to_coords.get(city)
        if not coords:
            continue

        CrimeHeatData.objects.create(
            city=city,
            crime_description=row.get("Crime Description"),
            crime_domain=row.get("Crime Domain"),
            victim_age=row.get("Victim Age") or None,
            weapon_used=row.get("Weapon Used") or None,
            latitude=coords[1],   # lat
            longitude=coords[0],  # lng
        )
        inserted += 1

print(f"✔ Imported {inserted} records successfully from heatdata.csv")
