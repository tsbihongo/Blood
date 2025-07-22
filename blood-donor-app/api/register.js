const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Only POST allowed');
    return;
  }

  const file = path.resolve(__dirname, '../donors.json');
  const donors = JSON.parse(fs.readFileSync(file));
  donors.push(req.body);
  fs.writeFileSync(file, JSON.stringify(donors, null, 2));
  res.status(200).json({ message: 'Donor registered' });
};
