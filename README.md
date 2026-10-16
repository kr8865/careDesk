# Healthcare Management App

A full-stack app for managing patients, doctors and patient–doctor assignments.

- **Backend:** Node.js, Express 5, MongoDB (Mongoose), JWT auth
- **Frontend:** React + Vite

## Features

- Register and log in using an access token and a refresh token (JWT)
- Patients: create, list, view, update and delete. Each user only sees their own patients.
- Doctors: every user can see all doctors; only the user who added a doctor can edit or delete it.
- Assignments: assign one or more doctors to a patient, list assignments, and remove them.

## Project structure

```
health-care/
├── backend/
│   ├── src/
│   │   ├── config/        # env variables, MongoDB connection
│   │   ├── models/        # User, Patient, Doctor, Mapping
│   │   ├── controllers/   # route logic
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # auth, validation, error handling
│   │   ├── validators/    # request validation rules
│   │   ├── utils/         # ApiError, JWT helpers
│   │   ├── app.js
│   │   └── server.js
│   └── postman_collection.json
└── frontend/
    └── src/               # React pages, components, API client
```

## Getting started

### Requirements

- Node.js 18 or newer
- A MongoDB database (for example, a free MongoDB Atlas cluster)

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Fill in `.env`:

| Variable | Description |
| --- | --- |
| `PORT` | API port (default `5001`) |
| `CLIENT_URL` | Frontend URL allowed by CORS (default `http://localhost:5173`) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_ACCESS_SECRET` | Secret for access tokens |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens |
| `JWT_ACCESS_EXPIRES_IN` | Access token lifetime (default `1h`) |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token lifetime (default `7d`) |

To generate a secret:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Start the API:

```bash
npm run dev    # restarts automatically when files change
# or
npm start
```

The API runs at `http://localhost:5001`.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. During development, Vite forwards `/api` requests to `http://localhost:5001`, so you don't need any CORS setup.

## API

All routes start with `/api`. Every route except register, login and refresh needs this header:

```
Authorization: Bearer <access token>
```

### Auth

| Method | Route | Body |
| --- | --- | --- |
| POST | `/auth/register` | `{ name, email, password }` |
| POST | `/auth/login` | `{ email, password }` |
| POST | `/auth/refresh` | `{ refresh }` |
| GET | `/auth/me` | — |

### Patients

| Method | Route | Description |
| --- | --- | --- |
| POST | `/patients` | Create a patient `{ name, age, gender, phone?, email?, address?, medicalHistory? }` |
| GET | `/patients` | List your patients |
| GET | `/patients/:id` | Get one patient with their assigned doctors |
| PUT | `/patients/:id` | Update a patient |
| DELETE | `/patients/:id` | Delete a patient and their assignments |

### Doctors

| Method | Route | Description |
| --- | --- | --- |
| POST | `/doctors` | Create a doctor `{ name, specialization, email, phone?, experienceYears? }` |
| GET | `/doctors` | List all doctors |
| GET | `/doctors/:id` | Get one doctor |
| PUT | `/doctors/:id` | Update a doctor (creator only) |
| DELETE | `/doctors/:id` | Delete a doctor and their assignments (creator only) |

### Assignments (patient–doctor mappings)

| Method | Route | Description |
| --- | --- | --- |
| POST | `/mappings` | Assign a doctor to a patient `{ patientId, doctorId, notes? }` |
| GET | `/mappings` | List all assignments for your patients |
| GET | `/mappings/:patientId` | List the doctors assigned to one patient |
| DELETE | `/mappings/:id` | Remove an assignment |

A patient can have many doctors, and a doctor can have many patients. The same doctor can't be assigned to the same patient twice.

### Responses

Success:

```json
{ "success": true, "message": "...", "...": "data" }
```

Error:

```json
{ "success": false, "message": "Validation failed", "errors": [{ "field": "email", "message": "A valid email is required" }] }
```

## How authentication works

- When you log in or register, the API returns an **access token** (valid for 1 hour) and a **refresh
