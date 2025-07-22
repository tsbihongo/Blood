const supabase = require('../lib/supabase');

module.exports = async (req, res) => {
  const { blood_group, location } = req.query;

  let query = supabase.from('donors').select('*');

  if (blood_group) query = query.eq('blood_group', blood_group);
  if (location) query = query.ilike('location', `%${location}%`);

  const { data, error } = await query;

  if (error) return res.status(500).json({ error: error.message });

  res.status(200).json(data);
};
