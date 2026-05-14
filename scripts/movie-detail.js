const apiUrl = 'http://localhost:5025/Movies';

async function loadMovieDetail() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) {
        window.location.href = 'index.html';
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/GetById?id=${id}`);
        const movie = await response.json();

        document.title = movie.title;

        document.getElementById('movieDetail').innerHTML = `
            <img src="${movie.posterUrl}" alt="${movie.title}" onerror="this.src='https://placehold.co/250x370?text=No+Poster'">
            <div class="detail-info">
                <h2>${movie.title}</h2>
                <p class="detail-rating">⭐ ${movie.rating} / 10</p>
                <p><span>Genre:</span> ${movie.genre}</p>
                <p><span>Director:</span> ${movie.director}</p>
                <p><span>Year:</span> ${movie.year}</p>
                <p><span>Duration:</span> ${movie.duration} minutes</p>
                <div class="detail-actions">
                    <a href="edit-movie.html?id=${movie.id}" class="detail-edit">✏️ Edit</a>
                    <button class="detail-delete" onclick="deleteMovie(${movie.id})">🗑️ Delete</button>
                </div>
            </div>
        `;
    } catch (error) {
        alert('Could not load movie details!');
    }
}

async function deleteMovie(id) {
    if (!confirm('Are you sure you want to delete this movie?')) return;

    await fetch(`${apiUrl}/Delete?id=${id}`, { method: 'DELETE' });
    window.location.href = 'index.html';
}

loadMovieDetail();