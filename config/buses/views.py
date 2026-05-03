from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Bus, Booking
from .serializers import BusSerializer
from datetime import datetime
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.core.mail import send_mail
from django.conf import settings


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

        return Response({"booked_seats": seats})

    except Exception as e:
        print("SEAT ERROR:", str(e))
        return Response({"booked_seats": []})


# =========================
# CREATE BOOKING + EMAIL (FINAL FIXED)
# =========================
@api_view(['POST'])
def create_booking(request):
    try:
        print("🔥 REQUEST DATA:", request.data)

        bus_id = request.data.get("bus")
        seats = request.data.get("seats")
        date_str = request.data.get("journey_date")
        user_id = request.data.get("user_id")
        email = request.data.get("email")
        name = request.data.get("name")

        # ---------------- VALIDATION ----------------
        if not bus_id or not seats or not date_str:
            return Response({"error": "Missing data"}, status=400)

        # ---------------- DATE SAFE ----------------
        try:
            journey_date = datetime.strptime(date_str, "%Y-%m-%d").date()
        except:
            return Response({"error": "Invalid date format"}, status=400)

        # ---------------- USER SAFE ----------------
        user = None
        if user_id:
            user = User.objects.filter(id=user_id).first()

        # ---------------- SEATS SAFE ----------------
        if isinstance(seats, list):
            seats = ",".join(map(str, seats))

        seats_list = seats.split(",")

        # ---------------- CHECK ALREADY BOOKED ----------------
        bookings = Booking.objects.filter(
            bus_id=bus_id,
            journey_date=journey_date
        )

        booked = []
        for b in bookings:
            booked.extend(b.seats.split(","))

        for s in seats_list:
            if s in booked:
                return Response(
                    {"error": f"Seat {s} already booked"},
                    status=400
                )

        # ---------------- SAVE BOOKING ----------------
        Booking.objects.create(
            user=user,
            bus_id=bus_id,
            seats=seats,
            journey_date=journey_date,
            total_price=0
        )

        # ================= EMAIL (DEBUG VERSION) =================
        if email:
            try:
                print("📧 SENDING EMAIL TO:", email)

                send_mail(
                    subject="🎫 Booking Confirmed",
                    message=f"""
Hello {name},

Your booking is confirmed 🚍

Bus ID: {bus_id}
Seats: {seats}
Date: {journey_date}

Thank you!
""",
                    from_email=settings.EMAIL_HOST_USER,
                    recipient_list=[email],
                    fail_silently=False
                )

                print("✅ EMAIL SENT SUCCESSFULLY")

            except Exception as e:
                print("❌ EMAIL ERROR:", str(e))

        return Response({
            "message": "Booking successful + Email attempted"
        })

    except Exception as e:
        print("🔥 BACKEND ERROR:", str(e))
        return Response({"error": "Server error"}, status=500)


# =========================
# REGISTER
# =========================
@api_view(['POST'])
def register(request):
    try:
        name = request.data.get("name")
        email = request.data.get("email")
        password = request.data.get("password")

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
# LOGIN
# =========================
@api_view(['POST'])
def login(request):
    try:
        email = request.data.get("email")
        password = request.data.get("password")

        user = authenticate(username=email, password=password)

        if user:
            return Response({
                "message": "Login successful",
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "name": user.first_name
                }
            })

        return Response({"error": "Invalid credentials"}, status=400)

    except Exception as e:
        print("LOGIN ERROR:", str(e))
        return Response({"error": "Server error"}, status=500)