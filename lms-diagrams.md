# Learning Management System — Design Diagrams

Diagrams for the Internet and Web Technologies coursework (KH5041CMD).
Paste any block into https://mermaid.live to render and export a PNG for the report.

---

## Figure 1 — Use case diagram

```mermaid
flowchart LR
    ADMIN(("Admin"))
    DOCTOR(("Doctor"))
    STUDENT(("Student"))

    subgraph SYS["Learning Management System"]
        direction TB
        REG(["Register account"])
        LOGIN(["Log in"])
        CRC(["Create course"])
        DEAC(["Deactivate course"])
        CRU(["Create user account"])
        LSTU(["List students"])
        LDOC(["List doctors"])
        LINK(["Assign doctor to course"])
        MYC(["View assigned courses"])
        ADDM(["Add course material"])
        APPR(["Approve enrolment request"])
        BROWSE(["Browse available courses"])
        ENROL(["Request enrolment"])
        ACCESS(["Access course material<br/>(approved enrolment only)"])
    end

    STUDENT --- REG
    ADMIN --- LOGIN
    DOCTOR --- LOGIN
    STUDENT --- LOGIN

    ADMIN --- CRC
    ADMIN --- DEAC
    ADMIN --- CRU
    ADMIN --- LSTU
    ADMIN --- LDOC
    ADMIN --- LINK

    DOCTOR --- MYC
    DOCTOR --- ADDM
    DOCTOR --- APPR

    STUDENT --- BROWSE
    STUDENT --- ENROL
    STUDENT --- ACCESS
```

---

## Figure 2 — Sequence diagram: enrolment, approval and material access

Shows both authorisation layers: the role check when a student requests enrolment,
and the approved-enrolment check before any material is returned.

```mermaid
sequenceDiagram
    actor S as Student
    actor D as Doctor
    participant API as Express API
    participant DB as Database

    S->>API: POST /api/enrollments {course_id} + JWT
    API->>API: verify token, check role is student
    API->>DB: INSERT enrollment (status = pending)
    DB-->>API: enrollment id
    API-->>S: 201 Created, status pending

    D->>API: GET /api/enrollments?status=pending + JWT
    API->>API: verify token, check role is doctor
    API->>DB: SELECT pending enrolments for this doctor's courses
    DB-->>API: enrolment list
    API-->>D: 200 OK

    D->>API: PATCH /api/enrollments/:id {status: approved}
    API->>DB: UPDATE enrollment SET status = approved, decided_at = now
    DB-->>API: ok
    API-->>D: 200 OK

    S->>API: GET /api/courses/:id/materials + JWT
    API->>DB: SELECT enrollment WHERE student_user_id and course_id
    DB-->>API: status
    alt enrolment approved
        API->>DB: SELECT materials WHERE course_id
        DB-->>API: material list
        API-->>S: 200 OK
    else not approved or no enrolment
        API-->>S: 403 Forbidden
    end
```

---

## Figure 3 — Sequence diagram: login

The failure branch returns the same message whether the email or the password was
wrong, so an attacker cannot confirm which email addresses are registered.

```mermaid
sequenceDiagram
    actor U as User
    participant B as Browser
    participant API as Express API
    participant DB as Database

    U->>B: enters email and password
    B->>API: POST /api/auth/login
    API->>DB: SELECT user WHERE email = ?
    DB-->>API: user row with password hash
    alt no user, or hash does not match
        API-->>B: 401 Unauthorized
        B-->>U: "Invalid email or password"
    else credentials correct
        API->>DB: SELECT roles for this user
        DB-->>API: role list
        API-->>B: 200 OK, JWT containing user id and roles
        B-->>U: redirect to the home page for their role
    end
```

---

## Figure 4 — Entity relationship diagram

```mermaid
erDiagram
    USER ||--o{ USER_ROLE : has
    ROLE ||--o{ USER_ROLE : "granted through"
    USER ||--o| STUDENT : "may have profile"
    USER ||--o{ COURSE_DOCTOR : teaches
    COURSE ||--o{ COURSE_DOCTOR : "is taught by"
    USER ||--o{ ENROLLMENT : requests
    COURSE ||--o{ ENROLLMENT : receives
    COURSE ||--o{ MATERIAL : contains

    USER {
        int id PK
        varchar name
        varchar email UK
        varchar phone UK
        varchar password_hash "60+ chars, bcrypt"
        datetime created_at
    }
    ROLE {
        int id PK
        varchar role_name UK "admin, doctor, student"
    }
    USER_ROLE {
        int id PK
        int user_id FK
        int role_id FK
    }
    STUDENT {
        int user_id PK "also FK to USER.id"
        varchar level
        varchar school
    }
    COURSE {
        int id PK
        varchar code UK
        varchar title
        text description
        boolean is_active "false = deactivated"
        datetime created_at
    }
    COURSE_DOCTOR {
        int id PK
        int course_id FK
        int user_id FK
    }
    ENROLLMENT {
        int id PK
        int student_user_id FK
        int course_id FK
        varchar status "pending, approved, rejected"
        datetime requested_at
        datetime decided_at
    }
    MATERIAL {
        int id PK
        int course_id FK
        varchar title
        varchar file_path
        datetime uploaded_at
    }
```

---

## Decisions still open

1. **Who creates accounts.** The diagrams show public registration creating a student,
   with the admin also able to create any role. Change this if you meant admin-only
   account creation.

2. **One doctor per course, or several.** `COURSE_DOCTOR` is a join table, so a course
   can have several doctors. If a course only ever has one, replace the table with a
   single `doctor_id` foreign key on `COURSE`.

3. **Password column.** `varchar(255)`, never `varchar(50)` — a bcrypt hash is 60
   characters and would be silently truncated.

4. **Uniqueness.** On `email` (and `phone` if wanted). Not on password.
