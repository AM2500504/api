// server.js
// Creates the Express app, loads middleware, and mounts the router.
// It does NOT start listening - that is index.js's job.

const express = require('express');
const userRouter = require('./routes/userRouter');

const app = express();

// MIDDLEWARE: runs on every request before it reaches a route.
// express.json() reads the raw JSON body and turns it into req.body.
// Without this line, req.body would be undefined on POST and PUT.
app.use(express.json());

// Mount the user router. Every route inside it is prefixed with this path.
app.use('/api/v1/users', userRouter);

// 404 handler for any path that matched no route above.
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = app;
