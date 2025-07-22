const apiUrl = '/api';
//kisui na
async function register(event) {
  if (event) event.preventDefault();
  const data = {
    name: document.getElementById('name').value,
    contact: document.getElementById('contact').value,
    location: document.getElementById('location').value,
    blood_group: document.getElementById('blood_group').value
  };

  const feedback = document.getElementById('register-feedback');
  const registerBtn = document.getElementById('registerBtn');
  feedback.innerText = 'Submitting...';
  feedback.style.color = 'gray';
  registerBtn.disabled = true;

  try {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || 'Registration failed');
    }

    feedback.innerText = result.message || '✅ Donor registered successfully!';
    feedback.style.color = 'green';

    // Optional: Clear the form
    document.getElementById('name').value = '';
    document.getElementById('contact').value = '';
    document.getElementById('location').value = '';
    document.getElementById('blood_group').value = '';

    // Fade out the success message after 2.5 seconds
    setTimeout(() => {
      if (feedback.innerText === (result.message || '✅ Donor registered successfully!')) {
        feedback.innerText = '';
      }
    }, 2500);

  } catch (err) {
    feedback.innerText = '❌ ' + err.message;
    feedback.style.color = 'red';
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
    // Fetch all donors, filter on frontend for flexible matching
    const res = await fetch(`${apiUrl}/all`);
    if (!res.ok) throw new Error('Search failed');
    let data = await res.json();
    // Filter by blood group
    if (bg.endsWith('+') || bg.endsWith('-')) {
      // Exact match
      data = data.filter(d => (d.blood_group || '').toUpperCase() === bg);
    } else {
      // Match all blood groups starting with the letter (e.g., O => O+, O-)
      data = data.filter(d => (d.blood_group || '').toUpperCase().startsWith(bg));
    }
    // Filter by location if provided
    if (loc) {
      data = data.filter(d => (d.location || '').toLowerCase().includes(loc.toLowerCase()));
    }
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
