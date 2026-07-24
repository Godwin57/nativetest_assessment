from rest_framework.routers import DefaultRouter
from .views import CustomerViewSet, TicketViewSet, CommentViewSet

router = DefaultRouter()
router.register(r'customers', CustomerViewSet, basename='customer')
router.register(r'tickets', TicketViewSet, basename='ticket')
router.register(r'comments', CommentViewSet, basename='comment')

urlpatterns = router.urls
