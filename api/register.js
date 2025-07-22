module.exports = (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' });
  }
  // Always return success for testing
  return res.status(200).json({ message: 'Donor registered successfully (test mode)' });
};
