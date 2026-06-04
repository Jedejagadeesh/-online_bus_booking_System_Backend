from django.urls import path

from .views import (
    search_buses,
    get_booked_seats,
    create_booking,
    register,
    login,
    forgot_password,
    verify_otp,
    reset_password,
    test_mail
)

urlpatterns = [
    path('search/', search_buses),
    path('booked/<int:bus_id>/', get_booked_seats),
    path('book/', create_booking),

    path('register/', register),
    path('login/', login),

    path('forgot-password/', forgot_password),
    path('verify-otp/', verify_otp),
    path('reset-password/', reset_password),

    path('test-mail/', test_mail),
]