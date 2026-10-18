import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

const index = read('index.html');
const payment = read('payment.js');

assert.match(index, /id="paypal-payment-summary"/);
assert.match(index, /id="paypal-payment-items"/);
assert.match(index, /id="paypal-payment-total"/);
assert.match(payment, /paypal-payment-summary/);
assert.match(payment, /paypal-payment-items/);
assert.match(payment, /paypal-payment-total/);
assert.match(payment, /renderPaymentSummary/);
assert.match(payment, /cartSubtotal\(productById\)/);
assert.match(payment, /cartHasNonPurchasableItems\(productById\)/);
assert.match(payment, /payableCartState/);
assert.match(payment, /https:\/\/www\.paypal\.com\/paypalme\/1968428713/);
assert.match(payment, /\/\$\{amount\}EUR/);
assert.doesNotMatch(payment, /paypalme\/my\/grab/);
assert.doesNotMatch(payment, /ncp\/payment\/653GFDV8Z76G2/);
assert.match(payment, /fallback\.hidden = false/);
assert.match(payment, /paypal-static-paypal/);
assert.doesNotMatch(payment, /paypal-static-card/);
assert.match(payment, /type="button" disabled/);
assert.match(payment, /dataset\.payable/);
assert.match(payment, /container\.dataset\.paypalReady = 'false'/);
assert.match(payment, /Loading secure PayPal checkout/);

// Regression: a browser storage failure must not prevent a product from entering the cart.
globalThis.localStorage = {
  getItem() { throw new Error('storage unavailable'); },
  setItem() { throw new Error('storage unavailable'); },
  removeItem() { throw new Error('storage unavailable'); }
};
globalThis.window = { dispatchEvent() {} };
const cart = await import(`../cart.js?storage-regression=${Date.now()}`);
cart.clearCart();
assert.doesNotThrow(() => cart.addToCart('prospray-320-hea'));
assert.equal(cart.cartCount(), 1);

console.log('WAGNER payment summary and resilient cart persistence contract passed');
