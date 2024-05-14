const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const readline = require('readline');
const loggingConfig = require('./config/loggingConfig');
const cors = require('cors'); // Import the cors middleware

const app = express();

app.use(cors()); // Enable CORS for all routes

app.use(express.static('public'));
app.use(bodyParser.json()); // Parse JSON request bodies

// Initialize API integrations
// For simplicity, assume only one API for demo purposes
const api1 = require('./src/api1');
api1.initialize();

// Serve the index.html file
// app.get('/', (req, res) => {
// res.sendFile(__dirname + '/public/index.html');
// });

app.get('/', (req, res) => {
    res.send('Hello, world!');
  });

// Handle search requests

app.post('/search', (req, res) => {
    const { level, log_string, timestamp, source, fromDate, toDate, useRegex } = req.body;
    const logFiles = Object.values(loggingConfig).map(config => config.filePath);

    let searchResults = [];
    const searchTerm = req.body.searchTerm;
    const regex = useRegex === 'true' ? new RegExp(searchTerm, 'i') : null;

    // Function to check if a log entry matches the filters
    const matchesFilters = (logEntry) => {
        return (!level || logEntry.level === level) &&
            (!log_string || logEntry.log_string.includes(log_string)) &&
            (!timestamp || (new Date(logEntry.timestamp) >= new Date(fromDate) && new Date(logEntry.timestamp) <= new Date(toDate))) &&
            (!source || logEntry.metadata.source === source);
    };

    // Read each log file and search for the term
    let filesProcessed = 0;
    logFiles.forEach(file => {
        const rl = readline.createInterface({
            input: fs.createReadStream(file),
            crlfDelay: Infinity
        });

        rl.on('line', line => {
            const logEntry = JSON.parse(line);
            const matchesSearchTerm = regex ? regex.test(logEntry.log_string) : logEntry.log_string.includes(searchTerm);

            if (matchesSearchTerm && matchesFilters(logEntry)) {
                searchResults.push(logEntry);
            }
        });

        rl.on('close', () => {
            filesProcessed++;

            // Send response only after all log files have been processed
            if (filesProcessed === logFiles.length) {
                res.json(searchResults);
            }
        });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Log Ingestor is running on port ${PORT}`);
});
