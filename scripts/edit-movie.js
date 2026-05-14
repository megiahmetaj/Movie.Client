const apiUrl = 'http://localhost:5025/Movies';

async function loadMovie() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) {
        alert('No movie ID found!');
        window.location.href = 'index.html';
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/GetById?id=${id}`);
        const movie = await response.json();

        document.getElementById('title').value = movie.title;
        document.getElementById('genre').value = movie.genre;
        document.getElementById('director').value = movie.director;
        document.getElementById('year').value = movie.year;
        document.getElementById('rating').value = movie.rating;
        document.getElementById('duration').value = movie.duration;
        document.getElementById('posterUrl').value = movie.posterUrl;

    } catch (error) {
        alert('Could not load movie. Make sure the API is running!');
    }
}

async function updateMovie() {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'));

    const movie = {
        id: id,
        title: document.getElementById('title').value,
        genre: document.getElementById('genre').value,
        director: document.getElementById('director').value,
        year: parseInt(document.getElementById('year').value),
        rating: parseFloat(document.getElementById('rating').value),
        duration: parseInt(document.getElementById('duration').value),
        posterUrl: document.getElementById('posterUrl').value
    };

    if (!movie.title || !movie.genre || !movie.director || !movie.year) {
        alert('Please fill in all fields!');
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/Update`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(movie)
        });

        if (response.ok) {
            alert('Movie updated successfully!');
            window.location.href = 'index.html';
        } else {
            alert('Something went wrong. Please try again!');
        }
    } catch (error) {
        alert('Could not connect to the API. Make sure it is running!');
    }
}

loadMovie();