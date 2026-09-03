import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const theme = path.join(root, 'wp-content/themes/koops');
const plugin = path.join(root, 'wp-content/plugins/koops-core');
const stores = JSON.parse(fs.readFileSync(path.join(plugin, 'data/stores.json'), 'utf8'));
const requiredStoreFields = ['slug', 'name', 'city', 'area', 'address', 'hours', 'phone', 'lat', 'lng', 'map_url'];

if (stores.length !== 34) throw new Error(`Parduotuvių turi būti 34, rasta ${stores.length}`);
if (new Set(stores.map(({ slug }) => slug)).size !== stores.length) throw new Error('Parduotuvių slug nėra unikalūs');
for (const store of stores) {
  for (const field of requiredStoreFields) {
    if (store[field] === '' || store[field] === null || store[field] === undefined) {
      throw new Error(`${store.slug}: trūksta lauko ${field}`);
    }
  }
  if (!['miestas', 'rajonas'].includes(store.area)) throw new Error(`${store.slug}: netinkama teritorija`);
  new URL(store.map_url);
}

const requiredFiles = [
  'style.css', 'theme.json', 'functions.php', 'header.php', 'footer.php', 'front-page.php',
  'archive-koops_store.php', 'single-koops_store.php', 'archive-koops_classified.php',
  'single-koops_classified.php', 'archive-koops_job.php', 'single-koops_job.php',
  'page-restoranas.php', 'page-tiekejams.php', 'page-kontaktai.php', 'page-apie.php',
  'assets/css/theme.css', 'assets/js/theme.js', 'assets/images/koops-logo.png',
];
for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(theme, file))) throw new Error(`Trūksta temos failo: ${file}`);
}

const sourceFiles = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(php|css|js|json|md)$/.test(entry.name)) sourceFiles.push(full);
  }
}
walk(root);
const combined = sourceFiles.map((file) => fs.readFileSync(file, 'utf8')).join('\n');
if (combined.includes('local-produce-shopper')) throw new Error('Panaudota aiškiai uždrausta nuotrauka');

console.log(`Patikra sėkminga: 34 parduotuvės, ${requiredFiles.length} temos failų, uždrausta nuotrauka nenaudojama.`);

