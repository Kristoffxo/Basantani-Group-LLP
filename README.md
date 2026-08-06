# Basantani Group LLP — Website

A fully built, animated, multi-page real estate website. Plain HTML, CSS and
JavaScript — no build step, no npm install, no framework.

---

## 1. Run it live in VS Code

1. Open VS Code → **File → Open Folder** → select this `website` folder.
2. Install the **Live Server** extension (by Ritwick Dey) from the Extensions panel
   if you don't already have it.
3. Right-click `index.html` in the file explorer → **Open with Live Server**.
4. Your browser opens at `http://127.0.0.1:5500`. Every time you save a file, the
   page reloads automatically.

**No VS Code?** From a terminal inside this folder run `python3 -m http.server 8000`
and open `http://localhost:8000`.

> Opening `index.html` by double-clicking works too, but the Google Maps embed and a
> couple of other things behave better over a local server. Use Live Server.

---

## 2. What's in the box

| File | Page |
|---|---|
| `index.html` | Home — cinematic hero, stats, services, featured projects, testimonials |
| `about.html` | About Us — story, mission, values, timeline, gallery |
| `services.html` | Services — six capabilities, five-step process |
| `projects.html` | Projects — filterable grid of 9 placeholder projects |
| `family.html` | **Family Tree** — animated, interactive, three generations |
| `team.html` | Leadership — Manoj, Aryan, plus wider team cards |
| `journal.html` | Journal / News — featured post plus 6 post cards |
| `contact.html` | Contact — validated form, details, map |
| `css/style.css` | The entire design system, commented section by section |
| `js/main.js` | Every animation and interaction, commented section by section |
| `js/img-fallback.js` | Shows a styled placeholder wherever a photo is missing |
| `images/` | Where all your photos go |

---

## 3. Adding your photos

**You don't need to touch any code.** Every image slot already points at a filename.
Drop a file with that exact name into the right folder and it appears. Until then you
see a grey placeholder telling you which filename it wants.

### Family photos → `images/family/`

| Filename | Person |
|---|---|
| `madan-basantani.jpg` | Madan Basantani (grandfather) |
| `asha-basantani.jpg` | Asha Basantani (grandmother) |
| `manoj-basantani.jpg` | Manoj Basantani (founder) |
| `richa-basantani.jpg` | Richa Basantani |
| `aryan-basantani.jpg` | Aryan Basantani (co-founder) |
| `iswiti-basantani.jpg` | Iswiti Basantani |
| `family-hero.jpg` | Wide banner at the top of the Family page |
| `family-portrait.jpg` | Portrait in the "Passing It On" section |
| `album-01.jpg` … `album-08.jpg` | Family gallery grid |

Family tree portraits are shown in a circle — **use roughly square photos** (1:1) so
nobody gets cropped oddly. 800×800px is plenty.

### Leadership photos → `images/team/`

`manoj-basantani.jpg`, `aryan-basantani.jpg`, `member-01.jpg` … `member-04.jpg`
Portrait orientation (3:4) works best here.

### Project photos → `images/projects/`

`projects-hero.jpg`, `project-01.jpg` … `project-09.jpg`
Landscape (4:3 or 16:9). 1600px wide is a good target.

### Hero / general → `images/hero/`

`hero-main.jpg` (the big home page hero — make this your best photo),
`about-hero.jpg`, `about-intro.jpg`, `about-story.jpg`, `why-us.jpg`,
`services-hero.jpg`, `services-feature.jpg`, `team-hero.jpg`, `contact-hero.jpg`,
`gallery-01.jpg` … `gallery-07.jpg`

Hero images should be wide and high-resolution — 2400×1400px or larger.

### Journal → `images/blog/`

`journal-hero.jpg`, `post-featured.jpg`, `post-01.jpg` … `post-06.jpg`

> **Tip:** keep every file under about 400 KB. Run them through
> [squoosh.app](https://squoosh.app) first — it makes the site load noticeably faster.

---

## 4. Things to change before going live

These are the placeholders that need your real information:

- **Phone number** — `+91 00000 00000` appears in every page footer, the mobile menu,
  and `contact.html`. Find and replace across all files.
- **Email** — `hello@basantanigroup.com`, same places.
- **Office address** — every footer plus `contact.html`.
- **Social links** — the `IG / IN / FB / WA` circles in each footer currently link to `#`.
- **Statistics** on the home page — the four numbers (3 generations, 12+ projects,
  250K+ sq ft, 100%) are guesses. Edit `data-count` and `data-suffix` in `index.html`.
- **Timeline years** in `about.html` — 1978, 2005, 2018, 2024 are placeholders.
- **Testimonials** on the home page — three placeholder quotes.
- **Project details** in `projects.html` — see the on-page guide at the bottom of that page.
- **Google Maps pin** in `contact.html` — replace the `src` on the `<iframe>` with your
  own embed link (Google Maps → Share → Embed a map).
- **Family bios** in `family.html` — each person has a `data-bio="…"` attribute. Edit
  the text inside the quotes.

---

## 5. Making the contact form actually send email

Right now the form validates properly but only simulates sending. Easiest fix, no
backend needed:

1. Sign up free at [formspree.io](https://formspree.io) and create a form. You'll get
   an endpoint like `https://formspree.io/f/xabcdefg`.
2. In `contact.html`, change the opening form tag to:
   ```html
   <form id="contact-form" action="https://formspree.io/f/YOUR_ID" method="POST" novalidate>
   ```
3. In `js/main.js`, find the **13. CONTACT FORM VALIDATION** section and delete the
   `e.preventDefault();` line — that lets the browser submit to Formspree normally.

Alternatives that work the same way: Web3Forms, Getform, Netlify Forms.

---

## 6. Changing the look

Everything visual is controlled by the variables at the very top of `css/style.css`
under **01. DESIGN TOKENS**. Change `--gold` and the whole site re-skins:

```css
--gold: #D4AF37;   /* accent colour */
--ink:  #08080A;   /* page background */
--text: #F4F2ED;   /* body text */
```

Fonts are loaded from Google Fonts in each page's `<head>` — Cormorant Garamond for
headings, Inter for body text.

---

## 7. What's animated

- Preloader with a real progress bar
- Custom gold cursor that grows over anything clickable (desktop only)
- Scroll progress bar across the top
- Hero image parallax + slow continuous zoom
- Line-by-line headline reveal
- Scroll-triggered reveals — fade up, slide left/right, scale, and a clip-path mask wipe
- Staggered card entrances
- Animated number counters
- Infinite marquee strip
- Project filtering with re-entry animation
- Auto-playing testimonial slider (pauses on hover)
- Click-to-enlarge lightbox on every gallery image
- **Family tree:** SVG connector lines that draw themselves, a pulsing ring on the
  founder, and a slide-in profile panel for each person
- Circular-wipe mobile menu
- Back-to-top button

All of it respects `prefers-reduced-motion`, so it degrades gracefully for anyone who
has motion sensitivity turned on in their OS.

---

## 8. Putting it online

The site is fully static, so hosting is free and takes minutes:

- **Netlify** — drag this folder onto [app.netlify.com/drop](https://app.netlify.com/drop)
- **Vercel** — `vercel` from inside the folder
- **GitHub Pages** — push the folder to a repo, then Settings → Pages → deploy from branch
- **Cloudflare Pages** — connect the repo, no build command needed

Then point `basantanigroup.com` (or whichever domain you buy) at it.

---

Built for Basantani Group LLP — Allahabad (Prayagraj).
