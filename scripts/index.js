const apiUrl = 'http://localhost:5025/Movies';

async function loadMovies() {
    try {
        const response = await fetch(`${apiUrl}/GetAll`);
        const movies = await response.json();
        displayMovies(movies);
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
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.innerHTML = `
            <img src="${movie.posterUrl}" alt="${movie.title}" onerror="this.src='https://placehold.co/200x300?text=No+Poster'">
            <div class="info">
                <h3>${movie.title}</h3>
                <p>${movie.director} • ${movie.year}</p>
                <p>${movie.genre} • ${movie.duration} min</p>
                <p class="rating"> ${movie.rating}</p>
            </div>
            <div class="actions">
                <a href="edit-movie.html?id=${movie.id}" class="edit-btn"> Edit</a>
                <button class="delete-btn" onclick="deleteMovie(${movie.id})"> Delete</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

async function deleteMovie(id) {
    if (!confirm('Are you sure you want to delete this movie?')) return;

    await fetch(`${apiUrl}/Delete?id=${id}`, {
        method: 'DELETE'
    });

    loadMovies();
}

loadMovies();