document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const formData = new FormData(this);
    const searchParams = new URLSearchParams(formData).toString();
  
    fetch('/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: searchParams
    })
    .then(response => response.json())
    .then(data => {
      const resultsContainer = document.getElementById('searchResults');
      resultsContainer.innerHTML = '';
  
      if (data.length === 0) {
        resultsContainer.innerHTML = '<p>No results found.</p>';
      } else {
        data.forEach(logEntry => {
          const logDiv = document.createElement('div');
          logDiv.innerHTML = `
            <p><strong>Level:</strong> ${logEntry.level}</p>
            <p><strong>Log String:</strong> ${logEntry.log_string}</p>
            <p><strong>Timestamp:</strong> ${logEntry.timestamp}</p>
            <p><strong>Source:</strong> ${logEntry.metadata.source}</p>
            <hr>
          `;
          resultsContainer.appendChild(logDiv);
        });
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  });
  