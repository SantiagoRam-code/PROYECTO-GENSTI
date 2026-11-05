from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Perfil, Noticia, Evento

class UserSimpleSerializer(serializers.ModelSerializer):
    nombre_completo = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'nombre_completo']

    def get_nombre_completo(self, obj):
        return obj.get_full_name() or obj.username

class PerfilSerializer(serializers.ModelSerializer):
    class Meta:
        model = Perfil
        fields = '__all__'

class EventoSerializer(serializers.ModelSerializer):
    creador_nombre = serializers.SerializerMethodField(read_only=True)
    inscritos_count = serializers.IntegerField(source='inscritos.count', read_only=True)
    inscritos_detalle = UserSimpleSerializer(source='inscritos', many=True, read_only=True)

    class Meta:
        model = Evento
        fields = '__all__'

    def get_creador_nombre(self, obj):
        if obj.creador:
            return obj.creador.get_full_name() or obj.creador.username
        return "Coordinación GENSTI"

class NoticiaSerializer(serializers.ModelSerializer):
    autor_nombre = serializers.SerializerMethodField(read_only=True)
    evento_detail = EventoSerializer(source='evento_relacionado', read_only=True)

    class Meta:
        model = Noticia
        fields = '__all__'

    def get_autor_nombre(self, obj):
        if obj.autor:
            return obj.autor.get_full_name() or obj.autor.username
        return "Coordinación GENSTI"