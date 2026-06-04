from django.core.mail import send_mail

def send_ticket_email(email, booking):
    subject = "🎫 Your Bus Ticket Confirmed"

    message = f"""
    🎫 Booking Confirmed

    Bus: {booking.bus.bus_number}
    From: {booking.bus.source}
    To: {booking.bus.destination}

    Seats: {booking.seats}

    Departure: {booking.bus.departure}
    Arrival: {booking.bus.arrival}

    🚍 Have a safe journey!
    """

    send_mail(
        subject,
        message,
        "yourmail@gmail.com",
        [email],
        fail_silently=False
    )
    