import os
import pypdf
from dotenv import load_dotenv
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.conf import settings
from google import genai
from google.genai import types

# Importación de modelos y serializadores del proyecto
from .models import Perfil, Noticia, Evento
from .serializers import PerfilSerializer, NoticiaSerializer, EventoSerializer

load_dotenv()


def cargar_base_conocimiento_pdfs(nombre_carpeta="documentos_ia"):
    """
    Recorre la carpeta especificada en el proyecto Django y extrae el texto
    de TODOS los archivos .pdf que se encuentren dentro.
    """
    ruta_carpeta = os.path.join(settings.BASE_DIR, nombre_carpeta)
    
    if not os.path.exists(ruta_carpeta):
        os.makedirs(ruta_carpeta, exist_ok=True)
        return ""

    texto_acumulado = ""
    archivos = os.listdir(ruta_carpeta)

    for archivo in archivos:
        if archivo.lower().endswith('.pdf'):
            ruta_pdf = os.path.join(ruta_carpeta, archivo)
            try:
                reader = pypdf.PdfReader(ruta_pdf)
                texto_acumulado += f"\n\n=== INICIO DOCUMENTO GUÍA: {archivo} ===\n"
                for page in reader.pages:
                    contenido_pagina = page.extract_text()
                    if contenido_pagina:
                        texto_acumulado += contenido_pagina + "\n"
                texto_acumulado += f"=== FIN DOCUMENTO GUÍA: {archivo} ===\n"
            except Exception as e:
                print(f"Error procesando el PDF '{archivo}': {e}")

    return texto_acumulado


# 1. ViewSet para Gestión de Perfiles
class PerfilViewSet(viewsets.ModelViewSet):
    queryset = Perfil.objects.all()
    serializer_class = PerfilSerializer


# 2. ViewSet para Noticias (CRUD completo)
class NoticiaViewSet(viewsets.ModelViewSet):
    queryset = Noticia.objects.all().order_by('-fecha_publicacion')
    serializer_class = NoticiaSerializer


# 3. ViewSet para Eventos (CRUD completo)
class EventoViewSet(viewsets.ModelViewSet):
    queryset = Evento.objects.all().order_by('fecha_evento')
    serializer_class = EventoSerializer


# 4. Vista para Inicio de Sesión con Tokens
class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        user = authenticate(username=username, password=password)
        if not user:
            return Response(
                {'error': 'Usuario o contraseña incorrectos.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        token, _ = Token.objects.get_or_create(user=user)
        perfil, _ = Perfil.objects.get_or_create(user=user)
        
        rol = 'admin' if user.is_superuser else perfil.rol

        return Response({
            'token': token.key,
            'user': {
                'id': user.id,
                'username': user.username,
                'name': user.get_full_name() or user.username,
                'email': user.email,
                'role': rol
            }
        })


# 5. Vista para Registro de Nuevos Usuarios
class RegisterView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email', '')
        name = request.data.get('name', '')
        
        rol = 'student'

        if User.objects.filter(username=username).exists():
            return Response(
                {'error': 'El nombre de usuario ya está registrado.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        first_name = name.split(' ')[0] if name else ''
        last_name = ' '.join(name.split(' ')[1:]) if name and len(name.split(' ')) > 1 else ''

        user = User.objects.create_user(
            username=username,
            password=password,
            email=email,
            first_name=first_name,
            last_name=last_name
        )
        Perfil.objects.create(user=user, rol=rol)
        token, _ = Token.objects.get_or_create(user=user)

        return Response({
            'token': token.key,
            'user': {
                'id': user.id,
                'username': user.username,
                'name': user.get_full_name() or user.username,
                'email': user.email,
                'role': rol
            }
        }, status=status.HTTP_201_CREATED)


# 6. Vista para el Asistente Virtual IA (Gemini API + Múltiples PDFs + Formato Limpio)
@api_view(['POST'])
@permission_classes([AllowAny])
def chatbot_response(request):
    user_message = request.data.get('message', '')
    
    if not user_message:
        return Response({'error': 'El mensaje no puede estar vacío'}, status=400)

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return Response({'reply': '⚠️ Configuración incompleta: No se encontró la variable GEMINI_API_KEY en el archivo .env.'}, status=500)

    # Contexto dinámico de eventos en vivo desde la BD
    try:
        eventos_db = Evento.objects.all().order_by('fecha_evento')[:5]
        contexto_eventos = "\n".join([f"- {e.titulo} ({e.fecha_evento}): {e.lugar or 'Campus UCC'}" for e in eventos_db])
    except Exception:
        contexto_eventos = "No hay eventos registrados actualmente."

    # Cargar todo el conocimiento extraído de los PDFs en 'documentos_ia'
    conocimiento_pdfs = cargar_base_conocimiento_pdfs("documentos_ia")

    system_instruction = f"""
    Eres 'GENSTI AI', el asistente virtual experto y tutor académico del programa de Ingeniería de Sistemas en la Universidad Cooperativa de Colombia (UCC), Campus Ibagué.

    DOCUMENTOS OFICIALES Y REGLAMENTOS CARGADOS:
    {conocimiento_pdfs if conocimiento_pdfs else "El programa consta de 9 semestres académicos en la UCC Ibagué."}

    EVENTOS REGISTRADOS EN LA PLATAFORMA GENSTI:
    {contexto_eventos}

    REGLAS DE FORMATO Y PRESENTACIÓN (ESTRICTAS):
    1. NUNCA utilices el doble asterisco (**) ni signos de markdown para resaltar texto. Escribe todo en texto plano limpio y directo.
    2. Para explicar procesos o pasos, utiliza listas numeradas (1., 2., 3.) o viñetas con guiones (-), sin ningun asterisco (*).
    3. Asegúrate de dar respuestas COMPLETAS de principio a fin sin dejar pasos inconclusos.
    4. Utiliza saltos de línea claros entre cada paso para que la lectura sea limpia y estructurada.

    REGLAS DE INTERACCIÓN Y GUÍA:
    1. Utiliza la información de los documentos PDF cargados para explicar trámites como inscripción de materias, reglamentos u opciones de grado.
    2. Al finalizar tu respuesta, propone 1 o 2 preguntas breves de seguimiento o sugiere un módulo de GENSTI (Calendario, Noticias, PQRS) para mantener guiado al usuario.
    3. Tono: Universitario, profesional, claro y empático.
    """

    client = genai.Client(api_key=api_key)

    # Detección y lista de fallback de modelos válidos
    modelos_candidatos = []
    try:
        modelos_disponibles = client.models.list()
        for m in modelos_disponibles:
            name = m.name if hasattr(m, 'name') else str(m)
            if 'gemini' in name and ('flash' in name or 'pro' in name):
                modelos_candidatos.append(name.replace('models/', ''))
    except Exception as e:
        print("Fallo en detección dinámica de modelos:", e)

    if not modelos_candidatos:
        modelos_candidatos = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash']

    respuesta_final = None
    ultimo_error = None

    for model_name in modelos_candidatos:
        try:
            res = client.models.generate_content(
                model=model_name,
                contents=user_message,
                config=types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    temperature=0.6,
                    max_output_tokens=2000,  # Aumentado para evitar respuestas cortadas
                ),
            )
            if res and res.text:
                respuesta_final = res.text
                break
        except Exception as err:
            ultimo_error = err
            continue

    if respuesta_final:
        return Response({'reply': respuesta_final})

    return Response({
        'reply': f'Error de conexión con el servicio de IA: {str(ultimo_error)}'
    }, status=200)
