const mockCafes = [
  { name: "Bean There Cafe", place_id: "1", photo:"images/bean there.jpg", rating: 4.5 },
  { name: "Daily Grind", place_id: "2", photo: "images/daily.jpeg", rating: 4.2 },
  { name: "Latte Love", place_id: "3", photo: "images/latte.jpg", rating: 4.7 },
  { name: "Brew & Co.", place_id: "4", photo: "images/brew.webp", rating: 4.3 },
  { name: "Cuppa Joy", place_id: "5", photo: "images/joy.jpeg", rating: 4.6 }
];


function getLocation(force = false) {
  const cache = JSON.parse(localStorage.getItem('cachedLocation') || '{}');
  const now = Date.now();
  if (!force && cache.timestamp && now - cache.timestamp < 10 * 60 * 1000) {
    useLocation(cache.lat, cache.lng);
  } else {
    const lat = 40.7128;
    const lng = -74.0060;
    useLocation(lat, lng);
  }
}

function useLocation(lat, lng) {
  localStorage.setItem('cachedLocation', JSON.stringify({ lat, lng, timestamp: Date.now() }));
  displayCards(mockCafes);
}

function displayCards(cafes) {
  const container = document.querySelector('.cards');
  container.innerHTML = '';
  cafes.forEach((cafe) => {
    const card = document.createElement('div');
    card.className = 'location-card';
    card.innerHTML = `
      <img src="${cafe.photo}" alt="${cafe.name}" />
      <div class="meta">
        <h3>${cafe.name}</h3>
        <p>⭐️ Rating: ${cafe.rating}</p>
        <p><a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cafe.name)}" target="_blank">View on Map</a></p>
        <button class="save-btn">💖 Save</button>
      </div>
      <div class="heart">💖</div>
    `;
    container.appendChild(card);
    const saveBtn = card.querySelector('.save-btn');
    const heart = card.querySelector('.heart');
    saveBtn.addEventListener('click', () => {
      saveCafe(cafe);
      heart.classList.remove('show');
      void heart.offsetWidth;
      heart.classList.add('show');
    });
  });
}

function saveCafe(cafe) {
  let saved = JSON.parse(localStorage.getItem('savedCafes') || '[]');
  if (!saved.find(c => c.place_id === cafe.place_id)) {
    saved.push(cafe);
    localStorage.setItem('savedCafes', JSON.stringify(saved));
    alert(`${cafe.name} saved! 💖`);
  } else {
    alert(`${cafe.name} is already saved.`);
  }
}

function showSaved() {
  const container = document.querySelector('.cards');
  container.innerHTML = '';
  const saved = JSON.parse(localStorage.getItem('savedCafes') || '[]');
  if (saved.length === 0) {
    container.innerHTML = '<p>No saved cafes yet 😢</p>';
    return;
  }
  saved.forEach(cafe => {
    const card = document.createElement('div');
    card.className = 'location-card';
    card.innerHTML = `
      <img src="${cafe.photo}" alt="${cafe.name}" />
      <div class="meta">
        <h3>${cafe.name}</h3>
        <p>⭐️ Rating: ${cafe.rating}</p>
      </div>
    `;
    container.appendChild(card);
  });
}

function clearSaved() {
  if (confirm('Are you sure you want to clear all saved cafes?')) {
    localStorage.removeItem('savedCafes');
    showSaved();
  }
}

document.getElementById('refreshBtn').addEventListener('click', () => getLocation(true));
document.getElementById('showSavedBtn').addEventListener('click', showSaved);
document.getElementById('clearSavedBtn').addEventListener('click', clearSaved);

getLocation();


