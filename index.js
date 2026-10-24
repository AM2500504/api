// index.js
// Entry point. Its only job is to start the server listening.

const app = require('./server');

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Users API running at http://localhost:${PORT}/api/v1/users`);
});
