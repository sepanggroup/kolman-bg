import { PAYPAL_CLIENT_ID, MERCHANT } from './merchant-config.js';
import { loadCart, cartSubtotal, cartHasNonPurchasableItems } from './cart.js';

const PAYPAL_ME_URL = 'https://www.paypal.com/paypalme/1968428713';
let paypalPromise = null;

function payableCartState(productById) {
  const cart = loadCart();
  const subtotal = cartSubtotal(productById);
  const hasQuotes = cartHasNonPurchasableItems(productById);
  return { cart, subtotal, hasQuotes, payable: cart.length > 0 && !hasQuotes && Number.isFinite(subtotal) && subtotal > 0 };
}

function ensureStaticPaymentFallback(status, productById) {
  let fallback = document.querySelector('#paypal-static-fallback');
  if (!fallback) {
    fallback = document.createElement('div');
    fallback.id = 'paypal-static-fallback';
    fallback.className = 'paypal-static-fallback';
    status.insertAdjacentElement('afterend', fallback);
  }

  const { payable, subtotal, cart, hasQuotes } = payableCartState(productById);
  const amount = payable ? subtotal.toFixed(2) : '';
  const target = payable ? `${PAYPAL_ME_URL}/${amount}EUR` : '';
  const isEnglish = document.documentElement.lang === 'en';
  const amountLabel = payable ? ` €${subtotal.toLocaleString(isEnglish ? 'en-GB' : 'bg-BG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '';
  const disabledLabel = hasQuotes
    ? (isEnglish ? 'Payment available after quote confirmation' : 'Плащането е достъпно след потвърждение на офертата')
    : (isEnglish ? 'Add a payable EUR product to activate checkout' : 'Добави платим продукт с EUR цена, за да активираш плащането');

  fallback.innerHTML = `
    ${payable
      ? `<a class="paypal-static-button paypal-static-paypal" href="${target}" target="_blank" rel="noopener noreferrer" aria-label="PayPal payment for ${MERCHANT.legalName}">PayPal${amountLabel}</a>`
      : `<button class="paypal-static-button paypal-static-paypal" type="button" disabled aria-disabled="true">PayPal</button>`}
    <small>${payable
      ? (isEnglish
          ? `PayPal.Me payment for the payable cart total${amountLabel}. This is a PayPal service, not the merchant's bank virtual POS. Bank card payment through the merchant's virtual POS is not enabled on this page.`
          : `Плащане чрез PayPal.Me за платимата сума в кошницата${amountLabel}. Това е услуга на PayPal, а не банковият виртуален POS на търговеца. Плащането с карта през банковия виртуален POS не е активирано на тази страница.`)
      : `${disabledLabel}.`}</small>`;
  fallback.hidden = false;
  fallback.dataset.payable = payable ? 'true' : 'false';
  return fallback;
}

export function renderPaymentSummary(productById) {
  const summary = document.querySelector('#paypal-payment-summary');
  const itemsEl = document.querySelector('#paypal-payment-items');
  const totalEl = document.querySelector('#paypal-payment-total');
  const titleEl = document.querySelector('#paypal-payment-summary-title');
  const totalLabelEl = document.querySelector('#paypal-payment-total-label');
  if (!summary || !itemsEl || !totalEl) return;

  const isEnglish = document.documentElement.lang === 'en';
  if (titleEl) titleEl.textContent = isEnglish ? 'Payment order' : 'Поръчка за плащане';
  if (totalLabelEl) totalLabelEl.textContent = isEnglish ? 'Total' : 'Общо';

  const items = loadCart().map((entry) => ({ entry, product: productById(entry.id) })).filter(({ product }) => product);
  if (!items.length) {
    itemsEl.replaceChildren();
    totalEl.textContent = '€0.00';
    summary.hidden = true;
    return;
  }

  const fragment = document.createDocumentFragment();
  for (const { entry, product } of items) {
    const row = document.createElement('div');
    row.className = 'selected-row';
    const name = document.createElement('strong');
    name.textContent = `${product.name}${product.model ? ` · ${product.model}` : ''} × ${entry.quantity}`;
    const amount = document.createElement('strong');
    const payable = product.priceKnown && product.priceCurrency === 'EUR' && Number.isFinite(product.price);
    amount.textContent = payable
      ? `€${(product.price * entry.quantity).toLocaleString(isEnglish ? 'en-GB' : 'bg-BG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : (isEnglish ? 'Price on request' : 'Цена при запитване');
    row.append(name, amount);
    fragment.appendChild(row);
  }
  itemsEl.replaceChildren(fragment);

  const subtotal = cartSubtotal(productById);
  totalEl.textContent = `€${subtotal.toLocaleString(isEnglish ? 'en-GB' : 'bg-BG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  summary.hidden = false;
}

export function initCartPayment(productById) {
  const container = document.querySelector('#paypal-button-container');
  const status = document.querySelector('#paypal-status');
  if (!container || !status) return;

  const fallback = ensureStaticPaymentFallback(status, productById);
  const state = payableCartState(productById);

  if (!state.payable) {
    container.innerHTML = '';
    container.dataset.paypalReady = 'false';
    fallback.hidden = false;
    status.textContent = state.hasQuotes
      ? (document.documentElement.lang === 'en' ? 'The cart contains a quote-based product. Confirm the final amount before payment.' : 'Кошницата съдържа продукт с цена при запитване. Потвърди крайната сума преди плащане.')
      : (document.documentElement.lang === 'en' ? 'Add a payable EUR product to activate PayPal checkout.' : 'Добави платим продукт с валидна EUR цена в кошницата, за да активираш PayPal checkout.');
    return;
  }

  if (!PAYPAL_CLIENT_ID) {
    status.textContent = document.documentElement.lang === 'en'
      ? 'PayPal checkout is unavailable; use the PayPal.Me option below. It is not the merchant bank virtual POS.'
      : 'PayPal checkout временно не е наличен; използвай PayPal.Me по-долу. Това не е банковият виртуален POS на търговеца.';
    fallback.hidden = false;
    return;
  }

  if (container.dataset.paypalReady === 'true' && container.children.length) {
    fallback.hidden = true;
    status.textContent = document.documentElement.lang === 'en'
      ? 'Pay with PayPal. Bank virtual POS card payment is not enabled here.'
      : 'Плащане чрез PayPal. Банковото картово плащане през виртуален POS не е активирано тук.';
    return;
  }

  status.textContent = document.documentElement.lang === 'en'
    ? 'Loading secure PayPal checkout…'
    : 'Зарежда се сигурният PayPal checkout…';

  loadPayPal(PAYPAL_CLIENT_ID).then(() => {
    if (!window.paypal?.Buttons) throw new Error('PayPal SDK unavailable');
    container.innerHTML = '';
    container.dataset.paypalReady = 'false';

    const validateCart = () => {
      const current = payableCartState(productById);
      if (!current.cart.length) throw new Error('Cart is empty');
      if (current.hasQuotes) throw new Error('Cart contains quote-only or non-EUR items');
      if (!current.payable) throw new Error('No payable EUR products in cart');
      return current;
    };

    const createOrder = (_data, actions) => {
      const { cart, subtotal } = validateCart();
      const items = cart.map((entry) => {
        const product = productById(entry.id);
        return {
          name: product.name.slice(0, 127),
          sku: product.model || product.id,
          unit_amount: { currency_code: 'EUR', value: product.price.toFixed(2) },
          quantity: String(entry.quantity)
        };
      });
      return actions.order.create({
        purchase_units: [{
          description: `WAGNER-BG order — ${MERCHANT.legalName}`,
          amount: {
            currency_code: 'EUR',
            value: subtotal.toFixed(2),
            breakdown: { item_total: { currency_code: 'EUR', value: subtotal.toFixed(2) } }
          },
          items
        }]
      });
    };

    const onClick = (_data, actions) => {
      try { validateCart(); return actions.resolve(); }
      catch {
        status.textContent = document.documentElement.lang === 'en'
          ? 'Add a payable EUR product to the cart before continuing.'
          : 'Добави платим продукт с валидна EUR цена в кошницата, преди да продължиш.';
        return actions.reject();
      }
    };

    const onApprove = (data, actions) => actions.order.capture().then((details) => {
      const payer = details?.payer?.name?.given_name || '';
      status.textContent = payer
        ? `Плащането е успешно потвърдено за ${payer}. PayPal Order ID: ${data.orderID}`
        : `Плащането е успешно потвърдено. PayPal Order ID: ${data.orderID}`;
    });

    const onError = () => {
      container.dataset.paypalReady = 'false';
      const current = payableCartState(productById);
      ensureStaticPaymentFallback(status, productById).hidden = false;
      status.textContent = current.payable
        ? 'PayPal checkout временно не е наличен. Използвай защитеното плащане по сумата на кошницата по-долу.'
        : 'Добави платим продукт с валидна EUR цена в кошницата, за да активираш PayPal checkout.';
    };

    const baseOptions = { style: { shape: 'rect', color: 'gold', layout: 'vertical', label: 'pay' }, createOrder, onClick, onApprove, onError };
    const renderers = [window.paypal.Buttons(baseOptions).render(container)];

    return Promise.all(renderers).then(() => {
      container.dataset.paypalReady = 'true';
      fallback.hidden = true;
      status.textContent = document.documentElement.lang === 'en' ? 'Pay with PayPal. Bank virtual POS card payment is not enabled here.' : 'Плащане чрез PayPal. Банковото картово плащане през виртуален POS не е активирано тук.';
    });
  }).catch(() => {
    container.dataset.paypalReady = 'false';
    ensureStaticPaymentFallback(status, productById).hidden = false;
    status.textContent = document.documentElement.lang === 'en'
      ? 'PayPal checkout is temporarily unavailable. Use the secure cart amount below.'
      : 'PayPal checkout временно не е наличен. Използвай защитеното плащане по сумата на кошницата по-долу.';
  });
}

function loadPayPal(clientId) {
  if (window.paypal) return Promise.resolve();
  if (paypalPromise) return paypalPromise;
  paypalPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-wagner-paypal]');
    if (existing) {
      if (window.paypal) { resolve(); return; }
      existing.addEventListener('load', resolve, { once: true });
      existing.addEventListener('error', reject, { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=EUR&intent=capture&components=buttons`;
    script.async = true;
    script.dataset.wagnerPaypal = 'true';
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
  return paypalPromise;
}
