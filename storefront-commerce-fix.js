import { STORE, getProduct } from './products.js';
import { ROBOT_PRODUCTS } from './robot-products.js';
import { EXTRA_PRODUCTS } from './extra-products.js';
import { PRODUCT_COPY } from './product-copy.js';
import { ROBOT_COPY } from './robot-copy.js';
import { loadCart, addToCart, cartSubtotal, cartHasNonPurchasableItems } from './cart.js';

const PRODUCTS = [
  ...[...STORE.products, ...ROBOT_PRODUCTS].map((p) => ({ ...p, ...(PRODUCT_COPY[p.id] || {}), ...(ROBOT_COPY[p.id] || {}) })),
  ...EXTRA_PRODUCTS.filter((p) => !STORE.products.some((x) => x.id === p.id) && !ROBOT_PRODUCTS.some((x) => x.id === p.id))
];
const productById = (id) => PRODUCTS.find((p) => p.id === id) || getProduct(id);
const isPayable = (product) => Boolean(product && product.priceKnown && product.priceCurrency === 'EUR' && Number.isFinite(product.price) && product.price > 0);

function renderPaymentSummary() {
  const summary = document.querySelector('#paypal-payment-summary');
  const itemsEl = document.querySelector('#paypal-payment-items');
  const totalEl = document.querySelector('#paypal-payment-total');
  const titleEl = document.querySelector('#paypal-payment-summary-title');
  const totalLabelEl = document.querySelector('#paypal-payment-total-label');
  if (!summary || !itemsEl || !totalEl) return;

  const english = document.documentElement.lang === 'en';
  if (titleEl) titleEl.textContent = english ? 'Payment order' : 'Поръчка за плащане';
  if (totalLabelEl) totalLabelEl.textContent = english ? 'Total' : 'Общо';

  const items = loadCart().map((entry) => ({ entry, product: productById(entry.id) })).filter(({ product }) => product);
  if (!items.length) {
    itemsEl.replaceChildren();
    totalEl.textContent = '€0.00';
    summary.hidden = true;
    return;
  }

  const fragment = document.createDocumentFragment();
  items.forEach(({ entry, product }) => {
    const row = document.createElement('div');
    row.className = 'selected-row';
    const name = document.createElement('strong');
    name.textContent = `${product.name}${product.model ? ` · ${product.model}` : ''} × ${entry.quantity}`;
    const amount = document.createElement('strong');
    amount.textContent = isPayable(product)
      ? `€${(product.price * entry.quantity).toLocaleString(english ? 'en-GB' : 'bg-BG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : (english ? 'Price on request' : 'Цена при запитване');
    row.append(name, amount);
    fragment.appendChild(row);
  });
  itemsEl.replaceChildren(fragment);
  const subtotal = cartSubtotal(productById);
  totalEl.textContent = `€${subtotal.toLocaleString(english ? 'en-GB' : 'bg-BG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  summary.hidden = false;
}

function syncProductButtons() {
  document.querySelectorAll('#product-grid .buy-product').forEach((button) => {
    const product = productById(button.dataset.product);
    if (!product) return;
    const payable = isPayable(product);
    const quantity = loadCart().find((item) => item.id === product.id)?.quantity || 0;
    button.disabled = false;
    button.dataset.commerceAction = payable ? 'buy' : 'quote';
    button.textContent = payable ? `КУПИ${quantity ? ` · ${quantity}` : ''}` : 'ЗАПИТВАНЕ';
    button.setAttribute('aria-label', payable ? `Купи ${product.name}` : `Добави ${product.name} за запитване`);
    button.title = payable ? 'Добави продукта в кошницата' : 'Добави продукта в кошницата за оферта';
  });
}

function interceptProductClicks() {
  document.addEventListener('click', (event) => {
    const button = event.target.closest('#product-grid .buy-product');
    if (!button) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const product = productById(button.dataset.product);
    if (!product) return;
    addToCart(product.id);
    document.querySelector('#open-cart')?.click();
    renderPaymentSummary();
  }, true);
}

function boot() {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;
  interceptProductClicks();
  const grid = document.querySelector('#product-grid');
  if (grid) new MutationObserver(() => syncProductButtons()).observe(grid, { childList: true });
  window.addEventListener('wagner-cart-updated', () => { syncProductButtons(); renderPaymentSummary(); });
  syncProductButtons();
  renderPaymentSummary();
  const note = document.querySelector('#cart-note');
  if (note && cartHasNonPurchasableItems(productById)) note.dataset.hasQuoteItems = 'true';
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
}
