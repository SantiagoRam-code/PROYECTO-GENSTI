from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NoticiaViewSet, EventoViewSet

router = DefaultRouter()
router.register(r'noticias', NoticiaViewSet, basename='noticia')
router.register(r'eventos', EventoViewSet, basename='evento')

urlpatterns = [
    path('', include(router.urls)),
]
