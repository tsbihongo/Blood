const supabase = require('../lib/supabase');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Only POST allowed');
  }

  const { name, contact, location, blood_group } = req.body;

  const { data, error } = await supabase
    .from('donors')
    .insert([{ name, contact, location, blood_group }]);

  if (error) return res.status(500).json({ error: error.message });

  res.status(200).json({ message: 'Donor registered successfully' });
};
