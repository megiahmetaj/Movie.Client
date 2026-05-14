const apiUrl = 'http://localhost:5025/Movies';
let allMovies = [];

async function loadMovies() {
    try {
        const response = await fetch(`${apiUrl}/GetAll`);
        allMovies = await response.json();
        displayMovies(allMovies);
        buildGenreFilter(allMovies);
    } catch (error) {
        document.getElementById('moviesGrid').innerHTML = '<p class="no-movies">Could not load movies. Make sure the API is running!</p>';
    }
}

function displayMovies(movies) {
    const grid = document.getElementById('moviesGrid');

    if (movies.length === 0) {
        grid.innerHTML = '<p class="no-movies">No movies found. Add some!</p>';
        return;
    }

    grid.innerHTML = '';

    movies.forEach(movie => {
        const isFav = isFavorite(movie.id);
        const card = document.createElement('div');
        card.className = `movie-card ${isFav ? 'favorited' : ''}`;
        card.setAttribute('data-id', movie.id);
        card.innerHTML = `
            <img src="${movie.posterUrl}" alt="${movie.title}" onerror="this.src='https://placehold.co/200x300?text=No+Poster'">
            <div class="info">
                <h3><a href="movie-detail.html?id=${movie.id}" style="color: white; text-decoration: none;">${movie.title}</a></h3>
                <p>${movie.director} • ${movie.year}</p>
                <p>${movie.genre} • ${movie.duration} min</p>
                <p class="rating">⭐ ${movie.rating}</p>
            </div>
            <div class="actions">
                <a href="edit-movie.html?id=${movie.id}" class="edit-btn">✏️ Edit</a>
                <button class="fav-btn" onclick="toggleFavorite(${movie.id})">${isFav ? '❤️' : '🤍'}</button>
                <button class="delete-btn" onclick="deleteMovie(${movie.id})">🗑️ Delete</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function buildGenreFilter(movies) {
    const genres = [...new Set(movies.map(m => m.genre))].sort();
    const genreFilter = document.getElementById('genreFilter');
    genreFilter.innerHTML = `<option value="all">🎬 All Genres</option>`;
    genres.forEach(genre => {
        genreFilter.innerHTML += `<option value="${genre}">${genre}</option>`;
    });
}

function filterByGenre(genre) {
    if (genre === 'all') {
        displayMovies(allMovies);
    } else {
        const filtered = allMovies.filter(m => m.genre === genre);
        displayMovies(filtered);
    }
}

function isFavorite(id) {
    const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
    return favs.includes(id);
}

function toggleFavorite(id) {
    let favs = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (favs.includes(id)) {
        favs = favs.filter(f => f !== id);
    } else {
        favs.push(id);
    }
    localStorage.setItem('favorites', JSON.stringify(favs));
    displayMovies(allMovies);
}

function filterAll() {
    document.getElementById('btnAll').classList.add('active');
    document.getElementById('btnFav').classList.remove('active');
    displayMovies(allMovies);
}

function filterFavorites() {
    document.getElementById('btnFav').classList.add('active');
    document.getElementById('btnAll').classList.remove('active');
    const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
    const favoriteMovies = allMovies.filter(m => favs.includes(m.id));
    displayMovies(favoriteMovies);
}

function searchMovies() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const cards = document.querySelectorAll('.movie-card');
    cards.forEach(card => {
        const title = card.querySelector('.info h3').textContent.toLowerCase();
        card.style.display = title.includes(searchTerm) ? 'block' : 'none';
    });
}

function sortMovies() {
    const sortValue = document.getElementById('sortSelect').value;
    let sorted = [...allMovies];
    if (sortValue === 'rating') {
        sorted.sort((a, b) => b.rating - a.rating);
    } else if (sortValue === 'year') {
        sorted.sort((a, b) => b.year - a.year);
    } else if (sortValue === 'title') {
        sorted.sort((a, b) => a.title.localeCompare(b.title));
    }
    displayMovies(sorted);
}

async function deleteMovie(id) {
    if (!confirm('Are you sure you want to delete this movie?')) return;
    await fetch(`${apiUrl}/Delete?id=${id}`, { method: 'DELETE' });
    loadMovies();
}

loadMovies();