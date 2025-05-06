from django.urls import path
from dashboard import views

urlpatterns = [
    path('example_plot/', views.example_plot, name='example_plot'),
]
