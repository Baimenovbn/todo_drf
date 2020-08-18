from django.urls import path
from . import views


urlpatterns = [
    path('', views.index, name='index'),
    path('task-list/', views.taskList, name='task-list'),
    path('task-detail/<int:id>/', views.taskDetail, name='task-detail'),
    path('task-create/', views.taskCreate, name='task-create'),
    path('task-update/<int:id>/', views.taskUpdate, name='task-update'),
    path('task-delete/<int:id>/', views.taskDelete, name='task-delete'),
]
