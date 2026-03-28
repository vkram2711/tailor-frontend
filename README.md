
# Tailor — Client & Appointment Management for Tailors

A SaaS platform built for independent tailors to manage their client relationships, appointments, and measurements in one place. Designed based on interviews with tailors across Bangkok and Buenos Aires, spanning budget through high-end segments.

## Features

- **Client management** — store client profiles, contact details, and notes
- **Measurements** — record and track body measurements per client over time
- **Appointment booking** — tailors create appointments; clients can self-book via a shareable link
- **Calendar view** — see all appointments at a glance with a monthly/weekly calendar
- **Appointment workflow** — confirm, reschedule, or cancel appointments with automatic email notifications sent to clients
- **Tailor profile** — set your name, address, and phone number shown to clients in emails
- **Multi-language support** — English and Spanish (i18n-ready)
- **Auth0 authentication** — secure login for tailors

## Preview

<img width="1280" height="627" alt="image" src="https://github.com/user-attachments/assets/81c8a1ea-219f-4ca0-b1b9-6b2d16da1137" />




https://github.com/user-attachments/assets/ce00393b-a98b-4fcc-9837-a5fd50f01117



 
[Figma prototype](https://www.figma.com/proto/9GJxFexcyyaDr6J3R84c0J/Tailor-web?page-id=0%3A1&node-id=1-2&p=f&viewport=-36%2C61%2C0.54&t=79utGpcBvNDRgquR-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=1%3A2) of future features


## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Tailwind CSS, react-big-calendar |
| Backend | Python 3.10, FastAPI, uvicorn |
| Database | MongoDB Atlas (async via Motor) |
| Auth | Auth0 (OAuth 2.0 / JWT) |
| Email | Gmail SMTP via fastapi-mail |
| Deployment | Heroku (frontend + backend) |


## Project Structure

```
fullstack-tailor/
├── backend/
│   ├── main.py              # FastAPI app and all API routes
│   ├── models.py            # Pydantic data models
│   ├── auth0_utils.py       # Auth0 JWT verification and user management
│   ├── mail_utils.py        # Email notification helpers
│   ├── mongo_utils.py       # MongoDB connection
│   ├── requirements.txt
│   ├── Procfile             # Heroku process config
│   ├── runtime.txt          # Python version pin
│   └── .env.example         # Environment variable template
└── frontend/
    ├── src/
    │   ├── pages/           # Route-level page components
    │   ├── components/      # Shared UI components
    │   ├── static/          # i18n translation files (en, es)
    │   ├── App.js
    │   ├── AuthProvider.js
    │   ├── axiosInstance.js
    │   └── Callback.js
    ├── package.json
    └── .env.example         # Environment variable template
```


## Getting Started

### Prerequisites

- Node.js 20+
- Python 3.10+
- MongoDB Atlas account
- Auth0 account

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

cp .env.example .env
# Fill in your credentials in .env

uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install

cp .env.example .env.local
# Set REACT_APP_BACKEND_BASE_URL in .env.local

npm start
```


## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `AUTH0_DOMAIN` | Your Auth0 tenant domain |
| `AUTH0_CLIENT_ID` | Auth0 application client ID |
| `AUTH0_CLIENT_SECRET` | Auth0 application client secret |
| `AUTH0_API_IDENTIFIER` | Auth0 Management API audience URL |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `MAIL_USERNAME` | Gmail address used to send emails |
| `MAIL_PASSWORD` | Gmail app password (not your account password) |
| `MAIL_FROM` | From address shown in outgoing emails |
| `BACKEND_URL` | Publicly accessible backend URL |
| `FRONTEND_URL` | Publicly accessible frontend URL |

### Frontend (`frontend/.env.local`)

| Variable | Description |
|---|---|
| `REACT_APP_BACKEND_BASE_URL` | Backend API base URL |


## API Overview

### Public endpoints (no auth required)

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/tailors/{tailor_id}/customers/check` | Check if a customer exists by email |
| `GET` | `/api/tailors/{tailor_id}/customers` | Get customer by email (for self-booking) |
| `POST` | `/api/public/customers` | Register a new customer |
| `POST` | `/api/tailors/{tailor_id}/appointments` | Customer self-books an appointment |

### Protected endpoints (JWT required)

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/customers` | List all customers |
| `POST` | `/api/customers` | Create a customer |
| `GET` | `/api/customers/{id}` | Get customer details |
| `PUT` | `/api/customers/{id}` | Update customer |
| `DELETE` | `/api/customers/{id}` | Delete customer |
| `GET/POST` | `/api/customers/{id}/measurements` | Manage measurements |
| `GET` | `/api/appointments` | List all appointments |
| `POST` | `/api/appointments` | Create appointment |
| `GET` | `/api/appointments/{id}` | Get appointment details |
| `PUT` | `/api/appointments/{id}/reschedule` | Reschedule appointment |
| `PUT` | `/api/appointments/{id}/confirm` | Confirm appointment |
| `DELETE` | `/api/appointments/{id}` | Cancel appointment |
| `GET` | `/api/tailor/pending-appointments` | List unconfirmed appointments |
| `GET/POST` | `/api/tailor/profile` | Get or update tailor profile |
| `GET` | `/api/tailor/id` | Get authenticated tailor's ID |


## Deployment

Both apps are configured for Heroku.

**Backend** — uses `Procfile`:
```
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

**Frontend** — uses `static.json` for the Heroku static buildpack with client-side routing support.

Set all environment variables in the Heroku dashboard or via `heroku config:set`.
