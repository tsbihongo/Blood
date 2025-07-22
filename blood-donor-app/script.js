const apiUrl = '/api';

async function register() {
  const data = {
    name: document.getElementById('name').value,
    contact: document.getElementById('contact').value,
    location: document.getElementById('location').value,
    blood_group: document.getElementById('blood_group').value
  };

  await fetch(`${apiUrl}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  alert('Registered!');
}

async function search() {
  const bg = document.getElementById('search_bg').value;
  const loc = document.getElementById('search_loc').value;
  const res = await fetch(`${apiUrl}/search?blood_group=${bg}&location=${loc}`);
  const data = await res.json();
  display(data);
}

async function showAll() {
  const res = await fetch(`${apiUrl}/all`);
  const data = await res.json();
  display(data);
}

function display(data) {
  const results = document.getElementById('results');
  results.innerHTML = data.map(d => `<p>${d.name}, ${d.blood_group}, ${d.location}, ${d.contact}</p>`).join('');
}
