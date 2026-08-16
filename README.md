# SellFlow (MVP)

A working demo of a social-commerce dashboard: unified inbox, AI sales
assistant, orders, inventory, CRM and analytics — with simulated
WhatsApp/Instagram/Facebook conversations and simulated payments.

This project turns the chat prototype into a real website you can deploy
and share a link to.

## What you need before you start

1. **A GitHub account** (free) — github.com
2. **A Vercel account** (free) — vercel.com — sign up with your GitHub account, it's one click
3. **An Anthropic API key** (only needed if you want the AI assistant to actually reply — the rest of the app works without it) — console.anthropic.com/settings/keys

You do not need to install anything on your computer for the steps below —
everything happens in the browser. (If you'd rather use the command line,
see "Alternative: deploy from your computer" at the bottom.)

## Deploy in about 5 minutes

### 1. Put this code on GitHub
- Go to github.com → **New repository** → name it `sellflow` → Create.
- On the new repo's page, click **uploading an existing file** and drag in
  every file/folder from this project (keep the folder structure — `src/`,
  `api/`, `package.json`, etc. all at the top level).
- Commit the files.

### 2. Import it into Vercel
- Go to vercel.com/new
- Choose **Import** next to your new `sellflow` repo.
- Vercel will auto-detect it as a Vite project — leave the defaults.
- Before clicking Deploy, open **Environment Variables** and add:
  - Name: `ANTHROPIC_API_KEY`
  - Value: your key from console.anthropic.com
- Click **Deploy**.

### 3. Get your link
- After ~1 minute you'll get a URL like `sellflow-yourname.vercel.app`.
- That's it — send that link to anyone. It opens in any browser, on any
  device (phone, tablet, desktop), no install needed.

Every time you push new changes to GitHub, Vercel redeploys automatically.

## Alternative: deploy from your computer

If you have Node.js installed and prefer the command line:

```bash
npm install
npm run dev        # test locally at http://localhost:5173

npm install -g vercel
vercel              # follow the prompts, then:
vercel env add ANTHROPIC_API_KEY   # paste your key when asked
vercel --prod
```

## How the AI assistant works here

The browser never holds your Anthropic API key. Instead:

`Inbox / Analytics (browser)` → calls `/api/claude` → `api/claude.js`
(runs on Vercel's server, reads `ANTHROPIC_API_KEY` from environment
variables) → calls the real Anthropic API → returns just the reply text.

If you skip setting `ANTHROPIC_API_KEY`, everything else in the app (orders,
inventory, CRM, analytics, payment simulation) still works — the AI
assistant will show an "AI temporarily unavailable" message and you can
reply manually.

## What's simulated vs. real in this MVP

**Real:** the UI, all state changes (orders, inventory, CRM, analytics all
update live), and — if you add your API key — real calls to Claude for the
AI assistant.

**Simulated (by design, for demo purposes):** WhatsApp/Instagram/Facebook
connections (use the "Simulate customer" button instead of real accounts),
and payments (use "Simulate payment" instead of a real Paystack/Flutterwave
checkout). Wiring in real social accounts and a real payment provider
requires a proper backend with a database and webhook handlers — this
front-end is structured so that backend can be dropped in later without
changing the UI.

## Project structure

```
src/App.jsx       the whole application (UI + in-memory state)
src/main.jsx      React entry point
api/claude.js     serverless function that calls Anthropic securely
```
