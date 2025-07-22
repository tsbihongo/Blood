const supabase = require('../lib/supabase');

module.exports = async (req, res) => {
  const { data, error } = await supabase.from('donors').select('*');

  if (error) return res.status(500).json({ error: error.message });

  res.status(200).json(data);
};
