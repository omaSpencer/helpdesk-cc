# Ticket Management System

A fullstack ticket management system built with **Fastify**, **Prisma**, **PostgreSQL**, and **Vite + React** frontend.

## Features

- Create, update, and manage support tickets
- Auto-generated ticket numbers (e.g., `T-000001`)
- Ticket priority levels (LOW, MEDIUM, HIGH)
- REST API with Fastify
- Input validation using Zod
- PostgreSQL database via Prisma ORM
- CORS support for frontend integration
- Frontend built with Vite and React

## Tech Stack

- **Backend:** Fastify, Prisma, Zod
- **Database:** PostgreSQL
- **Frontend:** Vite, React, TypeScript
- **Deployment:** Localhost or containerized setup

## Installation

### Backend

1. Install dependencies:

   ```bash
   cd apps/api
   npm install
   ```

2. Configure the database in `.env`:

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/ticketdb"
   ```

3. Run migrations:

   ```bash
   npx prisma migrate dev
   ```

4. Start the server:

   ```bash
   npm run dev
   ```

   Backend runs by default on: `http://localhost:3000`

### Frontend

1. Install dependencies:

   ```bash
   cd apps/web
   npm install
   ```

2. Configure API URL in `.env`:

   ```env
   VITE_API_URL=http://localhost:3000
   ```

3. Start the frontend:

   ```bash
   npm run dev
   ```

   Frontend runs by default on: `http://localhost:5173`

## API Endpoints

### Create Ticket

```http
POST /tickets
Content-Type: application/json

{
  "title": "Example ticket",
  "description": "Something is not working",
  "priority": "MEDIUM"
}
```

### Update Ticket

```http
PATCH /tickets/:id
Content-Type: application/json

{
  "title": "Updated ticket title",
  "priority": "HIGH"
}
```

### Get Tickets

```http
GET /tickets
```

### Get Ticket by ID

```http
GET /tickets/:id
```

### Delete Ticket

```http
DELETE /tickets/:id
```

## Development Notes

- CORS is enabled, but make sure to allow the necessary methods (`GET, POST, PATCH, DELETE, OPTIONS`) in your Fastify CORS config.
- Prisma migrations must be executed before starting the backend.
- Frontend uses `fetchJson` helper to call backend API.

## License

MIT License
