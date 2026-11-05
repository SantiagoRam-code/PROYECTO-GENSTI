from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PerfilViewSet, 
    NoticiaViewSet, 
    EventoViewSet, 
    LoginView, 
    RegisterView,
    chatbot_response
)

router = DefaultRouter()
router.register(r'perfiles', PerfilViewSet, basename='perfil')
router.register(r'noticias', NoticiaViewSet, basename='noticia')
router.register(r'eventos', EventoViewSet, basename='evento')

urlpatterns = [
    path('login/', LoginView.as_view(), name='api_login'),
    path('register/', RegisterView.as_view(), name='api_register'),
    path('chat/', chatbot_response, name='api_chat'),
    path('', include(router.urls)),
]