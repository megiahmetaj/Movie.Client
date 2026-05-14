const apiUrl = 'http://localhost:5025/Movies';

async function addMovie() {
    const movie = {
        id: 0,
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
        const response = await fetch(`${apiUrl}/AddNew`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(movie)
        });

        if (response.ok) {
            alert('Movie added successfully!');
            window.location.href = 'index.html';
        } else {
            alert('Something went wrong. Please try again!');
        }
    } catch (error) {
        alert('Could not connect to the API. Make sure it is running!');
    }
}