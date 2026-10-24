# Users API

Lab 5: Advanced APIs — KH5041CMD The Internet and Web Technologies

A REST API for managing users, built with Node.js and Express.
Each user contains only `id`, `name` and `email`.
Data is held in an in-memory array; searches use `for` loops and deletion uses `splice()`.

## Setup

```bash
npm install
node index.js
```

Server runs at `http://localhost:3000`
Base URL: `http://localhost:3000/api/v1/users`

## Project structure

| File | Responsibility |
|------|----------------|
| `index.js` | Entry point — starts the server listening on port 3000 |
| `server.js` | Creates the Express app, loads middleware, mounts the router |
| `models/userModel.js` | The data (in-memory array) and all functions that touch it |
| `controllers/userController.js` | Validation, business logic and response/status codes |
| `routes/userRouter.js` | Maps each URL + HTTP method to a controller function |

This follows the MVC pattern: the model knows nothing about HTTP, the
controller knows nothing about how the data is stored, and the router
contains no logic at all.

## Endpoints

| Method | Endpoint | Description | Success | Errors |
|--------|----------|-------------|---------|--------|
| POST | `/api/v1/users` | Create a user | 201 Created | 400 Bad Request |
| GET | `/api/v1/users` | Retrieve all users | 200 OK | — |
| GET | `/api/v1/users/:id` | Retrieve one user | 200 OK | 400, 404 |
| PUT | `/api/v1/users/:id` | Update a user | 200 OK | 400, 404 |
| DELETE | `/api/v1/users/:id` | Delete a user | 200 OK | 400, 404 |

### Request body (POST and PUT)

```json
{
  "name": "Sara",
  "email": "sara@example.com"
}
```

## Validation rules

- `name` and `email` must be present, must be strings, and must not be
  empty after trimming — `"   "` is rejected.
- `:id` is converted with `Number()` and must be a positive integer.
- A malformed id returns **400**; a well-formed id that matches no user
  returns **404**.

## ID generation

IDs come from a counter that only increases. It is deliberately **not**
derived from `users.length`, because deleting a user would otherwise let
the next created user reuse an existing ID.

Verified: create 3 users, delete user 1, create another — the new user
receives id 3, not id 1.

## Testing

All five operations were tested in Postman, including invalid input and
unknown IDs.
