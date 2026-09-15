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
  'archive-koops_flyer.php', 'single-koops_flyer.php',
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
const picker = fs.readFileSync(path.join(plugin, 'assets/admin-link-picker.js'), 'utf8');
if (!picker.includes('wpLink.open')) throw new Error('Nuorodų parinkiklis turi naudoti native wpLink');
const editor = fs.readFileSync(path.join(plugin, 'blocks/editor.js'), 'utf8');
const editorCss = fs.readFileSync(path.join(plugin, 'blocks/editor.css'), 'utf8');
if (!editor.includes('koopsOpenWpLink')) throw new Error('Gutenberg nuorodos laukas turi atidaryti native wpLink');
if (editor.includes('__experimentalLinkControl')) throw new Error('Nebenaudoti experimental LinkControl nuorodoms');
if (!editor.includes('function KoopsMediaControl')) throw new Error('Nuotraukų laukas turi būti native KoopsMediaControl');
if (!editor.includes('MediaUpload')) throw new Error('Nuotraukos turi būti keičiamos per native wp.media / MediaUpload');
if (!editor.includes('wp.media.gallery.edit')) throw new Error('Galerijos turi atidaryti native WordPress gallery-edit langą');
if ((editor.match(/title: 'Sekcija'/g) || []).length !== 1) throw new Error('Sekcijos laukai turi būti viename skydelyje');
if (editor.includes("title: 'Turinys'")) throw new Error('Nebenaudoti atskiro Turinys skydelio');
if (editor.includes('koops-live-sidebar')) throw new Error('Nebenaudoti antro live sidebar laukų rinkinio');
if (editor.includes('koops-selected-section-inspector')) throw new Error('Nebenaudoti antro Gutenberg inspector plugin');
const pluginPhp = fs.readFileSync(path.join(plugin, 'koops-core.php'), 'utf8');
if (!pluginPhp.includes('_WP_Editors::wp_link_dialog')) throw new Error('Admin turi įkelti native wpLink dialogą');
if (!pluginPhp.includes("unset($options['form_recipient'], $options['frontend_url'])")) {
  throw new Error('Viešas REST neturi grąžinti form_recipient ir frontend_url');
}
const modular = fs.readFileSync(path.join(plugin, 'includes/modular-pages.php'), 'utf8');
if (!modular.includes("'galleryUrls'") && !modular.includes('galleryUrls')) throw new Error('REST ir sekcijos turi saugoti galleryUrls');
if (!modular.includes('koops_section_item_schemas') || !modular.includes("'items'")) throw new Error('Sekcijos turi palaikyti items sąrašus');
if (!editor.includes('KoopsItemsControl') || !editor.includes('itemSchemas')) throw new Error('Gutenberg turi items redaktorių');
if (!modular.includes("'media' =>") && !modular.includes("['media']")) throw new Error('Katalogas turi nurodyti, kuriose sekcijose yra nuotraukos');
if (!modular.includes('function koops_default_section_anchor')) throw new Error('Kiekviena sekcija turi turėti numatytąjį HTML ID');
if (!modular.includes("'anchor'")) throw new Error('REST ir sekcijos turi saugoti anchor');
if (!editor.includes("label: 'Sekcijos ID'")) throw new Error('Gutenberg turi turėti Sekcijos ID lauką');
if (!pluginPhp.includes("'info' => 'Sekcija'")) throw new Error('wpLink paieška turi rodyti sekcijų inkarus');
const entrySidebar = fs.readFileSync(path.join(plugin, 'assets/entry-sidebar.js'), 'utf8');
if (!pluginPhp.includes('koops-entry-sidebar')) throw new Error('Parduotuvių laukai turi būti Gutenberg sidebar skydelyje');
if (!pluginPhp.includes("'__back_compat_meta_box' => true")) throw new Error('Senas KOOPS metabox Gutenberg drobėje neturi dubliuotis');
if (!entrySidebar.includes('PluginDocumentSettingPanel')) throw new Error('Įrašų laukai turi būti Document sidebar skydelyje');
if (!entrySidebar.includes('featured_media')) throw new Error('Nuotrauka turi būti tame pačiame sidebar skydelyje');
if (!entrySidebar.includes('koops_store_area')) throw new Error('Teritorija turi būti tame pačiame sidebar skydelyje');
if (!entrySidebar.includes("title: titles[postType]")) throw new Error('Sidebar skydelis turi turėti įrašo tipo pavadinimą');
if (!entrySidebar.includes('function previewLinkLabel')) throw new Error('Ilgos nuorodos sidebar turi būti sutrumpintos');
const entryCss = fs.readFileSync(path.join(plugin, 'assets/entry-sidebar.css'), 'utf8');
if (!entryCss.includes('unicode-range: U+0000-00FF')) throw new Error('Admin Inter turi turėti bazinį lotynų / tarpo glifą');
if (!entrySidebar.includes('function wrapField')) throw new Error('Kiekvienas sidebar laukas turi turėti atskirą tarpą');
if (!entrySidebar.includes('koops-entry-field')) throw new Error('Sidebar laukai turi būti atskirti koops-entry-field');
if (!pluginPhp.includes('koops-editor-chrome-font-fix')) throw new Error('Gutenberg sidebar turi priverstinai naudoti sisteminį šriftą');
if (!pluginPhp.includes('koops-admin-colors')) throw new Error('Admin turi krauti KOOPS akcento spalvas');
const adminColors = fs.readFileSync(path.join(plugin, 'assets/admin-colors.css'), 'utf8');
if (!adminColors.includes('--wp-admin-theme-color: #15190d')) throw new Error('Admin akcentas turi būti KOOPS samanų žalia, ne WP mėlyna');
if (!adminColors.includes('#f6d987')) throw new Error('Admin primary mygtukai turi naudoti KOOPS medaus geltoną');
if (!editor.includes('function previewLinkLabel')) throw new Error('Ilgos nuorodos Gutenberg turi būti sutrumpintos');
if (!editor.includes('registerBlockVariation')) throw new Error('Gutenberg inserteryje turi būti atskiros KOOPS sekcijos');
if (!editor.includes('sectionPreviewSrc')) throw new Error('Sekcijų inserteris turi rodyti screenshotus');
if (!editor.includes('isPreview')) throw new Error('Inserterio hover peržiūra turi rodyti sekcijos screenshotą');
if (!editor.includes("'svg'")) throw new Error('Sekcijų ikonos turi būti SVG su screenshotu');
if (!modular.includes("'example'")) throw new Error('PHP variations turi turėti Gutenberg example peržiūrai');
if (!modular.includes('koops_section_inserter_preview_css')) throw new Error('Inserterio kortelės turi turėti screenshotų CSS');
if (!editor.includes('enhanceInserterPreviews')) throw new Error('Inserteris turi įterpti sekcijų screenshotus į korteles');
if (!editor.includes('getBlockMenuDefaultClassName')) throw new Error('Inserterio klasės turi veikti su visomis sekcijomis');
if (!editor.includes('blocks.getBlockVariations')) throw new Error('Inserteris turi slėpti jau įdėtas sekcijas');
if (editor.includes('item.page === slug || item.page === \'global\'')) throw new Error('Inserteris nebeturi riboti sekcijų pagal puslapį');
if (!editor.includes('sync-sections')) throw new Error('Nauja sekcija turi iškart atsirasti gyvoje peržiūroje');
if (!editor.includes('dedupeSectionBlocks')) throw new Error('Ta pati sekcija neturi dubliuotis inserteryje');
if (!editor.includes('sectionTypeOptions')) throw new Error('Sekcijos tipo sąrašas turi rodyti visas svetainės sekcijas');
if (!editor.includes('syncPreviewSections(\'\', true)')) throw new Error('Gyva peržiūra turi sinchronizuoti sekcijas kai iframe pasiruošusi');
if (!modular.includes('pageSlug')) throw new Error('Gutenberg turi žinoti redaguojamo puslapio slug');
if (!modular.includes('koops-section/')) throw new Error('Inserterio CSS turi palaikyti Gutenberg klases su slash');
const blockJson = JSON.parse(fs.readFileSync(path.join(plugin, 'blocks/block.json'), 'utf8'));
if (blockJson.supports?.inserter === false) throw new Error('KOOPS sekcijų variations turi būti matomos inserteryje');
if (!modular.includes('koops_section_block_variations')) throw new Error('Sekcijos turi būti registruotos kaip Gutenberg variations');
if (!editorCss.includes('editor-block-list-item-koops-section')) throw new Error('Bendras KOOPS blokas inserteryje turi būti paslėptas');
if (!modular.includes("'previewBase'")) throw new Error('Sekcijų screenshotai turi turėti previewBase');
const previewDir = path.join(plugin, 'assets/previews');
const catalogTypes = [...modular.matchAll(/'([a-z0-9-]+)' => \['page' =>/g)].map((m) => m[1]);
if (catalogTypes.length < 20) throw new Error('Nepavyko nuskaityti sekcijų katalogo patikrai');
for (const type of catalogTypes) {
  if (!fs.existsSync(path.join(previewDir, `${type}.jpg`))) {
    throw new Error(`Trūksta sekcijos screenshot: ${type}.jpg`);
  }
}

const combined = sourceFiles.map((file) => fs.readFileSync(file, 'utf8')).join('\n');
if (combined.includes('local-produce-shopper')) throw new Error('Panaudota aiškiai uždrausta nuotrauka');

console.log(`Patikra sėkminga: 34 parduotuvės, ${requiredFiles.length} temos failų, uždrausta nuotrauka nenaudojama.`);

