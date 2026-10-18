import { addToCart } from './cart.js';
import { PRODUCT_DESCRIPTIONS_EN } from './product-descriptions-en.js?v=20260830-1930';

const PRODUCT_GRID = '#product-grid';
const CART_BUTTON = '#open-cart';

function syncEnglishCopy() {
  if (document.documentElement.lang !== 'en') return;
  document.querySelectorAll(`${PRODUCT_GRID} .product-card`).forEach((card) => {
    const button = card.querySelector('.buy-product');
    const id = button?.dataset.product;
    if (!id) return;
    const copy = PRODUCT_DESCRIPTIONS_EN[id];
    if (!copy) return;
    const blurb = card.querySelector('.product-body > p');
    const description = card.querySelector('.product-description');
    if (blurb && copy.blurbEn) blurb.textContent = copy.blurbEn;
    if (description && copy.longDescriptionEn) description.textContent = copy.longDescriptionEn;
  });
}

function bindReliableBuyButtons() {
  const grid = document.querySelector(PRODUCT_GRID);
  if (!grid) return;
  grid.querySelectorAll('.buy-product:not([data-runtime-buy-bound])').forEach((button) => {
    button.dataset.runtimeBuyBound = 'true';
    button.addEventListener('click', (event) => {
      if (button.disabled) return;
      const id = button.dataset.product;
      if (!id) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      addToCart(id);
      document.querySelector(CART_BUTTON)?.click();
    });
  });
}

function syncRuntimeLayer() {
  syncEnglishCopy();
  bindReliableBuyButtons();
}

function initRuntimeFixes() {
  const grid = document.querySelector(PRODUCT_GRID);
  if (!grid) return;
  const observer = new MutationObserver(syncRuntimeLayer);
  observer.observe(grid, { childList: true, subtree: true });
  document.addEventListener('wagner-language-changed', syncRuntimeLayer);
  document.addEventListener('wagner-language-applied', syncRuntimeLayer);
  syncRuntimeLayer();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initRuntimeFixes, { once: true });
} else {
  initRuntimeFixes();
}
