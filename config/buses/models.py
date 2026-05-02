from django.db import models
from django.contrib.auth.models import User

class Bus(models.Model):
    operator = models.CharField(max_length=100)
    bus_number = models.CharField(max_length=20)
    source = models.CharField(max_length=100)
    destination = models.CharField(max_length=100)
    departure = models.CharField(max_length=10)
    arrival = models.CharField(max_length=10)
    price = models.IntegerField()
    bus_type = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.source} → {self.destination}"


class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)

    bus = models.ForeignKey(Bus, on_delete=models.CASCADE)
    seats = models.CharField(max_length=50)

    journey_date = models.DateField(null=True, blank=True)
    total_price = models.IntegerField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.bus} | Seats: {self.seats}"