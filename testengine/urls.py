from django.conf.urls import url, include
from django.contrib import admin

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^auth/', include('authentication.urls')),
    url(r'^main/', include('main.urls')),
    url(r'^take/', include('take.urls')),
    url(r'^results/', include('results.urls')),
    url(r'^', include('static_pages.urls'))
]
