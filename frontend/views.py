from django.shortcuts import render


def listView(request):
    return render(request, 'frontend/list.html')
