const apiUrl = '/api';

async function register(event) {
  event.preventDefault();
  const registerBtn = document.getElementById('registerBtn');
  const registerMsg = document.getElementById('registerMsg');
  registerMsg.textContent = '';
  registerBtn.disabled = true;

  const name = document.getElementById('name').value.trim();
  const contact = document.getElementById('contact').value.trim();
  const location = document.getElementById('location').value.trim();
  const blood_group = document.getElementById('blood_group').value.trim().toUpperCase();

  // Basic validation
  if (!name || !contact || !location || !blood_group) {
    registerMsg.textContent = 'All fields are required.';
    registerBtn.disabled = false;
    return;
  }
  if (!/^A|B|AB|O[+-]?$/.test(blood_group)) {
    registerMsg.textContent = 'Invalid blood group.';
    registerBtn.disabled = false;
    return;
  }

  try {
    const res = await fetch(`${apiUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, contact, location, blood_group })
    });
    if (!res.ok) throw new Error('Registration failed');
    registerMsg.textContent = 'Registered successfully!';
    document.getElementById('registerForm').reset();
  } catch (err) {
    registerMsg.textContent = 'Error: ' + err.message;
  } finally {
    registerBtn.disabled = false;
  }
}

async function search(event) {
  if (event) event.preventDefault();
  const searchBtn = document.getElementById('searchBtn');
  const searchMsg = document.getElementById('searchMsg');
  searchMsg.textContent = '';
  searchBtn.disabled = true;

  const bg = document.getElementById('search_bg').value.trim().toUpperCase();
  const loc = document.getElementById('search_loc').value.trim();
  if (!bg) {
    searchMsg.textContent = 'Blood group is required.';
    searchBtn.disabled = false;
    return;
  }
  try {
    const res = await fetch(`${apiUrl}/search?blood_group=${encodeURIComponent(bg)}&location=${encodeURIComponent(loc)}`);
    if (!res.ok) throw new Error('Search failed');
    const data = await res.json();
    display(data);
    if (data.length === 0) searchMsg.textContent = 'No donors found.';
  } catch (err) {
    searchMsg.textContent = 'Error: ' + err.message;
  } finally {
    searchBtn.disabled = false;
  }
}

async function showAll() {
  const searchMsg = document.getElementById('searchMsg');
  searchMsg.textContent = '';
  try {
    const res = await fetch(`${apiUrl}/all`);
    if (!res.ok) throw new Error('Failed to fetch donors');
    const data = await res.json();
    display(data);
    if (data.length === 0) searchMsg.textContent = 'No donors registered.';
  } catch (err) {
    searchMsg.textContent = 'Error: ' + err.message;
  }
}

function display(data) {
  const results = document.getElementById('results');
  if (!data || data.length === 0) {
    results.innerHTML = '';
    return;
  }
  results.innerHTML = `<table><thead><tr><th>Name</th><th>Blood Group</th><th>Location</th><th>Contact</th></tr></thead><tbody>` +
    data.map(d => `<tr><td>${escapeHTML(d.name)}</td><td>${escapeHTML(d.blood_group)}</td><td>${escapeHTML(d.location)}</td><td>${escapeHTML(d.contact)}</td></tr>`).join('') +
    '</tbody></table>';
}

function escapeHTML(str) {
  return String(str).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\'':'&#39;','"':'&quot;'}[c]));
}
