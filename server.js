const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const filePath = './donors.json';

// Initialize donors file if it doesn't exist
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, JSON.stringify([]));
}

// Register donor
app.post('/register', (req, res) => {
  const newDonor = req.body;
  const donors = JSON.parse(fs.readFileSync(filePath));
  donors.push(newDonor);
  fs.writeFileSync(filePath, JSON.stringify(donors));
  res.json({ message: 'Donor registered successfully' });
});

// Search donors
app.get('/search', (req, res) => {
  const { blood_group, location } = req.query;
  const donors = JSON.parse(fs.readFileSync(filePath));

  const result = donors.filter(d =>
    d.blood_group === blood_group &&
    (!location || d.location.toLowerCase().includes(location.toLowerCase()))
  );

  res.json(result);
});

// Show all donors
app.get('/all', (req, res) => {
  const donors = JSON.parse(fs.readFileSync(filePath));
  res.json(donors);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
