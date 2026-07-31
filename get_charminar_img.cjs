const https = require('https');

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'CoolBot/1.0 (aj1912208@gmail.com)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

async function getImageUrl(filename) {
  try {
    let json = await fetchJson(`https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(filename)}&prop=imageinfo&iiprop=url&format=json`);
    let pages = json.query.pages;
    let pageId = Object.keys(pages)[0];
    if (pages[pageId].imageinfo) {
      console.log(`${filename}: ${pages[pageId].imageinfo[0].url}`);
    } else {
      console.log(`${filename}: Not found`);
    }
  } catch(e) {
    console.error(e.message);
  }
}

async function run() {
  await getImageUrl("Charminar Hyderabad 1.jpg");
  await getImageUrl("Charminar-Pride of Hyderabad.jpg");
  await getImageUrl("Charminar in Hyderabad.jpg");
  await getImageUrl("Charminar.jpg");
}
run();
