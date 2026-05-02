from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Bus, Booking
from .serializers import BusSerializer
from datetime import datetime
from django.contrib.auth.models import User


# =========================
# SEARCH BUSES
# =========================
@api_view(['GET'])
def search_buses(request):
    source = request.GET.get('from')
    destination = request.GET.get('to')

    buses = Bus.objects.filter(
        source__icontains=source,
        destination__icontains=destination
    )

    return Response({
        "routes": BusSerializer(buses, many=True).data
    })


# =========================
# BOOKED SEATS
# =========================
@api_view(['GET'])
def get_booked_seats(request, bus_id):
    try:
        journey_date = request.GET.get("date")

        if not journey_date:
            return Response({"booked_seats": []})

        bookings = Booking.objects.filter(
            bus_id=bus_id,
            journey_date=journey_date
        )

        seats = []
        for b in bookings:
            seats.extend(b.seats.split(","))

        return Response({
            "booked_seats": seats
        })

    except Exception as e:
        print("ERROR:", str(e))
        return Response({"booked_seats": []})


# =========================
# CREATE BOOKING (FIXED)
# =========================
@api_view(['POST'])
def create_booking(request):
    try:
        bus_id = request.data.get("bus")
        seats = request.data.get("seats")
        date_str = request.data.get("journey_date")
        user_id = request.data.get("user_id")   # 🔥 ADD USER FROM FRONTEND

        if not bus_id or not seats or not date_str:
            return Response({"error": "Missing data"}, status=400)

        journey_date = datetime.strptime(date_str, "%Y-%m-%d").date()

        # booked seats check
        bookings = Booking.objects.filter(
            bus_id=bus_id,
            journey_date=journey_date
        )

        booked = []
        for b in bookings:
            booked.extend(b.seats.split(","))

        for s in seats.split(","):
            if s in booked:
                return Response(
                    {"error": f"Seat {s} already booked"},
                    status=400
                )

        # 🔥 FIX: GET REAL USER
        user = None
        if user_id:
            user = User.objects.get(id=user_id)

        booking = Booking.objects.create(
            user=user,
            bus_id=bus_id,
            seats=seats,
            journey_date=journey_date,
            total_price=0
        )

        return Response({"message": "Booking successful"})

    except Exception as e:
        print("ERROR:", str(e))
        return Response({"error": "Server error"}, status=500)
from django.views.decorators.csrf import csrf_exempt
import json

# =========================
# REGISTER USER
# =========================
@csrf_exempt
@api_view(['POST'])
def register(request):
    try:
        data = json.loads(request.body)

        name = data.get("name")
        email = data.get("email")
        password = data.get("password")

        if User.objects.filter(username=email).exists():
            return Response({"error": "User already exists"}, status=400)

        user = User.objects.create_user(
            username=email,
            email=email,
            password=password
        )

        user.first_name = name
        user.save()

        return Response({
            "message": "User registered successfully",
            "user": {
                "id": user.id,
                "name": name,
                "email": email
            }
        })

    except Exception as e:
        print("REGISTER ERROR:", str(e))
        return Response({"error": "Server error"}, status=500)


# =========================
# LOGIN USER
# =========================
@api_view(['POST'])
def register(request):
    try:
        data = request.data

        name = data.get("name")
        email = data.get("email")
        password = data.get("password")

        if User.objects.filter(username=email).exists():
            return Response({"error": "User already exists"}, status=400)

        user = User.objects.create_user(
            username=email,
            email=email,
            password=password
        )

        user.first_name = name
        user.save()

        return Response({
            "message": "User registered successfully",
            "user": {
                "id": user.id,
                "name": name,
                "email": email
            }
        })

    except Exception as e:
        print("REGISTER ERROR:", str(e))
        return Response({"error": "Server error"}, status=500)