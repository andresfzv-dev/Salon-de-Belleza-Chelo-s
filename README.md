# Salón de Belleza Chelo's — Sistema de Gestión

Sistema web completo para la gestión del Salón de Belleza Chelo's. Incluye un panel administrativo para la dueña del salón y un portal público para que los clientes agenden sus citas en línea.

## Descripción

El sistema permite gestionar citas, clientes, servicios y pagos del salón, con recordatorios automáticos por correo electrónico y un portal de autoagendamiento para los clientes.

## Tecnologías

**Backend**
- Java 21 + Spring Boot 4
- Spring Security + JWT
- Spring Data JPA + Hibernate
- PostgreSQL
- Resend (emails)
- Swagger / OpenAPI
- Docker

**Frontend**
- React 19 + Vite
- React Router v6
- TanStack Query
- FullCalendar
- CSS Modules

## Estructura del repositorio
```
Salon-de-Belleza-Chelo-s/
├── salon-api/          # Backend Spring Boot
├── salon-chelos-web/   # Frontend React
├── docker-compose.yml  # Orquestacion de contenedores
└── .env                # Variables de entorno (no incluido en el repo)
```

## Funcionalidades

**Panel administrativo (`/admin`)**
- Autenticación con JWT
- Gestión de clientes con búsqueda por teléfono
- Gestión de servicios con duración y precio
- Calendario de citas con FullCalendar
- Control de disponibilidad y solapamiento de horarios
- Registro de pagos (efectivo y transferencia)
- Reportes de ingresos diarios y mensuales
- Dashboard con agenda del día

**Portal público (`/`)**
- Selección de servicio con precio y duración
- Consulta de disponibilidad en tiempo real
- Agendamiento en 4 pasos sin registro
- Confirmación de cita al finalizar

**Automatización**
- Recordatorios automáticos por email a las 6PM del día anterior
- Registro automático de clientes nuevos desde el portal público

## Arquitectura

El backend sigue una arquitectura en capas con influencia de DDD:
```
salon-api/
├── domain/          # Entidades y repositorios
├── application/     # Servicios, DTOs y excepciones
├── infrastructure/  # Controladores, email y scheduler
└── config/          # Seguridad, CORS y Swagger
```

El frontend sigue una arquitectura feature-based:
```
salon-chelos-web/
├── features/        # Modulos por dominio (citas, clientes, etc.)
├── components/ui/   # Componentes reutilizables
├── pages/           # Páginas de la aplicacion
├── api/             # Capa de comunicacion con el backend
└── router/          # Configuracion de rutas
```

## Docker

La forma más sencilla de correr el proyecto es con Docker. Solo necesitas tener Docker Desktop instalado.

1. Clona el repositorio:
```bash
git clone https://github.com/andresfzv-dev/Salon-de-Belleza-Chelo-s.git
cd Salon-de-Belleza-Chelo-s
```

2. Crea el archivo `.env` en la raíz del repositorio:
```env
DB_USERNAME=postgres
DB_PASSWORD=tu_password
JWT_SECRET=tu_clave_secreta_de_256_bits
JWT_EXPIRATION=86400000
ADMIN_EMAIL=admin@salonchelos.com
ADMIN_PASSWORD=tu_password_admin
ADMIN_NOMBRE=Chelo
CORS_ALLOWED_ORIGINS=http://localhost:5173
RESEND_API_KEY=tu_api_key_de_resend
RESEND_FROM=onboarding@resend.dev
```

3. Levanta los contenedores:
```bash
docker-compose up --build
```

El backend queda disponible en `http://localhost:8080`. La primera vez tarda unos minutos mientras descarga las imágenes y compila el proyecto.

Para detener los contenedores:
```bash
docker-compose down
```

Para detener y eliminar los datos de la base de datos:
```bash
docker-compose down -v
```

## Instalación local (sin Docker)

### Requisitos
- Java 21
- Node.js 22+
- PostgreSQL 17

### Backend

1. Entra a la carpeta del backend:
```bash
cd salon-api
```

2. Crea la base de datos en PostgreSQL:
```sql
CREATE DATABASE salon_chelos;
```

3. Crea el archivo `.env` en la raíz de `salon-api`:
```env
DB_URL=jdbc:postgresql://localhost:5432/salon_chelos
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_password
JWT_SECRET=tu_clave_secreta_de_256_bits
JWT_EXPIRATION=86400000
ADMIN_EMAIL=admin@salonchelos.com
ADMIN_PASSWORD=tu_password_admin
ADMIN_NOMBRE=Chelo
CORS_ALLOWED_ORIGINS=http://localhost:5173
RESEND_API_KEY=tu_api_key_de_resend
RESEND_FROM=onboarding@resend.dev
```

4. Corre la aplicación:
```bash
# Windows
.\mvnw.cmd spring-boot:run

# Linux / Mac
./mvnw spring-boot:run
```

El servidor arranca en `http://localhost:8080`. La documentación de la API está disponible en `http://localhost:8080/swagger-ui.html`.

### Frontend

1. Entra a la carpeta del frontend:
```bash
cd salon-chelos-web
```

2. Instala las dependencias:
```bash
npm install
```

3. Crea el archivo `.env`:
```env
VITE_API_URL=http://localhost:8080/api
```

4. Corre el servidor de desarrollo:
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

## URLs

| URL | Descripción |
|---|---|
| `http://localhost:5173/` | Portal público para clientes |
| `http://localhost:5173/admin/login` | Acceso al panel administrativo |
| `http://localhost:8080/swagger-ui.html` | Documentación de la API |

Las credenciales iniciales del admin se configuran en las variables de entorno `ADMIN_EMAIL` y `ADMIN_PASSWORD`.

## Variables de entorno

Ninguna credencial está hardcodeada en el código. Todas las variables sensibles se manejan a través de archivos `.env` que están excluidos del repositorio mediante `.gitignore`.

## Autor

Desarrollado por [Andrés Felipe](https://github.com/andresfzv-dev) como proyecto.
