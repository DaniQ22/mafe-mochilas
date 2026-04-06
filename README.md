# Mochilas Mafe

Proyecto con:

- Frontend en Angular 16 (`front`) separado en:
  - tienda publica (`/`)
  - panel admin (`/admin`)
- Backend en NestJS (`../backend`) para guardar y listar mochilas con imagen.

## Estructura

- Frontend: esta carpeta (`front/`)
- Backend: `../backend/`
- Uploads backend: `../backend/uploads/`
- Datos backend: `../backend/data/backpacks.json`

## Requisitos

- Node.js 18+
- npm 9+

## Ejecutar frontend

Desde `front/`:

```bash
npm install
npm start
```

Frontend en `http://localhost:4200`.

## Ejecutar backend (carpeta hermana `backend`)

Desde `../backend/`:

```bash
npm install
npm run start:dev
```

Backend en `http://localhost:3000`.

## Endpoints backend

- `GET /api/backpacks`: lista todas las mochilas.
- `POST /api/backpacks`: crea mochila con `multipart/form-data`.
  - Campos: `name` (requerido), `description` (opcional), `price` (opcional), `image` (requerido).
- `GET /uploads/:filename`: sirve imagenes subidas.

## Flujo funcional

1. Admin entra a `http://localhost:4200/admin` y sube productos con imagen.
2. Cliente entra a `http://localhost:4200/` y ve catalogo dinamico.
3. Cliente consulta o compra por WhatsApp (sin pasarela de pagos).
