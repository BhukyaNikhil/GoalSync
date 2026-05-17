# GoalSync

Enterprise-grade goal setting and performance tracking portal built with React, Vite, Tailwind CSS, Node.js, Express, MongoDB, and JWT authentication.

## Setup

### Backend

```bash
cd server
npm install
cp .env.example .env
# Update .env with your MongoDB URI and JWT secret
npm run dev
```

### Frontend

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

## Features

- JWT authentication with employee, manager, and admin roles
- Goal creation, approval workflow, and quarterly check-ins
- Analytics dashboards with Recharts
- Modern glassmorphism UI and responsive layout
- Audit logs, notifications, and admin controls

## API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/goals`
- `POST /api/goals`
- `PUT /api/goals/:id`
- `DELETE /api/goals/:id`
- `POST /api/goals/:id/approve`
- `POST /api/checkins`
- `GET /api/checkins`
- `GET /api/users`
- `PUT /api/users/:id`
- `POST /api/users/reset-goals`
- `GET /api/analytics`

## Seed Data

Run `npm run seed` from the `server` folder after installing dependencies to create demo users and goals.
