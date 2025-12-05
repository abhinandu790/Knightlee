# api/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path("auth/register/", views.register, name="register"),
    path("auth/login/", views.login, name="login"),

    path("route/", views.get_route, name="get_route"),
    path("roadsegment/<int:id>/", views.road_segment, name="road_segment"),

    path("incident/", views.report_incident, name="report_incident"),
    path("incidents/", views.list_incidents, name="list_incidents"),
    path("incident/<int:id>/upvote/", views.upvote_incident, name="upvote_incident"),

    path("sos/", views.sos, name="sos"),
    path("safe-points/", views.safe_points, name="safe_points"),

    path("user/profile/", views.user_profile, name="user_profile"),
    path("user/profile/update/", views.update_profile, name="update_profile"),
]
