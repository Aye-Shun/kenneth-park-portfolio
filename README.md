# Kenneth Park

My resume and project page. Plain HTML, CSS, and JavaScript, with a small animated terminal.

[Open the website](https://aye-shun.github.io/kenneth-park-portfolio/)

## Run locally

From this folder:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Visit <http://127.0.0.1:8000>. There is no install or build step.

`index.html` has the content, `styles.css` handles the layout, and `app.js` handles the terminal reveal, section highlighting, and email copy button. A public resume copy, with the phone number removed, is in `assets/Kenneth-Park-Resume.pdf`.

The page adapts to small screens and respects reduced-motion preferences. Email copying falls back to showing the address if clipboard access fails.

To check the JavaScript:

```sh
node --check app.js
```

GitHub Actions checks the JavaScript and deploys the static files to GitHub Pages. The page has no contact form, accounts, or backend; project and contact links point to their existing destinations.

[MIT](LICENSE)
