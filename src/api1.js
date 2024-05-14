// src/api1.js
const fs = require('fs');
const loggingConfig = require('../config/loggingConfig');

function initialize() {
  // Code to initialize API integration
  
  // Example logging
  log('info', 'API 1 initialized');
}

function log(level, message) {
  const logConfig = loggingConfig.api1;
  if (logConfig.logLevels.includes(level)) {
    const logEntry = {
      level,
      log_string: message,
      timestamp: new Date().toISOString(),
      metadata: {
        source: 'api1'
      }
    };
    fs.appendFileSync(logConfig.filePath, JSON.stringify(logEntry) + '\n');
  }
}

module.exports = { initialize, log };
