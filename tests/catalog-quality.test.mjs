import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const products = read('products.js');
const robots = read('robot-products.js');
const copy = read('product-copy.js');
const robotCopy = read('robot-copy.js');
const overrides = read('image-overrides.js');
const app = read('app-v2.js');
const index = read('index.html');

assert.doesNotMatch(index, /\+359 88 503 9931/);
assert.doesNotMatch(index, /\+359 88 579 66 13/);
assert.match(index, /data-i18n="hero\.title">Техниката, която<\/span>/);
assert.match(index, /data-i18n="hero\.titleAccent">работи за вас\.<\/em>/);
assert.match(app, /product\.buy/);
assert.match(app, /product\.inquiry/);
assert.match(app, /addToCart/);
assert.match(app, /cart-drawer/);
assert.match(app, /longDescription/);
assert.match(app, /ROBOT_COPY/);
assert.match(copy, /PRODUCT_COPY/);
assert.match(robotCopy, /ROBOT_COPY/);

const productImageUrls = [...products.matchAll(/imageUrl:\s*'([^']+)'/g)].map((m) => m[1]);
const overrideEntries = [...overrides.matchAll(/'([^']+)':\s*'([^']+)'/g)];
const overrideImageUrls = overrideEntries.map((m) => m[2]);
const copyDescriptions = [...copy.matchAll(/longDescription:\s*'([^']+)'/g)].map((m) => m[1]);
const robotDescriptions = [...robotCopy.matchAll(/longDescription:\s*'([^']+)'/g)].map((m) => m[1]);

assert.equal(new Set(productImageUrls).size, productImageUrls.length, 'Core source photography must be unique');
assert.equal(new Set(overrideImageUrls).size, overrideImageUrls.length, 'Dedicated photography overrides must be unique');
assert.ok(copyDescriptions.length >= 11, 'Core catalog must have detailed Bulgarian descriptions');
assert.ok(copyDescriptions.every((value) => value.length >= 180), 'Core descriptions must be detailed');
assert.ok(robotDescriptions.length >= 9, 'Robot catalog must have detailed Bulgarian descriptions');
assert.ok(robotDescriptions.every((value) => value.length >= 220), 'Robot descriptions must be detailed');
assert.ok(overrideImageUrls.length >= 20, 'Core and robot catalog must contain dedicated photography');
assert.match(overrides, /smartbuild-thinset-robot/);
assert.match(overrides, /derutu-tile-laying-robot/);
assert.match(overrides, /yanling-tile-robot/);
console.log('WAGNER catalog quality contract passed');
