from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class UserProfile(models.Model):
    user = models.OneToOneField(User)
    has_viewed_tutorial = models.BooleanField()
    paid_user = models.BooleanField()

    def __unicode__(self):
        return self.user.username