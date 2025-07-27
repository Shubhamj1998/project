const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());

app.get('/api', (req, res) => {
  res.json({ message: 'Hello from the bacakend!' });
});

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
