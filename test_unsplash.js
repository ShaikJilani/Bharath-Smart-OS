const https = require('https');

const ids = [
  // Education
  '1503676260728-1c00da094a0b',
  '1577896851231-70ef18881754',
  '1529390079861-591de354faf5',
  '1427504141085-b4f02ac4dfb6', // graduation
  '1513258496099-481a804423ea', // students
  // Agriculture
  '1595844730298-b960fa25fa48',
  '1624964648710-85f02bc0d405',
  '1586771107146-5d61f5f24f11',
  '1500382017468-9049fed747ef', // farm
  '1589939705384-5185137a7f0f', 
  // Health
  '1544367567-0f2fcb009e0b',
  '1584515933487-779824d29309',
  '1571019614242-c5c5dee9f50b',
  '1505576391880-b3f9d713dc4f',
  // Women
  '1534644107580-3a4dbd494a9f',
  '1629813589920-562a9c3bba3f',
  '1581452654388-7e3e26427329',
  '1590402236162-8178fddc8485',
  '1567184420063-cf94b0d06a09'
];

async function checkIds() {
  for (const id of ids) {
    await new Promise(r => {
      https.get(`https://images.unsplash.com/photo-${id}?q=80&w=600&auto=format&fit=crop`, (res) => {
        if (res.statusCode === 200) console.log(id);
        r();
      }).on('error', () => r());
    });
  }
}
checkIds();
