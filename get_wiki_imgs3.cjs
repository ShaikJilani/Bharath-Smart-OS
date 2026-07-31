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

async function searchWiki(query) {
  try {
    let json = await fetchJson(`https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srnamespace=6&utf8=&format=json`);
    let results = json.query.search;
    for (let i = 0; i < Math.min(3, results.length); i++) {
      let title = results[i].title;
      let json2 = await fetchJson(`https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url&format=json`);
      let pages = json2.query.pages;
      let pageId = Object.keys(pages)[0];
      if (pages[pageId].imageinfo) {
        console.log(`${query} -> ${pages[pageId].imageinfo[0].url}`);
      }
    }
  } catch(e) {
    console.error(e.message);
  }
}

async function run() {
  await searchWiki("Indian rural school");
  await searchWiki("Indian hospital doctor");
  await searchWiki("Agriculture India field");
  await searchWiki("Women empowerment India");
}
run();
