from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'new', views.new_test, name='new test'),
    url(r'rename', views.rename_test, name='rename test'),
    url(r'save', views.save_test, name='save test'),
    url(r'edit/(?P<test>[\w]+)/$', views.edit, name='edit test'),
    url(r'undelete/(?P<test>[\w]+)/$', views.undelete_test, name='undelete test'),
    url(r'delete/(?P<test>[\w]+)/$', views.delete_test, name='delete test'),
    url(r'unarchive/(?P<test>[\w]+)/$', views.unarchive_test, name='archive test'),
    url(r'archive/(?P<test>[\w]+)/$', views.archive_test, name='unarchive test'),
]
