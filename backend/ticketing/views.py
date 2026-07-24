from django.db.models import Count
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Customer, Ticket, Comment
from .serializers import CustomerSerializer, TicketSerializer, CommentSerializer


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer


class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.select_related('customer').all()
    serializer_class = TicketSerializer

    @action(detail=False, methods=['get'], url_path='by-status')
    def tickets_by_status(self, request):
        """
        Dashboard endpoint: returns ticket counts grouped by status.

        GET /api/tickets/by-status/

        Example response:
        [
            {"status": "open", "count": 12},
            {"status": "in_progress", "count": 5},
            {"status": "resolved", "count": 30},
            {"status": "closed", "count": 8}
        ]
        """
        data = (
            Ticket.objects
            .values('status')
            .annotate(count=Count('id'))
            .order_by('status')
        )
        return Response(list(data))


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.select_related('ticket').all()
    serializer_class = CommentSerializer
