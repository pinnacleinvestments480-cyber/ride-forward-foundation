# Ride Forward Foundation — Website

A program of **The Genius Foundation** (501(c)(3)). A modern five-page static site:
Home, About, Sponsor, Donate, Contact.

**Tagline:** Building Stronger Kids Through BMX & Mountain Bike Racing.

## Tech
- Static HTML / CSS / JS — no build step, no dependencies.
- Fonts: Archivo (display) + Inter (body) via Google Fonts.
- Light & dark mode with a header toggle.
- Fully responsive (mobile menu under 720px).

## File structure
```
index.html      Home
about.html      About / mission / values / program / transparency
sponsor.html    Sponsorship tiers ($500–$10,000+)
donate.html     One-time & monthly giving + membership tiers
contact.html    Contact form + FAQ
assets/
  style.css     Design system + all styles
  main.js       Theme toggle, mobile menu, scroll reveal, progress bar, donate UI
  img/          hero, program, community, donate photos
```

## ⚠️ Connect your donation link
All donate/join buttons currently point to the placeholder **`RFF_DONATE_LINK`**.
Replace it with your real Stripe or PayPal donation URL:

1. Open `donate.html` (and the homepage CTAs if desired).
2. Find every occurrence of `RFF_DONATE_LINK`.
3. Replace it with your link, e.g. `https://donate.stripe.com/xxxxxxxx` or `https://www.paypal.com/donate/?hosted_button_id=XXXX`.

Quick find-and-replace across the project:
```bash
grep -rl RFF_DONATE_LINK . | xargs sed -i 's#RFF_DONATE_LINK#https://YOUR-DONATE-URL#g'
```

## Other placeholders to update
- **Email:** `hello@rideforwardfoundation.org` (Sponsor + Contact pages) → your real address.
- **Fundraising progress:** `$18,400` / `37%` in `index.html` and `donate.html` (search `data-pct`).
- **Location:** Surfside Beach, SC on the Contact page.

## Local preview
Open `index.html` in a browser, or run:
```bash
python3 -m http.server 8000
```
then visit http://localhost:8000
