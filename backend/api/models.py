from django.db import models
from django.contrib.auth.models import User

# 1. Perfil para diferenciar Estudiantes de Profesores
class Perfil(models.Model):
    ROLES = (
        ('student', 'Estudiante'),
        ('professor', 'Profesor'),
        ('admin', 'Administrador'),
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    rol = models.CharField(max_length=20, choices=ROLES, default='student')

    def __str__(self):
        return f"{self.user.username} - {self.rol}"

# 2. Eventos (Calendario y Estadísticas) - MÁS ARRIBA AHORA
class Evento(models.Model):
    creador = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    titulo = models.CharField(max_length=200)
    tipo_evento = models.CharField(max_length=100)
    fecha_evento = models.DateField()
    hora_inicio = models.TimeField(null=True, blank=True)
    hora_fin = models.TimeField(null=True, blank=True)
    lugar = models.CharField(max_length=200, null=True, blank=True)
    cupos_disponibles = models.IntegerField(default=0)
    descripcion = models.TextField(null=True, blank=True)
    # NUEVO: Lista de estudiantes inscritos
    inscritos = models.ManyToManyField(User, related_name='eventos_inscritos', blank=True)

    def __str__(self):
        return self.titulo

# 3. Noticias (CRUD para Profesores)
class Noticia(models.Model):
    autor = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    titulo = models.CharField(max_length=200)
    extracto = models.TextField()
    contenido = models.TextField()
    categoria = models.CharField(max_length=100, default='General')
    imagen = models.ImageField(upload_to='noticias/', blank=True, null=True)
    # NUEVO: Relación opcional con un Evento
    evento_relacionado = models.ForeignKey(Evento, on_delete=models.SET_NULL, null=True, blank=True)
    fecha_publicacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.titulo