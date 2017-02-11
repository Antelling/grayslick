from django.db import models
from django.contrib.auth.models import User


class Test(models.Model):
    markdown = models.TextField(null=True)  # markdown code to produce the html
    html = models.TextField(null=True)  # shown to the students

    answers = models.TextField(null=True)  # json file of answers mapped to questions
    security = models.BooleanField()  # should we disable right click and track their time away?
    allow_question_review = models.BooleanField()  # should we allow them to look over questions and the answers at the
    # end of their test?

    teacher = models.ForeignKey(User, db_index=True)  # who was it made by

    title = models.CharField(max_length=100, db_index=True)  # what goes in the url?
    description = models.CharField(max_length=500, null=True, blank=True)  # what goes in the blurb?

    access_code = models.CharField('Class access codes', max_length=50, null=True)  # what is the security code?
    archived = models.BooleanField()  # should it be displayed under archived tests?
    deleted = models.BooleanField()  # should we display it at all?

    def __str__(self):
        return self.title
