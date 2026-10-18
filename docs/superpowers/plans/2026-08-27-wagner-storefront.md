# WAGNER-BG Storefront Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone, premium Bulgarian storefront for WAGNER construction and painting equipment under `kolman.wagner-bg.shop`, with catalog UX, inquiry-first products, PayPal payment flow for agreed amounts, legal/SEO foundations, and GitHub Pages deployment readiness.

**Architecture:** Static HTML/CSS/JS with product data separated from presentation. Product cards use confirmed labels from the supplied source material and show inquiry states when price/specification data is not confirmed. PayPal is isolated as a payment module so it cannot inherit links from the SEPANG digital-services site.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript, JSON-LD, GitHub Pages, PayPal JavaScript SDK.

**Spec:** Approved WAGNER/Колман storefront design discussed in chat on 2026-08-27.

## Global Constraints

- Domain: `kolman.wagner-bg.shop`
- Keep `wagner-bg.shop` and `sepanggroup/sepang-tech-group` untouched.
- Brand context: КОЛМАН ЕООД / WAGNER; EIK `200736602`; email `kolmaneood@abv.bg`.
- Do not invent product prices, inventory, technical specifications, warranties, or certifications.
- Use distinct source-inspired UX, not copied layouts or protected copy.
- Product payments use inquiry/quote until confirmed price data exists.
- Payment flow must not reuse the existing SEPANG digital-services payment links.
- Mobile-first, keyboard-accessible, semantic HTML, valid internal links.

---

### Task 1: Source-integrity contract

**Files:**
- Create: `tests/source-integrity.test.mjs`
- Create: `package.json`
- Create: `.github/workflows/test.yml`

**Interfaces:**
- Produces an automated test command that validates the storefront's critical files, domain references, legal links, product IDs, and PayPal module wiring.

- [ ] Step 1: Write the failing contract test.
- [ ] Step 2: Run the test and verify it fails because the storefront files do not yet exist.
- [ ] Step 3: Add the minimal package/test runner and workflow.
- [ ] Step 4: Re-run and keep it red until the implementation tasks exist.
- [ ] Step 5: Commit the test foundation.

### Task 2: Storefront shell and visual system

**Files:**
- Create: `index.html`
- Create: `styles.css`
- Create: `app.js`

**Interfaces:**
- `index.html` consumes `styles.css` and `app.js`.
- `app.js` consumes `products.js` and exposes catalog filtering, cart drawer, inquiry flow, and payment module initialization.

- [ ] Step 1: Implement semantic header, hero, search, categories, catalog, trust/about, CTA, footer.
- [ ] Step 2: Implement responsive navigation and premium product-card styling.
- [ ] Step 3: Implement accessible focus states, reduced-motion handling, and mobile drawer behavior.
- [ ] Step 4: Add SEO metadata and Organization/WebSite JSON-LD without inventing facts.
- [ ] Step 5: Commit shell and visual system.

### Task 3: Product data and catalog interactions

**Files:**
- Create: `products.js`

**Interfaces:**
- Exports the confirmed initial WAGNER product entries and category taxonomy.
- Product fields distinguish `priceKnown` from inquiry-only states.

- [ ] Step 1: Add only product labels evidenced by supplied screenshots/source text.
- [ ] Step 2: Add categories and stable product slugs.
- [ ] Step 3: Wire search, category filters, cart count, and inquiry drawer.
- [ ] Step 4: Commit catalog data and behavior.

### Task 4: PayPal payment module

**Files:**
- Create: `payment.js`
- Modify: `index.html`
- Modify: `app.js`

**Interfaces:**
- `payment.js` exposes `initAgreementPayment()` for a customer-entered agreed amount.
- No old SEPANG NCP payment URLs are allowed in this repository.

- [ ] Step 1: Add a failing source-integrity assertion that blocks old SEPANG payment URLs.
- [ ] Step 2: Implement the isolated PayPal SDK loader and amount validation.
- [ ] Step 3: Add a visible `PayPal` payment panel labelled as payment of an already agreed amount.
- [ ] Step 4: Make product cards remain inquiry-first until a confirmed retail price is supplied.
- [ ] Step 5: Commit payment module.

### Task 5: Legal, thanks, and GitHub Pages

**Files:**
- Create: `privacy.html`
- Create: `terms.html`
- Create: `cookies.html`
- Create: `thanks.html`
- Create: `CNAME`
- Modify: `.github/workflows/test.yml`

- [ ] Step 1: Add concise Bulgarian legal pages matching the business identity and site purpose.
- [ ] Step 2: Add `CNAME` for `kolman.wagner-bg.shop`.
- [ ] Step 3: Add deployment/test workflow for pushes to `main`.
- [ ] Step 4: Run full source-integrity test and fix all failures.
- [ ] Step 5: Commit deployment/legal layer.

### Task 6: Final review and deployment verification

- [ ] Step 1: Inspect all changed files and final diff.
- [ ] Step 2: Verify GitHub Actions result.
- [ ] Step 3: Verify repository `main` contains the complete storefront.
- [ ] Step 4: Provide the exact OVH DNS change needed for `www` after source verification.
- [ ] Step 5: Do not touch the apex DNS or the first SEPANG repository.
