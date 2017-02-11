from django.contrib import admin
from .models import *

# Register your models here.

class ResponseAdmin(admin.ModelAdmin):
    readonly_fields = ('id',)
    pass

admin.site.register(Response, ResponseAdmin)