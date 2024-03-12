document.addEventListener('DOMContentLoaded', function () {
    // Replace 'YOUR_NEWS_API_KEY' with the actual API key
    const newsApiKey = 'e24d599fb5d739efd4f8a45a0bc438e7';
    const newsApiUrl = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${newsApiKey}`;

    // Fetch news data
    fetch(newsApiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Process and display news content
            const newsContainer = document.getElementById('news-container');

            if (data.articles) {
                data.articles.forEach(article => {
                    const articleElement = document.createElement('div');
                    articleElement.innerHTML = `
                        <h3>${article.title}</h3>
                        <p>${article.description}</p>
                        <a href="${article.url}" target="_blank">Read more</a>
                        <hr>
                    `;
                    newsContainer.appendChild(articleElement);
                });
            } else {
                console.error('News API response does not contain articles.');
            }
        })
        .catch(error => console.error('Error fetching news data:', error));
});
