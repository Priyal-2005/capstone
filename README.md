# **MediConnect**

### Full Stack Doctor Appointment Booking System

---

## **Problem Statement**

MediConnect is a full-stack doctor appointment booking system that allows patients, doctors, and admins to interact through a single platform. Patients can book appointments with doctors, doctors can manage their schedules, and admins can oversee the system.

---

## **System Architecture**

- **Frontend**: React.js with React Router for page navigation and Fetch API for backend communication
- **Backend**: Node.js + Express.js
- **Database**: MySQL (relational database)

### **Authentication**
- JWT-based login/signup system for Patients, Doctors, and Admins

### **Hosting**
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: Aiven (MySQL)

---

## **User Roles**

### **Patient**
- Register/Login to the system
- View list of doctors by specialization
- Book and cancel appointments
- View upcoming & past appointments

### **Doctor**
- Login with doctor credentials
- View patient bookings
- Approve or reject appointments
- Manage available time slots

### **Admin**
- Login as admin
- Add or remove doctors
- Manage all appointments and users

---

## **Key Features**

| **Category**              | **Features**                                                                                    |
|---------------------------|-------------------------------------------------------------------------------------------------|
| **Authentication & Authorization** | User registration, login, logout; role-based access for Patient, Doctor, and Admin; JWT-based authentication |
| **CRUD Operations**       | Create, read, update, delete users, doctors, and appointments                                   |
| **Frontend Routing**      | React Router pages: Home, Login, Register, Dashboard (role-based), Doctor Details, Appointments, Admin Panel |
| **Patient Module**        | Browse doctors by specialization, view details, book/cancel appointments, view upcoming & past appointments |
| **Doctor Module**         | View appointment requests, approve/reject bookings, manage availability schedule               |
| **Admin Module**          | Approve/reject doctor accounts, manage users and appointments, view system statistics          |
| **Pagination**            | Paginate doctor lists and appointment logs for scalability                                     |
| **Filtering & Sorting**   | Filter doctors by specialization, sort by experience, fees, or ratings; search doctors by name |
| **Hosting**               | Frontend deployed on Vercel, backend on Render, database on Aiven (MySQL)                |

---

## **Tech Stack**

| **Layer**         | **Technologies**                                                               |
|-------------------|--------------------------------------------------------------------------------|
| **Frontend**      | React.js, React Router, Fetch API, CSS                                         |
| **Backend**       | Node.js, Express.js                                                            |
| **Database**      | MySQL                                                                          |
| **Authentication**| JWT-based login/signup                                                         |
| **Hosting**       | Vercel, Render, Aiven                                                  |

---

## **API Overview**

| **Endpoint**               | **Method** | **Description**                     | **Access**       |
|----------------------------|------------|-------------------------------------|------------------|
| `/api/auth/register`       | POST       | Register new user                   | Public           |
| `/api/auth/login`          | POST       | Authenticate user                   | Public           |
| `/api/users/profile`       | GET        | Fetch logged-in user’s data         | Authenticated    |
| `/api/doctors`             | GET        | List all approved doctors           | Public           |
| `/api/doctors/:id`         | GET        | Get doctor details                  | Public           |
| `/api/doctors`             | POST       | Doctor applies for registration     | Authenticated    |
| `/api/appointments`        | POST       | Book an appointment                 | Patient          |
| `/api/appointments`        | GET        | View user’s appointments            | Authenticated    |
| `/api/admin/doctors`       | GET        | Admin manages doctor accounts       | Admin            |
| `/api/admin/appointments`  | GET        | View all system appointments        | Admin            |

---

## 📡 **Complete API Reference (All Implemented Endpoints)**

Below is the full list of every API used in MediConnect, grouped by role and functionality.

---

# 🔐 AUTHENTICATION APIs

### **Register Patient**
**POST** `/auth/register`  
Creates a new patient user.

### **Login (All Roles)**
**POST** `/auth/login`  
Authenticates user and sets HTTP-only cookies.

### **Logout**
**POST** `/auth/logout`  
Clears auth cookies.

### **Get Current User**
**GET** `/user`  
Returns logged‑in user's profile (id, name, role).

---

# 🧑‍⚕️ PATIENT APIs

### **Get Doctor List (Search, Filter, Pagination, Sort)**
**GET** `/doctors`  
Query params:
- `page`
- `limit`
- `search`
- `specialization`
- `sort`
- `order`

### **Book Appointment**
**POST** `/appointments/book`  
Body:
- `doctorId`
- `dateTime`

### **Get Upcoming Appointments**
**GET** `/appointments/upcoming`

### **Get Past Appointments**
**GET** `/appointments/past`

---

# 👨‍⚕️ DOCTOR APIs

### **Get Today’s Appointments**
**GET** `/doctor/appointments/today`

### **Get Upcoming Appointments**
**GET** `/doctor/appointments/upcoming`

### **Approve / Decline Appointment**
**PUT** `/doctor/appointments/status`  
Body:
- `appointmentId`
- `status` (`APPROVED` / `DECLINED`)

---

# 🧑‍💼 ADMIN APIs

### **Get All Doctors**
**GET** `/admin/manage-doctors`

### **Add New Doctor**
**POST** `/admin/manage-doctors`  
Body:
- `name`
- `email`
- `password`
- `specialization`

### **Edit Doctor**
**PUT** `/admin/manage-doctors/:id`

### **Delete Doctor**
**DELETE** `/admin/manage-doctors/:id`

### **Get All Appointments**
**GET** `/admin/manage-appointments`

### **Delete Appointment**
**DELETE** `/admin/manage-appointments/:id`

---

# 🧵 INTERNAL / SUPPORTING ROUTES
(Used implicitly by frontend)

### **Get Logged-In User (Role Validation)**
**GET** `/user`  
Used by ProtectedRoute.

---

---

## **Concurrency: preventing double-booking**

**The race.** `POST /appointments/book` used to check the slot with `findFirst` and then `create` the appointment. Two requests arriving together could both pass the check before either inserted, so the same doctor and time were booked twice. The check also ignored status, so a declined appointment would have kept blocking its slot.

**The fix.** The database now enforces it. `Appointment.activeSlot` is `1` while an appointment is `PENDING` or `APPROVED` and `NULL` once it is declined, and `@@unique([doctorId, dateTime, activeSlot])` makes a second active booking of a slot impossible. Unique indexes treat NULLs as distinct, so a freed slot can be rebooked. The handler just inserts and maps Prisma error `P2002` to `409 "That slot is already booked"`; the doctor status update keeps `activeSlot` in sync. The migration backfills existing rows; run `node scripts/check-duplicate-active-appointments.js` first to find any existing duplicates, which would make the unique index fail.

**The test.** `backend/tests/booking.concurrency.test.js` fires 20 simultaneous booking requests for the same doctor and time.

| | Requests that returned 201 | Rows in DB for the slot |
|---|---|---|
| Before the fix | 4-5 of 20 (4 runs: 5, 5, 5, 4) | 4-5 |
| After the fix | 1 of 20 (3 runs; the other 19 returned 409) | 1 |

Run the tests against a local database (never a hosted one; the test setup refuses non-local hosts):

```bash
cd backend
createdb mediconnect_test
export TEST_DATABASE_URL="postgresql://<user>@localhost:5432/mediconnect_test?schema=public"
DATABASE_URL="$TEST_DATABASE_URL" npx prisma migrate deploy
npm test
```

CI (`.github/workflows/ci.yml`) runs the same steps against a Postgres service container.

---

## **Demo accounts**

Created by `backend/prisma/seed.js` (the seed password is defined in that file). Running the seed **deletes all existing data**, so use it only on a local or throwaway database.

| Role | Email |
|---|---|
| Admin | `admin@test.com` |
| Patient | `p1@test.com` (also `p2@test.com`, `p3@test.com`, `p4@test.com`) |
| Doctor | `doctor1@test.com` (also `doctor2@test.com`) |

---

## **TODO**

- Live frontend URL (Vercel): _add link_
- Live backend URL (Render): _add link_
