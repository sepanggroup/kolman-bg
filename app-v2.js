import { STORE, getCategory, getProduct } from './products.js';
import { ROBOT_CATEGORY, ROBOT_PRODUCTS } from './robot-products.js';
import { PRODUCT_COPY } from './product-copy.js';
import { ROBOT_COPY } from './robot-copy.js';
import { PRODUCT_IMAGE_OVERRIDES } from './image-overrides.js';
import { EXTRA_PRODUCTS } from './extra-products.js';
import { CATALOG_ADDITIONS } from './catalog-additions.js';
import { MERCHANT } from './merchant-config.js';
import { loadCart, addToCart, setQuantity, removeFromCart, clearCart, cartCount, cartSubtotal, cartHasNonPurchasableItems, cartMailtoBody } from './cart.js';
import { initCartPayment, renderPaymentSummary } from './payment.js?v=20261101-1';
import { applyLanguage, getLanguage, t } from './i18n.js?v=20261018-1';
import { PRODUCT_DESCRIPTIONS_EN } from './product-descriptions-en.js';

const CATEGORIES = [...STORE.categories.filter((item) => item.id !== 'robots'), ROBOT_CATEGORY];
const PRODUCTS = [...STORE.products, ...ROBOT_PRODUCTS, ...EXTRA_PRODUCTS, ...CATALOG_ADDITIONS].map((product) => ({ ...product, ...(PRODUCT_COPY[product.id] || {}), ...(ROBOT_COPY[product.id] || {}), ...(PRODUCT_DESCRIPTIONS_EN[product.id] || {}) }));
const qs = (selector) => document.querySelector(selector);
const productGrid = qs('#product-grid');
const categoryGrid = qs('#category-grid');
const cartCountEl = qs('#cart-count');
const cartDrawer = qs('#cart-drawer');
const cartOverlay = qs('#cart-overlay');
const cartItems = qs('#cart-items');
const cartEmpty = qs('#cart-empty');
const cartSubtotalEl = qs('#cart-subtotal');
const cartNote = qs('#cart-note');
const checkoutButton = qs('#checkout-cart');

function productById(id) { return PRODUCTS.find((item) => item.id === id) || getProduct(id); }
function categoryById(id) { return getCategory(id) || CATEGORIES.find((item) => item.id === id); }
function imageUrlFor(product) { return PRODUCT_IMAGE_OVERRIDES[product.id] || product.imageUrl || ''; }
function detailedDescription(product) { return getLanguage() === 'en' ? (product.longDescriptionEn || product.longDescription || product.description || product.blurbEn || product.blurb || '') : (product.longDescription || product.description || product.blurb || ''); }
function productBlurb(product) { return getLanguage() === 'en' ? (product.blurbEn || product.blurb || '') : (product.blurb || ''); }
function formatPrice(product) {
  if (!product.priceKnown || !Number.isFinite(product.price) || product.priceCurrency !== 'EUR') return t('product.inquiryPrice');
  return `€${Number(product.price).toLocaleString(getLanguage() === 'bg' ? 'bg-BG' : 'en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
function imageSrc(product) { const original = imageUrlFor(product); return original ? `https://images.weserv.nl/?url=${encodeURIComponent(original)}` : ''; }
function escapeHtml(value) { return String(value).replace(/[&<>'\"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '\"': '&quot;' }[c])); }
function youtubeEmbedUrl(url) { if (!url) return ''; const match = String(url).match(/[?&]v=([^&]+)/); return match ? `https://www.youtube.com/embed/${match[1]}` : ''; }
function injectMerchantContact() {
  const contact = document.querySelector('.contact-details');
  if (!contact || !MERCHANT.phone || contact.querySelector('[data-merchant-phone]')) return;
  const p = document.createElement('p'); p.dataset.merchantPhone = 'true';
  const a = document.createElement('a'); a.href = `tel:${MERCHANT.phone.replace(/\s+/g, '')}`; a.textContent = MERCHANT.phone; p.appendChild(a); contact.appendChild(p);
}
function openCart() { cartDrawer?.classList.add('open'); cartDrawer?.setAttribute('aria-hidden', 'false'); if (cartOverlay) cartOverlay.hidden = false; document.body.classList.add('cart-open'); renderCart(); }
function closeCart() { cartDrawer?.classList.remove('open'); cartDrawer?.setAttribute('aria-hidden', 'true'); if (cartOverlay) cartOverlay.hidden = true; document.body.classList.remove('cart-open'); }
function renderCategories() {
  if (categoryGrid) categoryGrid.innerHTML = CATEGORIES.map((cat, i) => `<article class="category-card"><small>${String(i + 1).padStart(2, '0')} / WAGNER</small><h3>${escapeHtml(t(`category.${cat.id}.name`) || cat.name)}</h3><p>${escapeHtml(t(`category.${cat.id}.desc`) || cat.desc)}</p></article>`).join('');
  const filter = qs('#category-filter');
  if (filter) filter.innerHTML = `<option value="all">${escapeHtml(t('filter.all'))}</option>` + CATEGORIES.map((cat) => `<option value="${escapeHtml(cat.id)}">${escapeHtml(t(`category.${cat.id}.name`) || cat.name)}</option>`).join('');
}
function renderProducts() {
  const query = qs('#search')?.value.trim().toLowerCase() || '';
  const category = qs('#category-filter')?.value || 'all';
  const filtered = PRODUCTS.filter((product) => {
    const haystack = `${product.name} ${product.model || ''} ${product.eyebrow || ''} ${product.blurb || ''} ${product.blurbEn || ''} ${detailedDescription(product)} ${product.longDescriptionEn || ''} ${(product.specs || []).join(' ')} ${categoryById(product.category)?.name || ''}`.toLowerCase();
    return (!query || haystack.includes(query)) && (category === 'all' || product.category === category);
  });
  const cart = loadCart();
  productGrid.innerHTML = filtered.length ? filtered.map((product) => {
    const inCart = cart.find((item) => item.id === product.id)?.quantity || 0;
    const src = imageSrc(product);
    const videoEmbed = youtubeEmbedUrl(product.videoUrl);
    const purchasable = product.priceKnown && product.priceCurrency === 'EUR' && Number.isFinite(product.price);
    return `<article class="product-card premium-product-card">
      <div class="product-art" aria-label="${escapeHtml(product.name)}">${src ? `<img src="${escapeHtml(src)}" data-original-image="${escapeHtml(imageUrlFor(product))}" alt="${escapeHtml(product.name)}" loading="lazy" referrerpolicy="no-referrer">` : `<div class="shape"><span>${escapeHtml((product.model || 'WAGNER').slice(0, 18))}</span></div>`}<span class="product-badge">${escapeHtml(product.eyebrow || 'PROFESSIONAL')}</span></div>
      <div class="product-body"><small>${escapeHtml(product.eyebrow || '')}</small><h3>${escapeHtml(product.name)}</h3>${product.model ? `<div class="model">${escapeHtml(t('product.model'))} ${escapeHtml(product.model)}</div>` : ''}<p>${escapeHtml(productBlurb(product))}</p>
      <details class="product-details"><summary>${escapeHtml(t('product.full'))}</summary><div class="product-description">${escapeHtml(detailedDescription(product))}</div></details>
      ${product.specs?.length ? `<div class="specs" aria-label="${escapeHtml(t('product.specs'))}">${product.specs.map((spec) => `<span>${escapeHtml(spec)}</span>`).join('')}</div>` : ''}
      ${videoEmbed ? `<div class="product-video"><iframe src="${escapeHtml(videoEmbed)}" title="${escapeHtml(product.name)}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>` : product.videoUrl ? `<a class="product-link" href="${escapeHtml(product.videoUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(t('product.video'))}</a>` : ''}
      <div class="product-footer"><div class="price-block"><span class="price-label">${escapeHtml(t('product.price'))}</span><strong class="price-inquiry">${escapeHtml(formatPrice(product))}</strong></div><button class="btn btn-dark buy-product" type="button" data-product="${escapeHtml(product.id)}" onclick="window.kolmanAddToCart(event, '${escapeHtml(product.id)}')" ${purchasable ? '' : 'disabled'}>${purchasable ? `${escapeHtml(t('product.buy'))}${inCart ? ` · ${inCart}` : ''}` : escapeHtml(t('product.inquiry'))}</button></div>
      ${product.priceNote ? `<div class="price-note">${escapeHtml(product.priceNote)}</div>` : ''}
      ${product.referenceUrl ? `<a class="product-link" href="${escapeHtml(product.referenceUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(t('product.reference'))}</a>` : ''}
      ${product.officialUrl ? `<a class="product-link" href="${escapeHtml(product.officialUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(t('product.data'))}</a>` : ''}
      </div></article>`;
  }).join('') : `<p>${escapeHtml(t('catalog.empty'))}</p>`;
  productGrid.querySelectorAll('.product-art img').forEach((img) => img.addEventListener('error', () => {
    const original = img.dataset.originalImage;
    if (original && img.src !== original) { img.src = original; return; }
    const holder = img.closest('.product-art'); if (holder) holder.innerHTML = '<div class="shape"><span>WAGNER</span></div>';
  }, { once: true }));


}
function renderCart() {
  // Render every stored entry. Do not silently discard entries whose product
  // lookup fails; show a diagnostic row so cart/catalog ID mismatches are visible.
  const entries = loadCart();
  if (cartCountEl) cartCountEl.textContent = String(entries.reduce((sum, entry) => sum + entry.quantity, 0));

  if (cartItems) {
    cartItems.replaceChildren();
    for (const entry of entries) {
      const product = productById(entry.id);
      const row = document.createElement('div');
      row.className = 'cart-item';

      const image = document.createElement('div');
      image.className = 'cart-item-image';
      if (product && imageUrlFor(product)) {
        const img = document.createElement('img');
        img.src = imageSrc(product);
        img.alt = product.name;
        img.loading = 'lazy';
        image.appendChild(img);
      }

      const main = document.createElement('div');
      main.className = 'cart-item-main';
      const name = document.createElement('strong');
      name.textContent = product ? product.name : (getLanguage() === 'bg' ? 'Продуктът вече не е в каталога' : 'Product no longer in catalog');
      const price = document.createElement('span');
      const payable = product && product.priceKnown && product.priceCurrency === 'EUR' && Number.isFinite(product.price);
      price.textContent = payable ? formatPrice(product) : (getLanguage() === 'bg' ? 'Цена за потвърждение' : 'Price to be confirmed');
      const quantity = document.createElement('div');
      quantity.className = 'cart-qty';

      const minus = document.createElement('button');
      minus.type = 'button';
      minus.dataset.minus = entry.id;
      minus.setAttribute('aria-label', '−');
      minus.textContent = '−';
      minus.addEventListener('click', () => {
        setQuantity(entry.id, entry.quantity - 1);
        updateCartUI();
        renderProducts();
      });

      const count = document.createElement('span');
      count.textContent = String(entry.quantity);

      const plus = document.createElement('button');
      plus.type = 'button';
      plus.dataset.plus = entry.id;
      plus.setAttribute('aria-label', '+');
      plus.textContent = '+';
      plus.addEventListener('click', () => {
        setQuantity(entry.id, entry.quantity + 1);
        updateCartUI();
        renderProducts();
      });
      quantity.append(minus, count, plus);
      main.append(name, price, quantity);

      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'cart-remove';
      remove.dataset.remove = entry.id;
      remove.setAttribute('aria-label', getLanguage() === 'bg' ? 'Премахни продукта' : 'Remove product');
      remove.textContent = '×';
      remove.addEventListener('click', () => {
        removeFromCart(entry.id);
        updateCartUI();
        renderProducts();
      });

      row.append(image, main, remove);
      cartItems.appendChild(row);
    }
  }

  const hasItems = entries.length > 0;
  if (cartEmpty) cartEmpty.hidden = hasItems;
  const subtotal = cartSubtotal(productById);
  if (cartSubtotalEl) cartSubtotalEl.textContent = `€${subtotal.toLocaleString(getLanguage() === 'bg' ? 'bg-BG' : 'en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const hasQuotes = cartHasNonPurchasableItems(productById);
  if (checkoutButton) checkoutButton.disabled = !hasItems || hasQuotes || subtotal <= 0;
  if (cartNote) cartNote.textContent = hasQuotes
    ? (getLanguage() === 'bg' ? 'Кошницата съдържа продукт с цена при запитване. Потвърждаваме офертата преди плащане.' : 'The cart contains a quote-based product. We confirm the offer before payment.')
    : (getLanguage() === 'bg' ? 'Платимите продукти са в EUR и са подготвени за PayPal checkout.' : 'Payable products are in EUR and ready for PayPal checkout.');
}
function updateCartUI() { renderCart(); renderPaymentSummary(productById); initCartPayment(productById); }
function setupMenu() {
  const menu = qs('.menu'), nav = qs('#main-nav');
  menu?.addEventListener('click', () => { const open = nav.classList.toggle('open'); menu.setAttribute('aria-expanded', String(open)); });
  nav?.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); }));
}
function setupContact() {
  qs('#contact-form')?.addEventListener('submit', (event) => {
    event.preventDefault(); const data = new FormData(event.currentTarget);
    const subject = encodeURIComponent(`${getLanguage() === 'bg' ? 'Поръчка' : 'Order'} WAGNER-BG — ${data.get('name') || ''}`);
    const body = encodeURIComponent(`${data.get('message') || ''}\n\n${getLanguage() === 'bg' ? 'Кошница' : 'Cart'}:\n${decodeURIComponent(cartMailtoBody(productById))}`);
    window.location.href = `mailto:${MERCHANT.email}?subject=${subject}&body=${body}`;
  });
}
// Explicit global entry point called directly by each generated product button.
window.kolmanAddToCart = (event, id) => {
  event?.preventDefault();
  event?.stopPropagation();
  if (!id || !productById(id)) {
    console.error('[KOLMAN cart] Invalid product ID:', id);
    return;
  }
  addToCart(id);
  updateCartUI();
  renderProducts();
  openCart();
};

qs('#open-cart')?.addEventListener('click', openCart);
qs('#hero-cart')?.addEventListener('click', openCart);
qs('#close-cart')?.addEventListener('click', closeCart);
cartOverlay?.addEventListener('click', closeCart);
qs('#checkout-cart')?.addEventListener('click', () => { if (!checkoutButton.disabled) qs('#payment')?.scrollIntoView({ behavior: 'smooth' }); closeCart(); });
qs('#search')?.addEventListener('input', renderProducts);
qs('#category-filter')?.addEventListener('change', renderProducts);
qs('#cart-clear')?.addEventListener('click', () => { clearCart(); updateCartUI(); renderProducts(); });
window.addEventListener('wagner-cart-updated', () => { updateCartUI(); renderProducts(); });
document.addEventListener('wagner-language-changed', () => { applyLanguage(); renderCategories(); renderProducts(); updateCartUI(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeCart(); });

applyLanguage();
injectMerchantContact();
renderCategories();
renderProducts();
updateCartUI(); renderPaymentSummary(productById);
setupMenu();
setupContact();
