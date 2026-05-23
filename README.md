# 💪 GymWorkout

A full-stack gym workout tracking application built with **.NET** (backend) and **React + TypeScript** (frontend).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | .NET (C#), ASP.NET Core Web API |
| Frontend | React, TypeScript, Vite |
| Database | Entity Framework Core (with Migrations) |
| Auth | JWT Authentication |
| Containerization | Docker / Docker Compose |

---

## Project Structure

```
GymWorkout/
├── docker-compose.yml
├── Dockerfile
├── Program.cs
├── appsettings.json
├── Controllers/
│   ├── AuthController.cs
│   ├── ExerciseController.cs
│   ├── UserController.cs
│   └── WorkoutController.cs
├── Data/
├── Helpers/
├── Migrations/
├── Models/
└── client/                        # React frontend
    ├── public/
    └── src/
        ├── assets/
        ├── context/
        │   ├── AuthContext.tsx
        │   ├── AuthProvider.tsx
        │   ├── protectedRoutes.tsx
        │   └── useAuth.tsx
        ├── pages/
        │   ├── Homepage.tsx
        │   ├── Login.tsx
        │   ├── Register.tsx
        │   └── UserStats.tsx
        ├── types/
        │   ├── auth.tsx
        │   └── exercise.tsx
        ├── Api.tsx
        ├── App.tsx
        ├── App.css
        ├── main.tsx
        └── index.css
```

---

## Features

- User registration and login with JWT authentication
- Protected routes on the frontend
- Browse and manage exercises
- Track workouts
- View user stats
- Dockerized for easy deployment

---

## Getting Started

### Prerequisites

- [.NET SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/) (optional)

---

### Running with Docker

```bash
docker-compose up --build
```

---

### Running Locally

#### Backend

```bash
cd GymWorkout
dotnet restore
dotnet ef database update
dotnet run
```

#### Frontend

```bash
cd client
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` and the API on `http://localhost:5000` (or as configured).

---

## API Endpoints

| Controller | Base Route | Description |
|---|---|---|
| AuthController | `/api/auth` | Register, Login |
| UserController | `/api/user` | User profile & management |
| ExerciseController | `/api/exercise` | Exercise CRUD |
| WorkoutController | `/api/workout` | Workout tracking |

---

## Environment Variables

Configure `appsettings.json` for the backend:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "your-connection-string"
  },
  "Jwt": {
    "Key": "your-secret-key",
    "Issuer": "your-issuer"
  }
}
```

For the frontend, create a `.env` file inside `/client`:

```
VITE_API_URL=http://localhost:5000
```

---

