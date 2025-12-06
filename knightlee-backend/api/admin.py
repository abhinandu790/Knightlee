from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import UserProfile, Incident, SOSAlert

admin.site.register(UserProfile)
admin.site.register(Incident)
admin.site.register(SOSAlert)
admin.site.site_header = "Knightlee Admin"
admin.site.site_title = "Knightlee Admin Portal"