from django.db import models
from main.models import Test


class Response(models.Model):
    test = models.ForeignKey(Test)  # the test these are the answers for
    response = models.TextField('JSON response')  # student answers
    inactive_ms = models.IntegerField()  # how many seconds was the page inactive?
    name = models.TextField('student name')  # the name of the person who took the test
    grade = models.FloatField()  # the percent they got on the test
    ungraded_questions = models.BooleanField()  # do questions still need to be graded by the teacher

    def __str__(self):
        return self.name