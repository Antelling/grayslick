from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponse, HttpResponseNotModified
from .models import *
from django.contrib.auth.models import User
from .functions import genAccessCode


def new_test(request):  # if get, serve new dialogue, if post, make test then redirect to edit page
    if request.method == "POST":
        user = User.objects.get(username=request.user.username)
        title = request.POST.get("title").strip().replace(" ", "_")

        if Test.objects.filter(teacher=user).filter(title=title).exists():
            return HttpResponseRedirect('/main/edit/' + title)

        print(request.POST.get("security"))
        object = Test(
            markdown="",
            html="",
            answers="",
            security=True,
            allow_question_review=False,
            teacher=User.objects.get(username=request.user.username),
            title=title,
            description=request.POST.get("description"),
            access_code=genAccessCode(),
            archived=False,
            deleted=False
        )
        object.save()

        return HttpResponseRedirect('/main/edit/' + title)

    # making a new test. Serve the create file.
    return render(request, 'main/new.html')


def edit(request, test):
    owner = User.objects.get(username=request.user.username)
    test = Test.objects.filter(teacher=owner).get(title=test)
    return render(request, "main/edit.html", {'test': test, 'user': request.user.username})


def rename_test(request):
    user = User.objects.get(username=request.user.username)
    if Test.objects.filter(teacher=user).filter(title=request.POST.get("new")).exists():
        return HttpResponseNotModified("test with this name already exists")
    paper = Test.objects.filter(teacher=user).get(title=request.POST.get("old"))
    paper.title = request.POST.get("new")
    paper.save()
    return HttpResponse("renamed")
    pass


def delete_test(request, test):
    owner = User.objects.get(username=request.user.username)
    test = Test.objects.filter(teacher=owner).get(title=test)
    test.deleted = True
    test.save()
    return HttpResponse("deleted")


def undelete_test(request, test):
    owner = User.objects.get(username=request.user.username)
    test = Test.objects.filter(teacher=owner).get(title=test)
    test.deleted = False
    test.save()
    return HttpResponse("restored")


def archive_test(request, test):
    owner = User.objects.get(username=request.user.username)
    test = Test.objects.filter(teacher=owner).get(title=test)
    test.archived = True
    test.save()
    return HttpResponse("deleted")


def unarchive_test(request, test):
    owner = User.objects.get(username=request.user.username)
    test = Test.objects.filter(teacher=owner).get(title=test)
    test.archived = False
    test.save()
    return HttpResponse("deleted")


def save_test(request):
    user = User.objects.get(username=request.user.username)
    test = Test.objects.filter(teacher=user).get(id=request.POST.get("pk"))
    data = request.POST
    test.title = data.get("title").strip().replace(" ", "_")
    test.description = data.get("description")
    test.markdown = data.get("markdown")
    test.html = data.get("html")
    test.answers = data.get("answers")
    test.security = data.get("security") == "true"
    test.allow_question_review = data.get("review") == "true"
    test.access_code = data.get("access_code").strip()
    test.save()
    return HttpResponse("saved")
    pass
