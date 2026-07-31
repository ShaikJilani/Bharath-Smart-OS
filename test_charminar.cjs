const https = require('https');

function checkUrl(url, label) {
  https.get(url, (res) => {
    res.resume();
    console.log(`${label}: ${res.statusCode}`);
  }).on('error', (e) => {
    console.log(`${label}: Error - ${e.message}`);
  });
}

checkUrl('https://upload.wikimedia.org/wikipedia/commons/7/71/Charminar_Hyderabad_1.jpg', 'Charminar 1');
checkUrl('https://upload.wikimedia.org/wikipedia/commons/d/d1/Charminar-Pride_of_Hyderabad.jpg', 'Charminar 2');
checkUrl('https://upload.wikimedia.org/wikipedia/commons/b/bf/Charminar_in_Hyderabad.jpg', 'Charminar 3');
checkUrl('https://upload.wikimedia.org/wikipedia/commons/9/9c/Charminar.jpg', 'Charminar 4');
