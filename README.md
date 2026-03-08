# impossible_ahh_xss

A tiny Node.js / Express comment board that demonstrates server-side XSS prevention.

## How it works

User input is sanitised with the [xss](https://github.com/leizongmin/js-xss) library
before being stored in memory. Dangerous tags and attributes (`<script>`, `onerror`, …)
are HTML-encoded so they can never execute in a browser.

The frontend uses DOM APIs (`textContent`, `createElement`) instead of `innerHTML` as an
additional defence-in-depth measure.

## Quick start

```bash
npm install
npm start          # http://localhost:3000
```

## Tests

```bash
npm test
```
