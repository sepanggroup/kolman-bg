import { STORE, getCategory, getProduct } from './products.js';
import { ROBOT_CATEGORY, ROBOT_PRODUCTS } from './robot-products.js';
import { PRODUCT_COPY } from './product-copy.js';
import { ROBOT_COPY } from './robot-copy.js';
import { PRODUCT_IMAGE_OVERRIDES } from './image-overrides.js';
import { EXTRA_PRODUCTS } from './extra-products.js';
import { CATALOG_ADDITIONS } from './catalog-additions.js';
import { MERCHANT } from './merchant-config.js';
import { loadCart, addToCart, setQuantity, removeFromCart, clearCart, cartCount, cartSubtotal, cartHasNonPurchasableItems, cartMailtoBody } from './cart.js';
import { initCartPayment, renderPaymentSummary } from './payment.js?v=20260830-2335';
import { applyLanguage, getLanguage, t } from './i18n.js';
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
      <div class="product-footer"><div class="price-block"><span class="price-label">${escapeHtml(t('product.price'))}</span><strong class="price-inquiry">${escapeHtml(formatPrice(product))}</strong></div><button class="btn btn-dark buy-product" type="button" data-product="${escapeHtml(product.id)}" ${purchasable ? '' : 'disabled'}>${purchasable ? `${escapeHtml(t('product.buy'))}${inCart ? ` · ${inCart}` : ''}` : escapeHtml(t('product.inquiry'))}</button></div>
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
function handleProductGridClick(event) {
  const button = event.target.closest('.buy-product');
  if (!button || button.disabled || !productGrid?.contains(button)) return;
  const id = button.dataset.product;
  if (!id || !productById(id)) return;
  addToCart(id);
  openCart();
}
function renderCart() {
  const items = loadCart().map((entry) => ({ entry, product: productById(entry.id) })).filter(({ product }) => product);
  cartCountEl.textContent = String(cartCount());
  if (!items.length) { cartEmpty.hidden = false; cartItems.innerHTML = ''; }
  else {
    cartEmpty.hidden = true;
    cartItems.innerHTML = items.map(({ entry, product }) => `<div class="cart-item"><div class="cart-item-image">${imageUrlFor(product) ? `<img src="${escapeHtml(imageSrc(product))}" alt="${escapeHtml(product.name)}" loading="lazy">` : ''}</div><div class="cart-item-main"><strong>${escapeHtml(product.name)}</strong><span>${escapeHtml(formatPrice(product))}</span><div class="cart-qty"><button type="button" data-minus="${escapeHtml(product.id)}" aria-label="−">−</button><span>${entry.quantity}</span><button type="button" data-plus="${escapeHtml(product.id)}" aria-label="+">+</button></div></div><button type="button" class="cart-remove" data-remove="${escapeHtml(product.id)}" aria-label="${escapeHtml(t('cart.close'))}">×</button></div>`).join('');
    cartItems.querySelectorAll('[data-minus]').forEach((b) => b.addEventListener('click', () => { const i = loadCart().find((x) => x.id === b.dataset.minus); setQuantity(b.dataset.minus, (i?.quantity || 1) - 1); updateCartUI(); renderProducts(); }));
    cartItems.querySelectorAll('[data-plus]').forEach((b) => b.addEventListener('click', () => { const i = loadCart().find((x) => x.id === b.dataset.plus); setQuantity(b.dataset.plus, (i?.quantity || 0) + 1); updateCartUI(); renderProducts(); }));
    cartItems.querySelectorAll('[data-remove]').forEach((b) => b.addEventListener('click', () => { removeFromCart(b.dataset.remove); updateCartUI(); renderProducts(); }));
  }
  const subtotal = cartSubtotal(productById);
  cartSubtotalEl.textContent = `€${subtotal.toLocaleString(getLanguage() === 'bg' ? 'bg-BG' : 'en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const hasQuotes = cartHasNonPurchasableItems(productById);
  checkoutButton.disabled = !items.length || hasQuotes || subtotal <= 0;
  cartNote.textContent = hasQuotes ? (getLanguage() === 'bg' ? 'Кошницата съдържа продукт с цена при запитване. Потвърждаваме офертата преди плащане.' : 'The cart contains a quote-based product. We confirm the offer before payment.') : (getLanguage() === 'bg' ? 'Платимите продукти са в EUR и са подготвени за PayPal checkout.' : 'Payable products are in EUR and ready for PayPal checkout.');
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
qs('#open-cart')?.addEventListener('click', openCart);
qs('#hero-cart')?.addEventListener('click', openCart);
productGrid?.addEventListener('click', handleProductGridClick);
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
