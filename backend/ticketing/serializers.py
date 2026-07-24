from rest_framework import serializers
from .models import Customer, Ticket, Comment


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'


class TicketSerializer(serializers.ModelSerializer):
    # Nested read-only comments for detail views
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Ticket
        fields = '__all__'
