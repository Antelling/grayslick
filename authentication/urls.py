from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'login', views.login_user, name='login'),
    url(r'signup', views.signup_user, name='signup'),
    url(r'logout', views.logout_user, name='logout'),
    url(r'is_username_available/(?P<url>[\w]+)/$', views.is_username_available, name='is_username_available'),
]
