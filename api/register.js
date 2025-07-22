const supabase = require('../lib/supabase');

module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).send('Only POST allowed');
    }

    const { name, contact, location, blood_group } = req.body;

    // Validate input
    if (!name || !contact || !blood_group) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data, error } = await supabase
      .from('donors')
      .insert([{ name, contact, location, blood_group }]);

    if (error) {
      console.error('❌ Supabase Insert Error:', error.message);
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ message: 'Donor registered successfully' });
  } catch (err) {
    console.error('❌ Internal Server Error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};
