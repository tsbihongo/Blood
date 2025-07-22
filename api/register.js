const supabase = require('../lib/supabase');

module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Only POST requests allowed' });
    }

    const { name, contact, location, blood_group } = req.body;

    if (!name || !contact || !blood_group) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { error } = await supabase
      .from('donors')
      .insert([{ name, contact, location, blood_group }]);

    if (error) {
      console.error('❌ Supabase Insert Error:', error.message);
      return res.status(500).json({ error: 'Failed to register donor' });
    }

    // ✅ Success response — no more risky data[0]
    return res.status(200).json({ message: 'Donor registered successfully' });

  } catch (err) {
    console.error('🔥 Internal Server Error:', err.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
