import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const outDir = path.join(root, 'wp-content/plugins/koops-core/assets/previews');
const base = process.env.KOOPS_PREVIEW_BASE || 'https://ukmerges-koops-website.vercel.app';

const pages = {
  '/': ['home-hero', 'home-bento', 'home-stores', 'home-news', 'home-restaurant', 'home-jobs', 'home-values', 'home-suppliers', 'footer-cta'],
  '/parduotuves': ['stores-directory', 'stores-faq'],
  '/naujienos': ['news-listing'],
  '/skelbimai': ['classifieds-listing'],
  '/restoranas': ['restaurant-hero', 'restaurant-features', 'restaurant-halls', 'restaurant-enquiry'],
  '/karjera': ['careers-hero', 'careers-features', 'careers-jobs', 'careers-enquiry'],
  '/tiekejams': ['suppliers-hero', 'suppliers-looking', 'suppliers-process', 'suppliers-enquiry'],
  '/apie': ['about-hero', 'about-story', 'about-pillars', 'about-bento'],
  '/kontaktai': ['contact-form', 'contact-channels'],
};

fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});

for (const [route, types] of Object.entries(pages)) {
  await page.goto(base + route, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(800);

  for (const type of types) {
    const locator = page.locator(`[data-cms-section="${type}"]:not(.tt-hero-spacer)`).first();
    if (!(await locator.count())) {
      console.warn('nerasta', type, 'puslapyje', route);
      continue;
    }
    await locator.scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);
    const box = await locator.boundingBox();
    if (!box || box.width < 40 || box.height < 40) {
      console.warn('per maža', type);
      continue;
    }
    const height = Math.min(box.height, Math.max(360, box.width * 0.52));
    const file = path.join(outDir, `${type}.jpg`);
    await page.screenshot({
      path: file,
      type: 'jpeg',
      quality: 72,
      clip: {
        x: Math.max(0, box.x),
        y: Math.max(0, box.y),
        width: Math.min(box.width, 1440),
        height,
      },
    });
    console.log('ok', type, Math.round(box.width) + 'x' + Math.round(height));
  }
}

await browser.close();
console.log('Previews:', fs.readdirSync(outDir).length);
