const http = require('http');
const fs = require('fs').promises;
const url = require('url');

// Use environment port provided by Heroku or default to 3000
const port = process.env.PORT || 2000;

// Function to serve static files using async/await
const serveStaticFile = async (res, filePath, contentType) => {
    try {
        const data = await fs.readFile(filePath);
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    } catch (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
};

// Create HTTP server with async/await handling
const server = http.createServer(async (req, res) => {
    try {
        if (req.url === '/') {
            await serveStaticFile(res, './public/index.html', 'text/html');
        } else if (req.url === '/script.js') {
            await serveStaticFile(res, './public/script.js', 'application/javascript');
        } else if (req.url === '/style.css') {
            await serveStaticFile(res, './public/style.css', 'text/css');
        } else if (req.url.startsWith('/questions')) {
            // Parse URL to extract category query parameter
            const query = url.parse(req.url, true).query;
            const category = query.category;

            if (category) {
                try {
                    const data = await fs.readFile('./data/questions.json');
                    const questions = JSON.parse(data);

                    // Check if the category exists in the data
                    if (questions[category]) {
                        const categoryQuestions = questions[category];
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(categoryQuestions));
                    } else {
                        res.writeHead(404, { 'Content-Type': 'text/plain' });
                        res.end('Category not found.');
                    }
                } catch (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Error loading questions.');
                }
            } else {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('Category not specified.');
            }
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
        }
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
    }
});

// Start the server
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
