# # api/urls.py
# from django.urls import path
# from . import views
# from .views import route_analyze


# # urlpatterns = [
# #     # Auth
# #     path("auth/register/", views.register_view, name="register"),
# #     path("auth/login/", views.login_view, name="login"),

# #     # Routes
# #     path("route/", views.get_route, name="get_route"),
# #     path("route-analyze/", views.route_analyze, name="route-analyze"),
# #     path("route-analyze/", route_analyze, name="route-analyze"),
# #     path("roadsegment/<int:id>/", views.road_segment, name="road_segment"),

# #     # Incidents
# #     path("incident/", views.report_incident, name="report_incident"),
# #     path("incidents/", views.list_incidents, name="list_incidents"),
# #     path("incident/<int:id>/upvote/", views.upvote_incident, name="upvote_incident"),

# #     # SOS + Safe points
# #     path("sos/", views.sos, name="sos"),
# #     path("safe-points/", views.safe_points, name="safe_points"),

# #     # User profile
# #     path("user/profile/", views.user_profile, name="user_profile"),
# #     path("user/profile/update/", views.update_profile, name="update_profile"),

# #     # GeoJSON + heatmaps
# #     path("incidents/geojson/", views.incidents_geojson, name="incidents_geojson"),
# #     path("crimes/geojson/", views.crime_geojson, name="crime_geojson"),
# #     path("blackspots/geojson/", views.blackspot_geojson, name="blackspot_geojson"),
# #     path("blackspots/", views.blackspot_list, name="blackspot_list"),
# #     path("crime-heatmap/", views.crime_heatmap_geojson, name="crime-heatmap"),

# #     # Blackspots along route
# #     path("blackspots-route/", views.blackspots_along_route, name="blackspots-route"),
# # ]
# from django.urls import path
# from . import views

# urlpatterns = [
#     path("auth/register/", views.register_view, name="register"),
#     path("auth/login/", views.login_view, name="login"),

#     # FIXED ROUTE ENDPOINT
#     path("route-analyze/", views.route_analyze, name="route_analyze"),

#     # Optional: only keep if function exists
#     # path("route/", views.get_route, name="get_route"),

#     path("incidents/", views.list_incidents, name="list_incidents"),
#     path("incidents/report/", views.report_incident, name="report_incident"),

#     path("sos/", views.sos, name="sos"),

#     path("profile/", views.user_profile, name="user_profile"),
#     path("profile/update/", views.update_profile, name="update_profile"),

#     # GeoJSON endpoints
#     path("incidents/geojson/", views.incidents_geojson, name="incidents_geojson"),
#     path("blackspots/geojson/", views.blackspot_geojson, name="blackspot_geojson"),
#     path("crime-heatmap/", views.crime_heatmap_geojson, name="crime-heatmap"),

#     # Route blackspot analyzer
# ]
from django.urls import path
from . import views

urlpatterns = [
    # Auth
    path("auth/register/", views.register_view, name="register"),
    path("auth/login/", views.login_view, name="login"),

    # Route Analyzer
    path("route-analyze/", views.route_analyze, name="route_analyze"),

    # Incidents
    path("incidents/", views.list_incidents, name="list_incidents"),
    path("incidents/report/", views.report_incident, name="report_incident"),

    # SOS
    path("sos/", views.sos, name="sos"),

    # User Profile
    path("profile/", views.user_profile, name="user_profile"),
    path("profile/update/", views.update_profile, name="update_profile"),

    # GeoJSON Layers
    path("incidents/geojson/", views.incidents_geojson, name="incidents_geojson"),
    path("blackspots/geojson/", views.blackspot_geojson, name="blackspot_geojson"),

    # 🔥 Here is the FIX:
    path("crime-heatmap/", views.crime_heatmap_geojson, name="crime_heatmap"),
    path("crime_heatmap_geojson/", views.crime_heatmap_geojson),  # <-- added alias

    # Optional route blackspot analysis (keep if function exists)
    # path("blackspots-route/", views.blackspots_along_route, name="blackspots-route"),
]
