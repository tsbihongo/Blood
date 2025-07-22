const supabase = require('../lib/supabase');

module.exports = async (req, res) => {
  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Only POST requests allowed' });
    }

    // Destructure incoming data
    const { name, contact, location, blood_group } = req.body;

    // Validate required fields
    if (!name || !contact || !blood_group) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from('donors')
      .insert([{ name, contact, location, blood_group }]);

    // Handle Supabase error
    if (error) {
      console.error('❌ Supabase Insert Error:', error.message);
      return res.status(500).json({ error: 'Failed to register donor' });
    }

    // Success
    return res.status(200).json({ message: 'Donor registered successfully', donor: data[0] });

  } catch (err) {
    // Handle unexpected errors
    console.error('🔥 Internal Server Error:', err.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
