from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^(?P<user>[\w]+)/(?P<test>[\w]+)/$', views.take, name='take test'), #/take/username/test
    url(r'^(?P<user>[\w]+)/(?P<test>[\w]+)/results/$', views.results, name='submit test'), #/take/username/test
]
