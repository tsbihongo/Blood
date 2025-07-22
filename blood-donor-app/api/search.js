const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  const { blood_group, location } = req.query;
  const file = path.resolve(__dirname, '../donors.json');
  const donors = JSON.parse(fs.readFileSync(file));

  const result = donors.filter(d =>
    d.blood_group === blood_group &&
    (!location || d.location.toLowerCase().includes(location.toLowerCase()))
  );

  res.status(200).json(result);
};
