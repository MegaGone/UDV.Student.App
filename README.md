# UDV Student App

Aplicación de gestión de perfil de usuario para la Universidad Da Vinci de Guatemala.
Permite registrar usuarios (solo administradores), iniciar sesión y asignar una foto
de perfil tomada con la cámara o elegida de la galería.

El repositorio contiene dos proyectos:

| Carpeta | Tecnología | Descripción |
|---------|-----------|-------------|
| `UDV.Student.Backend` | NestJS + TypeORM + SQLite | API REST, autenticación JWT, roles y almacenamiento de imágenes |
| `UDV.Student.Client` | Flutter (Riverpod, MVVM) | App móvil (login, perfil, avatar) |

---

## Arquitectura (resumen)

- **Backend:** arquitectura hexagonal (dominio / aplicación / infraestructura / presentación).
  Autenticación con JWT (access + refresh), sesiones en Redis, control de acceso por
  roles (`ADMIN` / `USER`) y almacenamiento de avatares en MinIO (compatible con S3)
  mediante URLs prefirmadas en dos fases (subir → confirmar).
- **Cliente:** patrón MVVM con Riverpod. Cada feature se separa en
  `model` → `data` (service) → `viewmodel` → `view`.

---

## Requisitos previos

- **Docker** y **Docker Compose** (para Redis y MinIO)
- **Node.js** 20+ y **pnpm** (backend)
- **Flutter SDK** 3.x (cliente)

---

## 1. Backend

### 1.1. Levantar todo con Docker (recomendado)

`docker compose` levanta Redis, MinIO **y el backend** (con hot reload y leyendo
las variables desde el `.env`):

```bash
cd UDV.Student.Backend
cp .env.example .env      # ver variables en 1.3
docker compose up -d
```

- API: `http://localhost:3000/api/v1`
- MinIO API: `http://localhost:9000`
- MinIO consola web: `http://localhost:9001` (usuario/clave: `minioadmin` / `minioadmin`)

El servicio `backend` monta el código fuente, así que cualquier cambio recompila
automáticamente (NestJS `--watch`). Dentro de la red de Docker el backend alcanza a
Redis y MinIO por nombre de servicio (`redis`, `minio`); por eso el compose fuerza
`REDIS_HOST=redis`.

> La primera vez, para sembrar los usuarios con sus roles, levantá el backend una vez
> con `RESET_ALL_ON_STARTUP=1` y `SQL_SYNCHRONIZE=1` en el `.env`, y luego quitálos.

### 1.2. Crear el bucket en MinIO

MinIO **no crea el bucket automáticamente**. Entrá a la consola web
(`http://localhost:9001`) y creá un bucket llamado **`images`**.

### 1.3. Variables de entorno

Copiá el ejemplo y ajustá lo que necesites:

```bash
cp .env.example .env
```

Variables relevantes:

| Variable | Default | Descripción |
|----------|---------|-------------|
| `PORT` | `3000` | Puerto de la API |
| `SQL_SYNCHRONIZE` | — | `1` sincroniza el esquema automáticamente (dev) |
| `RESET_ALL_ON_STARTUP` | — | `1` borra y re-siembra los datos al arrancar |
| `SQL_DATABASE` | `udvstudentapp.sqlite` | Archivo de la base SQLite |
| `STORAGE_BUCKET` | `images` | Bucket de MinIO |
| `STORAGE_ACCESS_KEY` | `minioadmin` | Usuario de MinIO |
| `STORAGE_SECRET_KEY` | `minioadmin` | Clave de MinIO |
| `STORAGE_PUBLIC_ENDPOINT` | `http://localhost:9000` | Host que arma las URLs firmadas (ver nota de dispositivo) |
| `ALLOWED_MEDIA_TYPE` | `image/jpeg,image/png,image/jpg` | Tipos permitidos |

> **Nota para dispositivo/emulador:** `STORAGE_PUBLIC_ENDPOINT` es el host con el
> que se firman las URLs de las imágenes, y el teléfono las consume tal cual. Si el
> backend corre en Docker y el avatar lo sube un dispositivo, poné ahí la **IP de tu
> PC en la red local** (ej. `http://192.168.1.X:9000`): ese host lo alcanzan tanto el
> teléfono como el contenedor del backend. `localhost` solo sirve si todo corre en la
> misma máquina.

### 1.4. Correr el backend fuera de Docker (alternativa)

Si preferís correrlo local (necesitás Redis y MinIO igualmente, vía `docker compose up -d redis minio`):

```bash
pnpm install
pnpm run start:dev
```

- API: `http://localhost:3000/api/v1`
- Documentación (si `DEBUG_MODE=1`): `http://localhost:3000/api/docs`

### 1.5. Usuarios sembrados

| Correo | Clave | Rol |
|--------|-------|-----|
| `catedratico@udv.edu.gt` | `Seed.Udv2026` | `ADMIN` |
| `estudiante@udv.edu.gt` | `Seed.Udv2026` | `USER` |

### 1.6. Migraciones (opcional, alternativa a `SQL_SYNCHRONIZE`)

```bash
pnpm run migration:run       # aplica migraciones pendientes
pnpm run migration:revert    # revierte la última
```

### 1.7. Endpoints principales

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `POST` | `/api/v1/auth/register` | Admin | Crear usuario |
| `POST` | `/api/v1/auth/login` | — | Iniciar sesión |
| `POST` | `/api/v1/auth/refresh` | — | Rotar tokens |
| `POST` | `/api/v1/auth/logout` | Sí | Cerrar sesión |
| `GET` | `/api/v1/users/me` | Sí | Perfil + URL firmada del avatar |
| `POST` | `/api/v1/users/me/avatar/upload-url` | Sí | URL prefirmada de subida |
| `PATCH` | `/api/v1/users/me/avatar` | Sí | Confirmar avatar subido |

---

## 2. Cliente (Flutter)

### 2.1. Instalar dependencias

```bash
cd UDV.Student.Client
flutter pub get
```

### 2.2. Correr la app

La URL del backend se pasa por `--dart-define=API_HOST`, según dónde corras la app:

**Emulador Android** (el loopback del emulador hacia tu PC es `10.0.2.2`):

```bash
flutter run --dart-define=API_HOST=http://10.0.2.2:3000
```

**Dispositivo físico** (misma red WiFi; usá la IP de tu PC):

```bash
flutter run --dart-define=API_HOST=http://192.168.1.X:3000
```

> `--dart-define` es de tiempo de compilación: si cambiás el valor, detené y
> volvé a correr `flutter run` (no alcanza con hot reload).

### 2.3. Notas para dispositivo físico

- El teléfono y la PC deben estar en la **misma red WiFi**.
- Permití los puertos `3000` (API) y `9000` (MinIO) en el firewall de tu PC.
- Para que la foto suba desde el dispositivo, el backend debe firmar las URLs con
  un host alcanzable: ajustá `STORAGE_PUBLIC_ENDPOINT` a `http://<IP_DE_TU_PC>:9000`.
- Activá **Depuración USB** en el teléfono y verificá con `flutter devices`.

### Cómo encontrar tu IP privada (IPv4)

Esa IP (`<IP_DE_TU_PC>`) es la que usás tanto en `--dart-define=API_HOST` como en
`STORAGE_PUBLIC_ENDPOINT`. Buscá la del adaptador WiFi activo:

**Windows** (PowerShell o CMD):

```powershell
ipconfig
# Buscá "Dirección IPv4" en tu adaptador de Wi-Fi (ej. 192.168.1.6)
```

**Linux:**

```bash
hostname -I | awk '{print $1}'
# o: ip -4 addr show wlan0 | grep -oP '(?<=inet\s)\d+(\.\d+){3}'
```

**macOS:**

```bash
ipconfig getifaddr en0     # en0 suele ser Wi-Fi (probá en1 si no)
```

> Es una IP privada (empieza con `192.168.`, `10.` o `172.16`–`172.31`). No uses la
> IP pública ni `127.0.0.1`.

---

## Flujo de uso

1. Iniciar sesión con un usuario sembrado (o creado por un administrador).
2. Ver la pantalla de perfil.
3. Tocar **Cambiar foto** → elegir **Cámara** o **Galería**.
4. Tocar el avatar para verlo en detalle (con zoom).
5. Si el usuario es administrador, el ícono **crear usuario** aparece en la barra superior.
