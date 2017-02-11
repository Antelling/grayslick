from django.shortcuts import render
from django.http import HttpResponse
from django.core import serializers
import json

from main.models import *
from take.models import *

from take.grader import total


def overview(request, test):
    owner = User.objects.get(username=request.user.username)
    test = Test.objects.filter(teacher=owner).get(title=test)
    responses = Response.objects.filter(test=test)

    return render(request, 'results/overview.html', {'results': responses})


def quickgrade(request, test):
    owner = User.objects.get(username=request.user.username)
    test = Test.objects.filter(teacher=owner).get(title=test)
    responses = Response.objects.filter(test=test)

    # we want to loop over every response, get the pk, then put that and the response into a json block we stuff in
    # a javascript grading page, which calls our gradequestion to add points to the response
    allResponses = []
    for response in responses:
        response.time = response.ms_inactive/1000 #TODO:
        allResponses.append([response.pk, response.response])

    return render(request, 'results/quickgrade.html', {'data': json.dumps(allResponses), 'test': test.html})


def updateresponse(request, test):
    owner = User.objects.get(username=request.user.username)
    test = Test.objects.filter(teacher=owner).get(title=test)

    response = Response.objects.filter(test=test).get(pk=int(request.POST.get("pk")))

    response.response = request.POST.get("response")

    studentGrade = total(json.loads(request.POST.get("response")))
    response.ungraded_questions = studentGrade["ungradedQuestions"]
    response.grade = studentGrade["percent"]

    response.save()
    return HttpResponse("OK")


def export(request, test, format):
    owner = User.objects.get(username=request.user.username)
    test = Test.objects.filter(teacher=owner).get(title=test)
    responses = Response.objects.filter(test=test)

    data = []

    if format == "gradescsv":
        for response in responses:
            data.append(str(response.grade))
        data = ",".join(data)
    elif format == "namescsv":
        for response in responses:
            data.append(response.name + "," + str(response.grade))
        data = "\n".join(data)
    return HttpResponse(data, content_type='text/plain')  # text plain is so they cant xss, and so curling works without
    # having to replace the <br/>


def details(request, test, pk):
    owner = User.objects.get(username=request.user.username)
    test = Test.objects.filter(teacher=owner).get(title=test)
    response = Response.objects.filter(test=test).get(pk=int(pk))

    print("response is: ")
    print(response)
    print(response.name)
    print(pk)

    return render(request, "results/details.html",
                  {"results": response, "grade": total(json.loads(response.response)), "test": test, })


def stats(request, test):
    owner = User.objects.get(username=request.user.username)
    test = Test.objects.filter(teacher=owner).get(title=test)
    responses = Response.objects.filter(test=test)

    data = serializers.serialize("json", responses)

    return render(request, "results/stats.html", {'data': data, 'answers': test.answers, 'test':test.html})
