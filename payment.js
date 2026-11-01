import { PAYPAL_CLIENT_ID, MERCHANT } from './merchant-config.js';
import { loadCart, cartSubtotal, cartHasNonPurchasableItems, clearCart } from './cart.js';

let paypalPromise = null;
let buttonRenderPromise = null;
let paymentError = false;

function payableCartState(productById) {
  const cart = loadCart();
  const subtotal = cartSubtotal(productById);
  const hasQuotes = cartHasNonPurchasableItems(productById);
  return { cart, subtotal, hasQuotes, payable: cart.length > 0 && !hasQuotes && Number.isFinite(subtotal) && subtotal > 0 };
}

function getFallback() {
  let fallback = document.querySelector('#paypal-static-fallback');
  if (!fallback) {
    fallback = document.createElement('div');
    fallback.id = 'paypal-static-fallback';
    fallback.className = 'paypal-static-fallback';
    const status = document.querySelector('#paypal-status');
    status?.insertAdjacentElement('afterend', fallback);
  }
  return fallback;
}

function showPaymentNotice(message, productById, allowRetry = false) {
  const fallback = getFallback();
  fallback.replaceChildren();

  const text = document.createElement('p');
  text.textContent = message;
  fallback.appendChild(text);

  if (allowRetry) {
    const retry = document.createElement('button');
    retry.type = 'button';
    retry.className = 'paypal-static-button paypal-static-paypal';
    retry.textContent = document.documentElement.lang === 'en' ? 'Retry PayPal checkout' : 'Опитай отново с PayPal';
    retry.addEventListener('click', () => {
      paymentError = false;
      fallback.hidden = true;
      initCartPayment(productById);
    });
    fallback.appendChild(retry);
  }

  fallback.hidden = false;
  return fallback;
}

function paymentReadyMessage() {
  return document.documentElement.lang === 'en'
    ? 'Pay with PayPal. Bank virtual POS card payment is not enabled here.'
    : 'Плащане чрез PayPal. Банковото картово плащане през виртуален POS не е активирано тук.';
}

function paymentUnavailableMessage() {
  return document.documentElement.lang === 'en'
    ? 'PayPal checkout could not be loaded. Check the merchant PayPal Business account configuration and try again.'
    : 'PayPal checkout не се зареди. Провери конфигурацията на PayPal Business акаунта на търговеца и опитай отново.';
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
  const fallback = getFallback();
  if (!container || !status) return;

  const state = payableCartState(productById);
  if (!state.payable) {
    container.replaceChildren();
    container.dataset.paypalReady = 'false';
    fallback.hidden = true;
    status.textContent = state.hasQuotes
      ? (document.documentElement.lang === 'en'
          ? 'The cart contains a quote-based product. Confirm the final amount before payment.'
          : 'Кошницата съдържа продукт с цена при запитване. Потвърди крайната сума преди плащане.')
      : (document.documentElement.lang === 'en'
          ? 'Add a payable EUR product to activate PayPal checkout.'
          : 'Добави платим продукт с валидна EUR цена в кошницата, за да активираш PayPal checkout.');
    return;
  }

  if (!PAYPAL_CLIENT_ID) {
    status.textContent = document.documentElement.lang === 'en'
      ? 'PayPal checkout is not configured for this merchant.'
      : 'PayPal checkout не е конфигуриран за този търговец.';
    showPaymentNotice(status.textContent, productById, false);
    return;
  }

  if (container.dataset.paypalReady === 'true' && container.children.length) {
    fallback.hidden = true;
    status.textContent = paymentReadyMessage();
    return;
  }

  // Avoid attaching multiple PayPal button sets when the cart updates during SDK loading.
  if (buttonRenderPromise) return;

  paymentError = false;
  container.dataset.paypalLoading = 'true';
  status.textContent = document.documentElement.lang === 'en'
    ? 'Loading secure PayPal checkout…'
    : 'Зарежда се защитеният PayPal checkout…';

  buttonRenderPromise = loadPayPal(PAYPAL_CLIENT_ID).then(() => {
    const current = payableCartState(productById);
    if (!current.payable) {
      container.replaceChildren();
      container.dataset.paypalReady = 'false';
      return;
    }
    if (!window.paypal?.Buttons) throw new Error('PayPal Buttons SDK unavailable');

    container.replaceChildren();
    container.dataset.paypalReady = 'false';

    const validateCart = () => {
      const currentState = payableCartState(productById);
      if (!currentState.cart.length) throw new Error('Cart is empty');
      if (currentState.hasQuotes) throw new Error('Cart contains quote-only or non-EUR items');
      if (!currentState.payable) throw new Error('No payable EUR products in cart');
      return currentState;
    };

    const createOrder = (_data, actions) => {
      const currentState = validateCart();
      const items = currentState.cart.map((entry) => {
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
            value: currentState.subtotal.toFixed(2),
            breakdown: { item_total: { currency_code: 'EUR', value: currentState.subtotal.toFixed(2) } }
          },
          items
        }]
      });
    };

    const onClick = (_data, actions) => {
      try {
        validateCart();
        return actions.resolve();
      } catch {
        status.textContent = document.documentElement.lang === 'en'
          ? 'Add a payable EUR product to the cart before continuing.'
          : 'Добави платим продукт с валидна EUR цена в кошницата, преди да продължиш.';
        return actions.reject();
      }
    };

    const onApprove = async (data, actions) => {
      try {
        const details = await actions.order.capture();
        const captureCompleted = details?.status === 'COMPLETED'
          || details?.purchase_units?.some((unit) => unit.payments?.captures?.some((capture) => capture.status === 'COMPLETED'));
        if (!captureCompleted) throw new Error('PayPal capture was not completed');

        const orderId = data?.orderID || details?.id || '';
        clearCart();
        fallback.hidden = true;
        status.textContent = document.documentElement.lang === 'en'
          ? `Payment completed successfully. PayPal Order ID: ${orderId}`
          : `Плащането е успешно потвърдено. PayPal Order ID: ${orderId}`;
      } catch {
        status.textContent = document.documentElement.lang === 'en'
          ? 'PayPal could not confirm the payment. Do not retry if your PayPal account shows a completed charge; contact the merchant to verify the order.'
          : 'PayPal не успя да потвърди плащането. Не повтаряй плащането, ако в PayPal виждаш завършено плащане; свържи се с търговеца за проверка на поръчката.';
        showPaymentNotice(status.textContent, productById, true);
      }
    };

    const onCancel = () => {
      status.textContent = document.documentElement.lang === 'en'
        ? 'Payment was cancelled. Your cart has been preserved.'
        : 'Плащането е отказано или отменено. Продуктите остават в кошницата.';
    };

    const onError = () => {
      paymentError = true;
      container.dataset.paypalReady = 'false';
      container.replaceChildren();
      status.textContent = paymentUnavailableMessage();
      showPaymentNotice(status.textContent, productById, true);
    };

    const buttons = window.paypal.Buttons({
      style: { shape: 'rect', color: 'gold', layout: 'vertical', label: 'pay' },
      createOrder,
      onClick,
      onApprove,
      onCancel,
      onError
    });
    if (typeof buttons.isEligible === 'function' && !buttons.isEligible()) {
      throw new Error('PayPal checkout is not eligible for this browser or account');
    }

    return buttons.render(container).then(() => {
      container.dataset.paypalReady = 'true';
      fallback.hidden = true;
      status.textContent = paymentReadyMessage();
    });
  }).catch(() => {
    paymentError = true;
    container.dataset.paypalReady = 'false';
    container.replaceChildren();
    status.textContent = paymentUnavailableMessage();
    showPaymentNotice(status.textContent, productById, true);
  }).finally(() => {
    buttonRenderPromise = null;
    container.dataset.paypalLoading = 'false';

    // If the cart became payable while the SDK was loading, initialize against its latest state.
    const latest = payableCartState(productById);
    if (!paymentError && latest.payable && container.dataset.paypalReady !== 'true' && window.paypal?.Buttons) {
      queueMicrotask(() => initCartPayment(productById));
    }
  });
}

function loadPayPal(clientId) {
  if (window.paypal?.Buttons) return Promise.resolve();
  if (paypalPromise) return paypalPromise;

  paypalPromise = new Promise((resolve, reject) => {
    // Remove a failed stale script so the retry button can request a fresh SDK load.
    document.querySelector('script[data-wagner-paypal]')?.remove();
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=EUR&intent=capture&components=buttons`;
    script.async = true;
    script.dataset.wagnerPaypal = 'true';
    script.onload = () => window.paypal?.Buttons ? resolve() : reject(new Error('PayPal SDK did not initialize'));
    script.onerror = () => reject(new Error('PayPal SDK script failed to load'));
    document.head.appendChild(script);
  }).catch((error) => {
    paypalPromise = null;
    document.querySelector('script[data-wagner-paypal]')?.remove();
    throw error;
  });

  return paypalPromise;
}
