import random
from datetime import datetime

from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.core.mail import send_mail
from django.conf import settings

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Bus, Booking
from .serializers import BusSerializer, BookingSerializer

from django.db import models
OTP_STORE = {}

# =========================
# SEARCH BUSES
# =========================
@api_view(['GET'])
def search_buses(request):

    source = request.GET.get("from")
    destination = request.GET.get("to")

    buses = Bus.objects.all()

    if source:
        buses = buses.filter(source__icontains=source)

    if destination:
        buses = buses.filter(destination__icontains=destination)

    serializer = BusSerializer(buses, many=True)

    return Response(serializer.data)


# =========================
# GET BOOKED SEATS
# =========================
@api_view(['GET'])
def get_booked_seats(request, bus_id):

    date = request.GET.get("date")

    if not date:
        return Response({"booked_seats": []})

    bookings = Booking.objects.filter(
        bus_id=bus_id,
        journey_date=date
    )

    booked_seats = []

    for booking in bookings:
        booked_seats.extend(booking.seats.split(","))

    return Response({
        "booked_seats": booked_seats
    })
# =========================
# CREATE BOOKING
# =========================
@api_view(['POST'])
def create_booking(request):

    try:
        print("=" * 50)
        print("REQUEST DATA:", request.data)

        bus_id = request.data.get("bus")
        seats = request.data.get("seats")
        journey_date = request.data.get("journey_date")
        user_id = request.data.get("user_id")
        email = request.data.get("email")
        name = request.data.get("name")

        print("EMAIL RECEIVED:", email)

        if not bus_id or not seats or not journey_date:
            return Response(
                {"error": "Missing required fields"},
                status=400
            )

        if isinstance(seats, list):
            seats = ",".join(map(str, seats))

        user = User.objects.filter(id=user_id).first()

        booking = Booking.objects.create(
            user=user,
            bus_id=bus_id,
            seats=seats,
            journey_date=journey_date,
            total_price=0
        )

        # ================= EMAIL SEND =================
        if email:
            try:
                print("TRYING TO SEND EMAIL TO:", email)

                send_mail(
                    subject="🎫 Bus Ticket Confirmation",
                    message=f"""
Hello {name},

Your booking has been confirmed successfully.

🚌 Bus ID: {bus_id}
💺 Seats: {seats}
📅 Journey Date: {journey_date}

Have a safe journey!

Thank you for booking with us.
                    """,
                    from_email=settings.EMAIL_HOST_USER,
                    recipient_list=[email],
                    fail_silently=False
                )

                print("✅ EMAIL SENT SUCCESSFULLY")

            except Exception as mail_error:
                print("❌ MAIL ERROR:", str(mail_error))

        else:
            print("❌ EMAIL NOT RECEIVED FROM FRONTEND")

        return Response({
            "message": "Booking Successful",
            "booking_id": booking.id
        })

    except Exception as e:
        print("❌ BOOKING ERROR:", str(e))

        return Response({
            "error": str(e)
        }, status=500)
# =========================
# REGISTER
# =========================
@api_view(['POST'])
def register(request):

    name = request.data.get("name")
    email = request.data.get("email")
    password = request.data.get("password")

    if not name or not email or not password:
        return Response(
            {"error": "All fields required"},
            status=400
        )

    if User.objects.filter(username=email).exists():
        return Response(
            {"error": "User already exists"},
            status=400
        )

    user = User.objects.create_user(
        username=email,
        email=email,
        password=password
    )

    user.first_name = name
    user.save()

    return Response({
        "message": "Registration Successful",
        "user": {
            "id": user.id,
            "name": user.first_name,
            "email": user.email
        }
    })


# =========================
# LOGIN
# =========================
@api_view(['POST'])
def login(request):

    email = request.data.get("email")
    password = request.data.get("password")

    email = email.strip().lower()

    user = User.objects.filter(
        models.Q(username__iexact=email) |
        models.Q(email__iexact=email)
    ).first()

    if user and user.check_password(password):
        return Response({
            "message": "Login Successful",
            "user": {
                "id": user.id,
                "name": user.first_name,
                "email": user.email
            }
        })

    return Response({
        "error": "Invalid Credentials"
    }, status=400)

# =========================
# FORGOT PASSWORD
# =========================
@api_view(['POST'])
def forgot_password(request):

    email = request.data.get("email")

    if not email:
        return Response({"error": "Email required"}, status=400)

    email = email.strip().lower()

    # FIXED
    user = User.objects.filter(email__iexact=email).first()

    if not user:
        return Response({"error": "Email not found"}, status=400)

    otp = str(random.randint(100000, 999999))
    OTP_STORE[email] = otp

    send_mail(
        subject="Your OTP Code",
        message=f"Your OTP is {otp}",
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[email],
        fail_silently=False
    )

    return Response({"message": "OTP Sent Successfully"})
    # ================= SEND EMAIL =================
    # try:
    #     send_mail(
    #         subject="Password Reset OTP",
    #         message=f"Your OTP is {otp}",
    #         from_email=settings.EMAIL_HOST_USER,
    #         recipient_list=[email],
    #         fail_silently=False
    #     )

    #     print("OTP EMAIL SENT SUCCESSFULLY")

    # except Exception as e:
    #     print("EMAIL ERROR:", str(e))

    #     return Response({
    #         "error": "Email sending failed"
    #     }, status=500)

    # return Response({
    #     "message": "OTP Sent Successfully"
    # })


# =========================
# VERIFY OTP
# =========================
@api_view(['POST'])
def verify_otp(request):

    email = request.data.get("email")
    otp = request.data.get("otp")

    email = email.strip().lower()

    print("STORE:", OTP_STORE)

    if OTP_STORE.get(email) == str(otp):
        return Response({"message": "OTP Verified"})

    return Response({"error": "Invalid OTP"}, status=400)

# =========================
# RESET PASSWORD
# =========================
@api_view(['POST'])
def reset_password(request):

    email = request.data.get("email")
    password = request.data.get("password")

    email = email.strip().lower()

    user = User.objects.filter(username__iexact=email).first()

    if not user:
        return Response({"error": "User not found"}, status=400)

    user.set_password(password)
    user.save()

    OTP_STORE.pop(email, None)

    return Response({"message": "Password Updated"})

# =========================
# TEST MAIL
# =========================
@api_view(['GET'])
def test_mail(request):

    send_mail(
        "Test Mail",
        "Mail Working Successfully",
        settings.EMAIL_HOST_USER,
        [settings.EMAIL_HOST_USER],
        fail_silently=False
    )
    return Response({
        "message": "Mail Sent"
    }) 