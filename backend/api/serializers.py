from rest_framework import serializers
from .models import Perfil, Noticia, Evento

class PerfilSerializer(serializers.ModelSerializer):
    class Meta:
        model = Perfil
        fields = '__all__'

class EventoSerializer(serializers.ModelSerializer):
    creador_nombre = serializers.SerializerMethodField(read_only=True)
    inscritos_count = serializers.IntegerField(source='inscritos.count', read_only=True)

    class Meta:
        model = Evento
        fields = '__all__'

    def get_creador_nombre(self, obj):
        if obj.creador:
            return obj.creador.get_full_name() or obj.creador.username
        return "Coordinación GENSTI"

class NoticiaSerializer(serializers.ModelSerializer):
    autor_nombre = serializers.SerializerMethodField(read_only=True)
    # Exponemos el título del evento asociado para el Frontend
    evento_titulo = serializers.CharField(source='evento_relacionado.titulo', read_only=True)

    class Meta:
        model = Noticia
        fields = '__all__'

    def get_autor_nombre(self, obj):
        if obj.autor:
            return obj.autor.get_full_name() or obj.autor.username
        return "Coordinación GENSTI"