from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponse, HttpResponseNotModified
from main.models import Test
from .models import Response
from django.contrib.auth.models import User
from .grader import *


def take(request, user, test):
    owner = User.objects.get(username=user)
    test = Test.objects.filter(teacher=owner).get(title=test)


    if request.method == "POST":
        # they are posting the results of a prompt for the access code
        if request.POST.get("access_code") == test.access_code:
            return render(request, "take/take.html", {"html": test.html})
        else:
            return HttpResponse("incorrect")

    if test.access_code == "":
        return render(request, "take/take.html", {"test": test})
    else:
        return render(request, "take/prompt.html")


def results(request, user, test):
    # grade the test, then serve the grade
    # if allow student review is set, also serve the questions, the correct answers, and the student answers

    owner = User.objects.get(username=user)
    test = Test.objects.filter(teacher=owner).get(title=test)

    gradedResponse = grade(request.POST, test.answers)
    studentGrade = total(gradedResponse)

    Response(
        test=test,
        response=json.dumps(gradedResponse),
        inactive_ms=int(request.POST.get("time-away")) + 1,
        name=request.POST.get("name"),
        grade=studentGrade['percent'],
        ungraded_questions=studentGrade["ungradedPoints"] > 0
    ).save()

    return render(request, "take/results.html",
                  {"results": gradedResponse, "grade": studentGrade, "test": test, })
