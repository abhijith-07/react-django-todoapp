from django.urls import path
from . import views

urlpatterns = [
    path('', views.apiOverview, name='api'),
    path('todos/', views.todoList, name='todos'),
    path('todo-detail/<str:id>/', views.todoDetail, name='todo-detail'),
    path('todo-create/', views.todoCreate, name='todo-create'),
    path('todo-update/<str:id>/', views.todoUpdate, name='todo-update'),
    path('todo-delete/<str:id>/', views.todoDelete, name='todo-delete'),

]