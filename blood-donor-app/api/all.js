const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  const file = path.resolve(__dirname, '../donors.json');
  const donors = JSON.parse(fs.readFileSync(file));
  res.status(200).json(donors);
};
