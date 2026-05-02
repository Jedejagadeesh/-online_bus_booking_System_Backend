from django.urls import path
from .views import (
    search_buses,
    get_booked_seats,
    create_booking,
    register,
    login
)

urlpatterns = [
    path('search/', search_buses),
    path('booked/<int:bus_id>/', get_booked_seats),
    path('book/', create_booking),

    # 🔥 ADD THESE TWO
    path('register/', register),
    path('login/', login),
]