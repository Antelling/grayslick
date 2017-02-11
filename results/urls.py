from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^overview/(?P<test>[\w]+)/$', views.overview),
    url(r'^overview/(?P<test>[\w]+)/grade/$', views.quickgrade),
    url(r'^overview/(?P<test>[\w]+)/grade/save/$', views.updateresponse),
    url(r'^overview/(?P<test>[\w]+)/export/(?P<format>[\w]+)/$', views.export),
    url(r'^overview/(?P<test>[\w]+)/stats/$', views.stats),
    url(r'^overview/(?P<test>[\w]+)/(?P<pk>[\d]+)/$', views.details),
]
