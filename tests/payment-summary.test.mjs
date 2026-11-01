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
assert.match(payment, /PAYPAL_CLIENT_ID/);
assert.match(payment, /createOrder/);
assert.match(payment, /actions\.order\.capture\(\)/);
assert.match(payment, /clearCart\(\)/);
assert.match(payment, /container\.dataset\.paypalLoading/);
assert.match(payment, /onCancel/);
assert.match(payment, /showPaymentNotice/);
assert.match(payment, /Retry PayPal checkout/);
assert.doesNotMatch(payment, /paypalme/i);
assert.doesNotMatch(payment, /PayPal\.Me/);
assert.match(payment, /fallback\.hidden = false/);
assert.match(payment, /paypal-static-fallback/);
assert.match(payment, /retry\.type = 'button'/);
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

console.log('WAGNER PayPal checkout and resilient cart persistence contract passed');
