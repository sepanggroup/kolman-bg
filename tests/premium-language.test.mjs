import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

const index = read('index.html');
const app = read('app-v2.js');
const runtimeFixes = read('runtime-fixes.js');
const i18n = read('i18n.js');
const productDescriptionsEn = read('product-descriptions-en.js');
const premiumVisuals = read('premium-visuals.css');
const logo = read('kolman-logo.svg');
const packageJson = JSON.parse(read('package.json'));

assert.match(index, /data-lang-switcher/);
assert.match(index, /data-lang="bg"/);
assert.match(index, /data-lang="en"/);
assert.match(index, /i18n\.js/);
assert.match(index, /premium-visuals\.css/);
assert.match(index, /runtime-fixes\.js\?v=20260830-1930/);

assert.match(i18n, /SUPPORTED_LANGUAGES/);
assert.match(i18n, /bg:/);
assert.match(i18n, /en:/);
assert.match(i18n, /localStorage/);
assert.match(i18n, /export function setLanguage/);
assert.match(i18n, /URLSearchParams/);
assert.match(i18n, /searchParams\.set\('lang', lang\)/);
assert.match(i18n, /wagner-language-changed/);
assert.match(i18n, /document\.documentElement\.lang/);
assert.match(i18n, /data-i18n/);
assert.match(i18n, /data-i18n-placeholder/);
assert.match(i18n, /data-i18n-aria/);

assert.match(app, /applyLanguage/);
assert.match(app, /wagner-language-changed/);
assert.match(app, /t\('product\.buy'\)/);
assert.match(app, /t\('product\.inquiry'\)/);
assert.match(app, /getLanguage/);
assert.match(app, /PRODUCT_DESCRIPTIONS_EN/);
assert.match(app, /product\.blurbEn/);
assert.match(app, /product\.longDescriptionEn/);
assert.match(app, /handleProductGridClick/);
assert.match(app, /productGrid\?\.addEventListener/);
assert.match(app, /addToCart\(id\)/);

assert.match(runtimeFixes, /product-descriptions-en\.js\?v=20260830-1930/);
assert.match(runtimeFixes, /syncEnglishCopy/);
assert.match(runtimeFixes, /bindReliableBuyButtons/);
assert.match(runtimeFixes, /addToCart\(id\)/);
assert.match(runtimeFixes, /stopImmediatePropagation/);
assert.match(runtimeFixes, /wagner-language-changed/);

assert.match(productDescriptionsEn, /export const PRODUCT_DESCRIPTIONS_EN/);
assert.match(productDescriptionsEn, /prospray-320-hea/);
assert.match(productDescriptionsEn, /partner-p900/);
assert.match(productDescriptionsEn, /heavycoat-750g-spraypack/);
assert.match(productDescriptionsEn, /bisonte-paz-7000-2/);
assert.match(productDescriptionsEn, /bright-dream-r19/);
assert.match(productDescriptionsEn, /'partner-p900':\s*\{[\s\S]*?longDescriptionEn:\s*'Partner Robotics P900 is an autonomous robot/);
assert.match(productDescriptionsEn, /'bright-dream-r19':\s*\{[\s\S]*?longDescriptionEn:\s*'Bright Dream Robotics R-19 is a concept/);

assert.match(index, /app-v2\.js\?v=/);
assert.match(index, /i18n\.js\?v=20260830-1930/);

assert.match(premiumVisuals, /premium-product-card/);
assert.match(premiumVisuals, /product-art/);
assert.match(premiumVisuals, /kolman-logo\.svg/);
assert.match(premiumVisuals, /\.visual-stamp/);
assert.match(logo, /WAGNER-BG/);
assert.match(logo, /KOLMAN EOOD/);
assert.match(logo, /СТРОИТЕЛНА И БОЯДЖИЙСКА ТЕХНИКА/);

assert.equal(packageJson.scripts.test, 'node tests/source-integrity.test.mjs && node tests/catalog-quality.test.mjs && node tests/premium-language.test.mjs && node tests/payment-summary.test.mjs');

console.log('WAGNER premium visual and language contract passed');
