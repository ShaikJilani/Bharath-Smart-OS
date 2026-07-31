const https = require('https');
const url = 'https://lite.duckduckgo.com/lite/';

function doSearch(query) {
  return new Promise((resolve) => {
    const data = new URLSearchParams();
    data.append('q', query);
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      }
    };
    
    const req = https.request(url, options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        const regex = /https:\/\/unsplash\.com\/photos\/([a-zA-Z0-9-]+)/g;
        let match;
        const results = new Set();
        while ((match = regex.exec(body)) !== null) {
          results.add(match[1]);
        }
        console.log(`\nResults for ${query}:`);
        console.log(Array.from(results).slice(0, 3));
        resolve();
      });
    });
    
    req.write(data.toString());
    req.end();
  });
}

async function run() {
  await doSearch('site:unsplash.com "indian students" OR "indian school"');
  await doSearch('site:unsplash.com "indian agriculture" OR "indian farmer"');
  await doSearch('site:unsplash.com "indian doctor" OR "indian hospital"');
  await doSearch('site:unsplash.com "indian women" empowerment');
}
run();
