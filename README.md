# So Valencia

Website for **So Valencia**: tees and hoodies with funny Valencia quotes.

Live at **https://ferasmed-dev.github.io/so-valencia/**

Plain HTML, CSS and JavaScript. There's no build step and no framework, and it's hosted free on GitHub Pages.

## Files

| File | What it is |
| --- | --- |
| `index.html` | Home page |
| `product.html` | Product page. Shows any product via `?p=<id>`, e.g. `product.html?p=i-love-horchata` |
| `js/products.js` | **Product data**: names, quotes, colours, descriptions and Stripe links |
| `js/main.js` | Mobile menu, bag counter, toasts, newsletter form |
| `js/product.js` | Product page: colour, size, views, add to bag / buy now |
| `css/style.css` | Animations and responsive rules |

## Selling with Stripe

1. In Stripe, create a **Payment Link** for each product.
   - Add a custom field: **Dropdown**, "Size": XS, S, M, L, XL.
   - Add a custom field: **Dropdown**, "Colour", with that product's colours.
   - Turn on **Collect customers' addresses** for shipping.
2. Open `js/products.js` and paste each link into that product's `"paymentLink": ""`.
3. Commit. The product's button changes from "Add to bag" to **Buy now** and takes the buyer to Stripe Checkout.
   The chosen product, colour and size are passed as `client_reference_id` (e.g. `i-love-horchata_blau_M`), so you can see them in the Stripe dashboard.

Products without a link keep the "Add to bag" behaviour, which saves items on the visitor's device only.

## Newsletter (Formspree)

1. Create a free form at formspree.io.
2. In `index.html`, replace `FORMSPREE_ID` in `action="https://formspree.io/f/FORMSPREE_ID"` with your form ID.

Until then, the form shows an "opening soon" message and doesn't store anything.

## Still to fill in before launch

- Prices: search for `[€ price]`
- Free-shipping threshold: `[€ amount]` in `index.html`
- Fabric, delivery times and product-safety contact on the product page: search for `[`
- Legal pages linked in the footer: Aviso legal, Privacidad, Cookies, Condiciones de venta
- Instagram link (`Follow @sovalencia`)

## Animations

CSS only, animating `transform` and `opacity`, so they stay smooth on low-end phones. Everything stops when the visitor has *reduce motion* turned on.
