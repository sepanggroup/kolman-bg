export const SUPPORTED_LANGUAGES = Object.freeze({
  bg: { label: 'БГ', name: 'Български' },
  en: { label: 'EN', name: 'English' }
});

const STORAGE_KEY = 'wagner-bg-language';
const translations = {
  bg: {
    'brand.company': 'Строителна и бояджийска техника · КОЛМАН ЕООД',
    'nav.catalog': 'Каталог', 'nav.categories': 'Категории', 'nav.about': 'За нас', 'nav.payment': 'Плащане', 'nav.contact': 'Контакти',
    'cart.button': 'Кошница', 'cart.title': 'Твоите продукти', 'cart.empty': 'Кошницата е празна.', 'cart.pay': 'Плати с PayPal →', 'cart.email': 'Поръчай по имейл', 'cart.close': 'Затвори', 'cart.payable': 'Платими продукти', 'cart.note': 'Доставка и крайна оферта се потвърждават при необходимост.',
    'hero.eyebrow': 'WAGNER PROFESSIONAL · KOLMAN EOOD', 'hero.title': 'Техниката, която', 'hero.titleAccent': 'работи за вас.', 'hero.lead': 'Професионални машини и системи WAGNER за боядисване, строителни приложения и специализирана автоматизация — подбрани за реална производителност.', 'hero.catalog': 'Разгледай каталога →', 'hero.cart': 'Твоите продукти', 'hero.meta1': 'системи', 'hero.meta2': 'от каталога', 'hero.meta3': 'плащане',
    'machine.label1': 'Фокус', 'machine.value1': 'Професионална производителност', 'machine.label2': 'Подход', 'machine.value2': 'Правилната машина за задачата',
    'categories.eyebrow': 'Категории', 'categories.title': 'Избери правилната', 'categories.accent': 'технология.', 'categories.lead': 'Airless, XVLP/HVLP, пистолети и дюзи, аксесоари и роботизирани системи за полагане на плочки.',
    'catalog.eyebrow': 'Каталог', 'catalog.title': 'WAGNER', 'catalog.accent': 'продукти.', 'catalog.lead': 'Професионален каталог с продуктови изображения, описания, технически характеристики, видео и ясна цена или „Цена при запитване“.', 'search.placeholder': 'Търси продукт, модел или характеристика…', 'filter.all': 'Всички категории', 'catalog.empty': 'Няма намерени продукти.',
    'product.full': 'Пълно описание', 'product.model': 'Модел:', 'product.price': 'Цена', 'product.buy': 'КУПИ', 'product.inquiry': 'ЗАПИТВАНЕ', 'product.video': 'Видео на продукта →', 'product.reference': 'Виж продукта →', 'product.specs': 'Технически характеристики', 'product.data': 'Технически данни →', 'product.inquiryPrice': 'Цена при запитване',
    'about.eyebrow': 'KOLMAN EOOD', 'about.title': 'WAGNER техника с фокус върху реалната работа.', 'about.text': 'KOLMAN EOOD развива дигитален търговски канал за професионални решения WAGNER в строителството и боядисването.', 'about.fact1': 'строителна и бояджийска техника', 'about.fact2': 'добави директно в кошницата', 'about.approach': 'Професионален подход', 'about.heading': 'Не просто машина.', 'about.accent': 'Правилното решение.', 'about.p1': 'Преди финализиране проверяваме модела, конфигурацията и условията. Цените в каталога са ясно означени.', 'about.p2': 'За продуктите с конкретна EUR цена можеш директно да добавиш в кошницата; за офертните роботизирани решения първо получаваш потвърдена оферта.', 'about.contact': 'Свържи се с нас →',
    'payment.eyebrow': 'Плащане', 'payment.heading': 'Плати сигурно', 'payment.accent': 'с PayPal.', 'payment.p1': 'За продукти с валидна EUR цена можеш да преминеш към PayPal от кошницата. При продукти с цена при запитване първо получаваш потвърдена сума.', 'payment.p2': 'Плащането се обработва от PayPal за KOLMAN EOOD', 'payment.status': 'Добави платими продукти в кошницата, за да активираш PayPal checkout.', 'payment.paypalButton': 'PayPal', 'payment.cardButton': '💳 Дебитна / кредитна карта', 'payment.secureNote': 'Сигурно плащане чрез PayPal',
    'contact.eyebrow': 'Контакти', 'contact.heading': 'Разкажи ни за', 'contact.accent': 'задачата.', 'contact.lead': 'Изпрати модел, снимка, количество или кратко описание на работата.', 'contact.name': 'Име *', 'contact.email': 'Имейл *', 'contact.message': 'Съобщение *', 'contact.submit': 'Изпрати поръчка →', 'contact.help': 'Формата отваря подготвен имейл до KOLMAN EOOD.',
    'footer.nav': 'Навигация', 'footer.info': 'Информация', 'footer.privacy': 'Поверителност', 'footer.terms': 'Общи условия', 'footer.cookies': 'Бисквитки', 'footer.description': 'Строителна и бояджийска техника WAGNER.', 'footer.copyright': '© 2026 KOLMAN EOOD · KOLMAN EOOD - BG',
    'category.airless.name': 'Airless боядисване', 'category.airless.desc': 'Професионални системи за дисперсии, латекс, фасадни бои, грундове и други покрития.',
    'category.xvlp.name': 'XVLP / HVLP', 'category.xvlp.desc': 'Системи за лакове, емайли, дърво, метал и фини довършителни приложения.',
    'category.guns.name': 'Пистолети и дюзи', 'category.guns.desc': 'Професионални airless пистолети, HEA дюзи и компоненти за различни системи.',
    'category.accessories.name': 'Аксесоари', 'category.accessories.desc': 'Маркучи, филтри, дюзи, удължители и сервизни компоненти.',
    'category.preparation.name': 'Подготовка', 'category.preparation.desc': 'Решения за подготовка и ремонт преди нанасяне на покрития.',
    'category.robots.name': 'Роботизирани системи', 'category.robots.desc': 'Автоматизирани решения за полагане на плочки и специализирани строителни приложения.'
  },
  en: {
    'brand.company': 'Construction & Painting Equipment · KOLMAN EOOD',
    'nav.catalog': 'Catalog', 'nav.categories': 'Categories', 'nav.about': 'About', 'nav.payment': 'Payment', 'nav.contact': 'Contact',
    'cart.button': 'Cart', 'cart.title': 'Your products', 'cart.empty': 'Your cart is empty.', 'cart.pay': 'Pay with PayPal →', 'cart.email': 'Order by email', 'cart.close': 'Close', 'cart.payable': 'Payable products', 'cart.note': 'Delivery and final offer are confirmed when required.',
    'hero.eyebrow': 'WAGNER PROFESSIONAL · KOLMAN EOOD', 'hero.title': 'Equipment that', 'hero.titleAccent': 'works for you.', 'hero.lead': 'Professional WAGNER machines and systems for painting, construction applications and specialized automation — selected for real productivity.', 'hero.catalog': 'Explore catalog →', 'hero.cart': 'Your products', 'hero.meta1': 'systems', 'hero.meta2': 'from catalog', 'hero.meta3': 'payment',
    'machine.label1': 'Focus', 'machine.value1': 'Professional productivity', 'machine.label2': 'Approach', 'machine.value2': 'The right machine for the task',
    'categories.eyebrow': 'Categories', 'categories.title': 'Choose the right', 'categories.accent': 'technology.', 'categories.lead': 'Airless, XVLP/HVLP, guns and tips, accessories and robotic tile-laying systems.',
    'catalog.eyebrow': 'Catalog', 'catalog.title': 'WAGNER', 'catalog.accent': 'products.', 'catalog.lead': 'Professional catalog with product images, descriptions, technical specifications, video and a clear price or “Price on request”.', 'search.placeholder': 'Search product, model or specification…', 'filter.all': 'All categories', 'catalog.empty': 'No products found.',
    'product.full': 'Full description', 'product.model': 'Model:', 'product.price': 'Price', 'product.buy': 'BUY', 'product.inquiry': 'REQUEST QUOTE', 'product.video': 'Product video →', 'product.reference': 'View product →', 'product.specs': 'Technical specifications', 'product.data': 'Technical data →', 'product.inquiryPrice': 'Price on request',
    'about.eyebrow': 'KOLMAN EOOD', 'about.title': 'WAGNER equipment focused on real work.', 'about.text': 'KOLMAN EOOD develops a digital sales channel for professional WAGNER solutions in construction and painting.', 'about.fact1': 'construction and painting equipment', 'about.fact2': 'add directly to cart', 'about.approach': 'Professional approach', 'about.heading': 'Not just a machine.', 'about.accent': 'The right solution.', 'about.p1': 'Before checkout we verify the model, configuration and terms. Catalog prices are clearly identified.', 'about.p2': 'Products with a specific EUR price can be added directly to the cart; quote-based robotic solutions are confirmed individually first.', 'about.contact': 'Contact us →',
    'payment.eyebrow': 'PAYMENT', 'payment.heading': 'Pay securely', 'payment.accent': 'with PayPal.', 'payment.p1': 'For products with a valid EUR price you can continue to PayPal from the cart. Quote-based products receive a confirmed amount first.', 'payment.p2': 'Payment is processed by PayPal for KOLMAN EOOD', 'payment.status': 'Add payable products to the cart to activate PayPal checkout.', 'payment.paypalButton': 'PayPal', 'payment.cardButton': '💳 Debit / credit card', 'payment.secureNote': 'Secure payment via PayPal',
    'contact.eyebrow': 'CONTACT', 'contact.heading': 'Tell us about the', 'contact.accent': 'task.', 'contact.lead': 'Send a model, photo, quantity or short description of the job.', 'contact.name': 'Name *', 'contact.email': 'Email *', 'contact.message': 'Message *', 'contact.submit': 'Send request →', 'contact.help': 'The form opens a prepared email to KOLMAN EOOD.',
    'footer.nav': 'Navigation', 'footer.info': 'Information', 'footer.privacy': 'Privacy', 'footer.terms': 'Terms', 'footer.cookies': 'Cookies', 'footer.description': 'WAGNER construction and painting equipment.', 'footer.copyright': '© 2026 KOLMAN EOOD · WAGNER-BG',
    'category.airless.name': 'Airless painting', 'category.airless.desc': 'Professional systems for dispersion paints, latex, façade coatings, primers and other materials.',
    'category.xvlp.name': 'XVLP / HVLP', 'category.xvlp.desc': 'Systems for lacquers, enamels, wood, metal and fine finishing applications.',
    'category.guns.name': 'Guns and tips', 'category.guns.desc': 'Professional airless guns, HEA tips and components for different systems.',
    'category.accessories.name': 'Accessories', 'category.accessories.desc': 'Hoses, filters, tips, extensions and service components.',
    'category.preparation.name': 'Preparation', 'category.preparation.desc': 'Preparation and repair solutions before coating application.',
    'category.robots.name': 'Robotic systems', 'category.robots.desc': 'Automated tile-laying solutions and specialized construction applications.'
  }
};

export function getLanguage() {
  const fromUrl = new URLSearchParams(window.location.search).get('lang');
  if (fromUrl && SUPPORTED_LANGUAGES[fromUrl]) return fromUrl;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED_LANGUAGES[stored]) return stored;
  } catch {}
  return 'bg';
}

export function t(key) {
  const lang = getLanguage();
  return translations[lang]?.[key] ?? translations.bg[key] ?? key;
}

export function applyLanguage(root = document) {
  const lang = getLanguage();
  document.documentElement.lang = lang;
  document.title = lang === 'en'
    ? 'KOLMAN EOOD - BG | Construction & Painting Equipment WAGNER'
    : 'KOLMAN EOOD - BG | Строителна и бояджийска техника WAGNER';
  root.querySelectorAll('[data-i18n]').forEach((node) => {
    const value = translations[lang]?.[node.dataset.i18n] ?? translations.bg[node.dataset.i18n];
    if (value != null) node.textContent = value;
  });
  root.querySelectorAll('[data-i18n-placeholder]').forEach((node) => {
    const value = translations[lang]?.[node.dataset.i18nPlaceholder] ?? translations.bg[node.dataset.i18nPlaceholder];
    if (value != null) node.setAttribute('placeholder', value);
  });
  root.querySelectorAll('[data-i18n-aria]').forEach((node) => {
    const value = translations[lang]?.[node.dataset.i18nAria] ?? translations.bg[node.dataset.i18nAria];
    if (value != null) node.setAttribute('aria-label', value);
  });
  const headerBrandCompany = root.querySelector('.site-header .brand small');
  if (headerBrandCompany) headerBrandCompany.textContent = translations[lang]?.['brand.company'] ?? translations.bg['brand.company'];
  root.querySelectorAll('[data-lang]').forEach((button) => {
    const active = button.dataset.lang === lang;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  const switcher = root.querySelector('[data-lang-switcher]');
  if (switcher) switcher.dataset.currentLanguage = lang;
  document.dispatchEvent(new CustomEvent('wagner-language-applied', { detail: { lang } }));
}

export function setLanguage(lang) {
  if (!SUPPORTED_LANGUAGES[lang]) return;
  try { localStorage.setItem(STORAGE_KEY, lang); } catch {}
  const url = new URL(window.location.href);
  url.searchParams.set('lang', lang);
  window.history.replaceState({}, '', url);
  document.documentElement.lang = lang;
  applyLanguage();
  document.dispatchEvent(new CustomEvent('wagner-language-changed', { detail: { lang } }));
}

function initLanguageSwitcher() {
  document.querySelectorAll('[data-lang]').forEach((button) => {
    button.addEventListener('click', () => setLanguage(button.dataset.lang));
  });
  applyLanguage();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initLanguageSwitcher, { once: true });
else initLanguageSwitcher();