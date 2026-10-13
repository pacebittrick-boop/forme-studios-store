# FORMÉ STUDIOS — Storefront starter

A responsive fashion storefront with product filtering, quick-view product details, size selection, a local shopping bag, and a Netlify Function prepared to create Stripe Checkout sessions.

## Included
- `index.html`, `styles.css`, `script.js`: storefront
- `success.html`: post-checkout confirmation page
- `netlify/functions/create-checkout-session.mjs`: server-side Stripe Checkout creation
- `netlify.toml`: Netlify deployment configuration

## Important before launch
This is a working storefront starter, not a live store yet. Real checkout stays disabled until you connect your own Stripe account and deploy to Netlify. Product names, images, prices, sizes, shipping settings, policies, and inventory shown here are sample content. The newsletter form is a visual placeholder and does not store email addresses.

## Publish for free on Netlify
1. Create an account at https://app.netlify.com/ .
2. Put these files in a GitHub repository, or drag the project folder into Netlify Drop if your account's current workflow supports manual deploys. For the serverless checkout function, make sure the deploy includes the `netlify/functions` folder and `netlify.toml`; Git-based deploy is recommended.
3. Publish the site. Netlify will provide a public `*.netlify.app` URL.
4. In Netlify: Site configuration → Environment variables, add `STRIPE_SECRET_KEY` with your Stripe **test** secret key first.
5. Redeploy after setting the variable.
6. Test a purchase using Stripe's test mode and test card `4242 4242 4242 4242`, with any future expiry and any CVC.
7. Before accepting real orders, replace the test key with the live secret key, after thoroughly testing shipping, tax, refunds, fulfillment, and policies. Never put a Stripe secret key in `script.js` or any browser code.

Official references:
- Netlify pricing/deploy: https://www.netlify.com/pricing/
- Netlify environment variables: https://docs.netlify.com/environment-variables/overview/
- Stripe pricing: https://stripe.com/pricing
- Stripe Checkout: https://stripe.com/payments/checkout

## Custom domain
A Netlify-provided subdomain can be free. A custom `.com` domain usually costs extra and must be purchased/registered. In Netlify, open Domain management → Add a domain and follow the DNS instructions.

## Before taking real orders
- Confirm FORMÉ STUDIOS is available as a brand and that you have rights to use the name and logo.
- Replace sample products with your actual products and licensed images.
- Update prices, sizes, garment details, inventory, shipping/returns, privacy, terms, and contact information.
- Configure sales tax as required for your business. This starter does not automatically calculate tax.
- Connect an order fulfillment process and a newsletter provider if needed.
- Use Stripe test mode first. Stripe processing fees apply to successful payments; hosting may remain within the free tier subject to current limits.
