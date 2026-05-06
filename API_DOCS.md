# UniMarket — Documentación de la API

URL base del servidor desplegado:
```
https://unimarket-backend-production-344b.up.railway.app
```

Todas las peticiones van a esa URL seguidas de la ruta que se explica abajo.

---

## Cómo hacer las peticiones

- Todas las peticiones usan **JSON** en el cuerpo (`Content-Type: application/json`).
- La API siempre responde con un JSON que tiene esta forma:

```json
{
  "ok": true,
  "mensaje": "Descripción de lo que pasó",
  "datos": { ... }
}
```

Si algo sale mal, `ok` viene en `false` y `datos` en `null`.

---

## Endpoints disponibles

### 1. Verificar que el servidor esté activo

**GET** `/api/health`

No necesita nada. Solo sirve para confirmar que la API está corriendo.

**Respuesta exitosa:**
```json
{
  "ok": true,
  "mensaje": "UniMarket API funcionando"
}
```

---

### 2. Registro de usuario

**POST** `/api/auth/registro`

Crea una cuenta nueva. El email **debe ser** del dominio `@upb.edu.co`.

**Cuerpo de la petición:**
```json
{
  "full_name": "Juan Pérez",
  "username": "juanperez",
  "email": "juan.perez@upb.edu.co",
  "password": "miContraseña123",
  "celular": "3001234567",
  "documento_identidad": "1234567890"
}
```

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `full_name` | texto | Sí | Nombre completo |
| `username` | texto | Sí | Nombre de usuario único |
| `email` | texto | Sí | Debe terminar en `@upb.edu.co` |
| `password` | texto | Sí | Contraseña (se guarda cifrada) |
| `celular` | texto | Sí | Número de celular |
| `documento_identidad` | texto | Sí | Cédula u otro documento |

**Respuesta exitosa (201):**
```json
{
  "ok": true,
  "mensaje": "Usuario registrado exitosamente",
  "datos": {
    "id": "uuid-generado",
    "full_name": "Juan Pérez",
    "username": "juanperez",
    "email": "juan.perez@upb.edu.co",
    "celular": "3001234567",
    "documento_identidad": "1234567890",
    "created_at": "2026-05-06T12:00:00.000Z"
  }
}
```

**Errores posibles:**
```json
{ "ok": false, "mensaje": "El email debe ser del dominio @upb.edu.co", "datos": null }
{ "ok": false, "mensaje": "El email ya está registrado", "datos": null }
{ "ok": false, "mensaje": "El username ya está en uso", "datos": null }
```

---

### 3. Inicio de sesión

**POST** `/api/auth/login`

Inicia sesión con email o username. Devuelve un **token** que se usa para las próximas peticiones que requieran autenticación.

**Cuerpo de la petición:**
```json
{
  "identificador": "juanperez",
  "password": "miContraseña123"
}
```

> El campo `identificador` acepta tanto el **username** como el **email** del usuario.

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `identificador` | texto | Sí | Username o email del usuario |
| `password` | texto | Sí | Contraseña |

**Respuesta exitosa (200):**
```json
{
  "ok": true,
  "mensaje": "Login exitoso",
  "datos": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "usuario": {
      "id": "uuid-del-usuario",
      "full_name": "Juan Pérez",
      "username": "juanperez",
      "email": "juan.perez@upb.edu.co"
    }
  }
}
```

**Errores posibles:**
```json
{ "ok": false, "mensaje": "Usuario o contraseña incorrectos", "datos": null }
{ "ok": false, "mensaje": "Credenciales inválidas", "datos": null }
```

---

---

## Publicaciones (Listings)

Las publicaciones son los productos y servicios que los usuarios publican en el marketplace. Hay tres categorías: `compraventa`, `servicios` y `alimentos`. Cada una tiene campos extra distintos.

---

### 4. Listar publicaciones

**GET** `/api/listings`

Devuelve la lista de publicaciones. No requiere token. Soporta filtros opcionales por query params en la URL.

**Parámetros opcionales en la URL:**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `category` | texto | Filtra por categoría: `compraventa`, `servicios` o `alimentos` |
| `seller_id` | texto (uuid) | Filtra por el id del vendedor |
| `fecha_desde` | fecha | Muestra solo publicaciones desde esa fecha (`2026-01-01`) |
| `page` | número | Número de página (default: 1) |
| `limit` | número | Cuántos resultados por página (default: 10) |

**Ejemplo de URL con filtros:**
```
GET /api/listings?category=compraventa&page=1&limit=5
```

**Respuesta exitosa (200):**
```json
{
  "ok": true,
  "mensaje": "Publicaciones obtenidas",
  "datos": {
    "publicaciones": [
      {
        "id": "uuid",
        "seller_id": "uuid-del-vendedor",
        "category": "compraventa",
        "title": "Calculadora graficadora",
        "description": "Poco uso, funciona perfecto",
        "price": "85000",
        "image_url": "https://...",
        "extra_data": { "condicion": "usado" },
        "is_available": true,
        "created_at": "2026-05-06T12:00:00.000Z"
      }
    ],
    "total": 25,
    "pagina": 1,
    "totalPaginas": 3
  }
}
```

---

### 5. Ver una publicación

**GET** `/api/listings/:id`

Devuelve el detalle de una sola publicación. No requiere token.

**Ejemplo:**
```
GET /api/listings/550e8400-e29b-41d4-a716-446655440000
```

**Respuesta exitosa (200):**
```json
{
  "ok": true,
  "mensaje": "Publicación obtenida",
  "datos": {
    "id": "uuid",
    "seller_id": "uuid",
    "category": "servicios",
    "title": "Clases de cálculo",
    "description": "Doy clases personalizadas",
    "price": "30000",
    "image_url": null,
    "extra_data": { "modalidad": "virtual" },
    "is_available": true,
    "created_at": "2026-05-06T12:00:00.000Z"
  }
}
```

**Error si no existe (404):**
```json
{ "ok": false, "mensaje": "Publicación no encontrada", "datos": null }
```

---

### 6. Crear publicación

**POST** `/api/listings`

Crea una nueva publicación. **Requiere token.**

El campo `extra_data` cambia según la categoría:

**Cuerpo para `compraventa`:**
```json
{
  "category": "compraventa",
  "title": "Calculadora graficadora",
  "description": "Poco uso, funciona perfecto",
  "price": 85000,
  "image_url": "https://...",
  "extra_data": {
    "condicion": "usado"
  }
}
```

**Cuerpo para `servicios`:**
```json
{
  "category": "servicios",
  "title": "Clases de cálculo",
  "description": "Doy clases personalizadas",
  "price": 30000,
  "image_url": null,
  "extra_data": {
    "modalidad": "virtual"
  }
}
```

**Cuerpo para `alimentos`:**
```json
{
  "category": "alimentos",
  "title": "Almuerzos caseros",
  "description": "Menú del día con sopa y seco",
  "price": 12000,
  "image_url": null,
  "extra_data": {
    "horario_inicio": "11:00",
    "horario_fin": "14:00"
  }
}
```

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `category` | texto | Sí | `compraventa`, `servicios` o `alimentos` |
| `title` | texto | Sí | Título de la publicación |
| `description` | texto | Sí | Descripción del producto o servicio |
| `price` | número | Sí | Precio en pesos, debe ser mayor a 0 |
| `image_url` | texto | No | URL de la imagen (puede omitirse) |
| `extra_data.condicion` | texto | Si es `compraventa` | `nuevo` o `usado` |
| `extra_data.modalidad` | texto | Si es `servicios` | Ej: `virtual`, `presencial` |
| `extra_data.horario_inicio` | texto | Si es `alimentos` | Hora de inicio (`11:00`) |
| `extra_data.horario_fin` | texto | Si es `alimentos` | Hora de fin (`14:00`) |

**Respuesta exitosa (201):**
```json
{
  "ok": true,
  "mensaje": "Publicación creada exitosamente",
  "datos": { ... publicación creada ... }
}
```

**Errores posibles:**
```json
{ "ok": false, "mensaje": "Titulo, descripción y precio son obligatorios", "datos": null }
{ "ok": false, "mensaje": "El precio debe ser un número mayor a 0", "datos": null }
{ "ok": false, "mensaje": "Categoria invalida. Debe ser: compraventa, servicios, alimentos", "datos": null }
{ "ok": false, "mensaje": "Las publicaciones de compraventa requieren condicion (nuevo/usado)", "datos": null }
```

---

### 7. Editar publicación

**PATCH** `/api/listings/:id`

Actualiza los datos de una publicación. **Requiere token.** Solo el dueño de la publicación puede editarla. Todos los campos son opcionales, solo envías los que quieres cambiar.

**Ejemplo de cuerpo:**
```json
{
  "title": "Nuevo título",
  "price": 90000,
  "is_available": false
}
```

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `title` | texto | Nuevo título |
| `description` | texto | Nueva descripción |
| `price` | número | Nuevo precio |
| `image_url` | texto | Nueva imagen |
| `extra_data` | objeto | Nuevos datos extra |
| `is_available` | booleano | `true` para activa, `false` para desactivar |

**Respuesta exitosa (200):**
```json
{
  "ok": true,
  "mensaje": "Publicación actualizada",
  "datos": { ... publicación actualizada ... }
}
```

**Errores posibles:**
```json
{ "ok": false, "mensaje": "Publicación no encontrada", "datos": null }
{ "ok": false, "mensaje": "No tienes permiso para editar esta publicación", "datos": null }
```

---

### 8. Eliminar publicación

**DELETE** `/api/listings/:id`

Elimina una publicación. **Requiere token.** Solo el dueño puede eliminarla.

**Ejemplo:**
```
DELETE /api/listings/550e8400-e29b-41d4-a716-446655440000
```

**Respuesta exitosa (200):**
```json
{
  "ok": true,
  "mensaje": "Publicación eliminada",
  "datos": null
}
```

**Errores posibles:**
```json
{ "ok": false, "mensaje": "Publicación no encontrada", "datos": null }
{ "ok": false, "mensaje": "No tienes permiso para eliminar esta publicación", "datos": null }
```

---

## Cómo usar el token en Angular

Después del login, guarda el token y el usuario. Ejemplo de servicio en Angular:

```typescript
// auth.service.ts
login(identificador: string, password: string) {
  return this.http.post('https://unimarket-backend-production-344b.up.railway.app/api/auth/login', {
    identificador,
    password
  }).subscribe((res: any) => {
    if (res.ok) {
      localStorage.setItem('token', res.datos.token);
      localStorage.setItem('usuario', JSON.stringify(res.datos.usuario));
    }
  });
}
```

Para las peticiones que requieren autenticación (listings: crear, editar, eliminar), debes enviar el token en el header así:

```typescript
const token = localStorage.getItem('token');
const headers = { Authorization: `Bearer ${token}` };

// Ejemplo: crear publicación
this.http.post('https://unimarket-backend-production-344b.up.railway.app/api/listings', body, { headers }).subscribe(...);

// Ejemplo: eliminar publicación
this.http.delete(`https://unimarket-backend-production-344b.up.railway.app/api/listings/${id}`, { headers }).subscribe(...);
```

---

## Resumen rápido

| Método | Ruta | Qué hace | Token requerido |
|--------|------|----------|-----------------|
| GET | `/api/health` | Verifica que el servidor esté activo | No |
| POST | `/api/auth/registro` | Crea una cuenta nueva | No |
| POST | `/api/auth/login` | Inicia sesión y devuelve un token | No |
| GET | `/api/listings` | Lista publicaciones (con filtros opcionales) | No |
| GET | `/api/listings/:id` | Ver detalle de una publicación | No |
| POST | `/api/listings` | Crear una publicación | **Sí** |
| PATCH | `/api/listings/:id` | Editar una publicación propia | **Sí** |
| DELETE | `/api/listings/:id` | Eliminar una publicación propia | **Sí** |
