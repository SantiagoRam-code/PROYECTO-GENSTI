from rest_framework import viewsets, permissions
from .models import Noticia, Evento
from .serializers import NoticiaSerializer, EventoSerializer

class NoticiaViewSet(viewsets.ModelViewSet):
    queryset = Noticia.objects.all().order_by('-fecha_publicacion')
    serializer_class = NoticiaSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(autor=self.request.user)
        else:
            serializer.save()

class EventoViewSet(viewsets.ModelViewSet):
    queryset = Evento.objects.all().order_by('fecha_evento')
    serializer_class = EventoSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(creador=self.request.user)
        else:
            serializer.save()
