# ChrisCronan.com

Personal site for Chris Cronan. Plain HTML and CSS, ready for GitHub Pages.

## Local preview

```bash
python3 -m http.server 8080 --directory .
```

Then open http://127.0.0.1:8080/

The companion redirect site lives in `../chriscronan-cc-redirect/` and points every visit at https://chriscronan.com.

## Before going live

- The book interest form posts to Buttondown (`chriscronan`).
- The contact form posts to Formspree. `Chris@chriscronan.com` remains the visible mailto fallback (mailbox still needs to be set up).
- Replace the three portfolio cards with public, approved examples of past work.
- Point DNS at GitHub Pages only after the repository and Pages site are ready. Do not change DNS from this folder alone.
