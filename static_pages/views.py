from django.shortcuts import render
from django.http import HttpResponse
from main.models import *
from django.contrib.auth.models import User

# Create your views here.
def index(request):
    if request.user.is_authenticated():
        user = User.objects.get(username=request.user.username)
        tests = Test.objects.filter(teacher=user)
        return render(request, 'main/dash.html', {'user':request.user.username, 'tests': tests})
    else:
        return render(request, 'static_pages/index.html', {'user':request.user.username})
