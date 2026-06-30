# claimed.

Paste a link to something you want. Log what you save toward it. Get told the
moment you can afford it.

This README is written like a checklist — follow it top to bottom and you'll
go from "a folder of code" to "a live website that can take real payments
into your Ethiopian bank account." Nothing here costs money until the very
last optional step (and even that one's optional).

---

## 0. What you need before starting

- A free GitHub account (to hold the code)
- A free Vercel account (to host the website) — sign up at vercel.com with GitHub
- A free Supabase account (the database) — sign up at supabase.com
- A free Chapa account (to get paid) — sign up at dashboard.chapa.co

None of these need a credit card. You only deal with Chapa's identity
verification once you're ready to accept real money — everything else works
today, for free, forever.

---

## 1. Put the code on GitHub

1. Create a new, empty repository on GitHub (no README, no .gitignore — just empty).
2. On your own computer, inside this folder, run:
   ```
   git init
   git add .
   git commit -m "first commit"
   git branch -M main
   git remote add origin <the URL GitHub gave you>
   git push -u origin main
   ```

---

## 2. Set up the database (Supabase) — free

1. Create a new project at supabase.com (any name, any region close to you).
2. Once it's ready, go to the **SQL Editor** tab.
3. Open `sql/schema.sql` from this project, copy the whole thing, paste it in,
   and click **Run**. This creates every table the app needs and makes sure
   one person can never see another person's goals.
4. Go to **Settings > API**. You'll need three values for the next step:
   - `Project URL`
   - `anon public` key
   - `service_role` key (click "reveal" — keep this one secret, never put it
     in any file that gets committed to GitHub)
5. Go to **Authentication > Providers** and confirm Email is enabled (it is
   by default). Optionally, under **Authentication > Settings**, you can turn
   off "Confirm email" if you want people to start their trial instantly
   without checking their inbox first.

---

## 3. Set up payments (Chapa) — free to start

1. Register at dashboard.chapa.co.
2. Leave the dashboard in **Test Mode** for now (toggle, bottom left). You can
   build and click through the entire payment flow with fake test cards
   before any real money is involved.
3. Go to **Settings > API** and copy your **Secret Key** (test key for now).
4. For the monthly plan: go to **Plans** in the dashboard, click **New plan**,
   name it "Monthly", set the interval to **monthly** and the amount to
   **2.99 USD**. Copy the Plan ID it gives you.
5. When you're ready to take real money: go to **Compliance** in the Chapa
   dashboard and submit your ID + TIN/business info. This is a National Bank
   of Ethiopia requirement for every licensed payment company, not a Chapa
   thing — it usually takes a few days. Once approved, flip to **Live Mode**
   and copy your *live* secret key instead of the test one.

---

## 4. Connect the keys

1. Copy `.env.example` to a new file called `.env.local`.
2. Fill in every value:
   - The three Supabase values from step 2
   - `CHAPA_SECRET_KEY` and `CHAPA_MONTHLY_PLAN_ID` from step 3
   - `ADMIN_PASSWORD` — make this a real, private password. This is what
     protects your control room at `/admin` — anyone with this password can
     see every user and override their billing status, so don't reuse a
     password from anywhere else.
   - `NEXT_PUBLIC_SITE_URL` — leave as `http://localhost:3000` for now
3. For push notifications ("you can afford it now" alerts), run:
   ```
   npm install
   npm run gen:vapid
   ```
   and paste the two keys it prints into `.env.local`.

---

## 5. Run it on your own computer

```
npm install
npm run dev
```

Open `http://localhost:3000`. Sign up, paste a product link, log some
savings, watch the ticket fill in. Try the `/billing` page with Chapa's test
cards (Chapa's docs list test card numbers under Testing). Try `/admin` with
your `ADMIN_PASSWORD`.

If link-pasting fails on a site (Amazon blocks this kind of automated
reading often), that's expected — the manual "enter it by hand" fallback is
there for exactly that.

---

## 6. Go live (free hosting)

1. Go to vercel.com, click **New Project**, and import the GitHub repo from
   step 1.
2. Before clicking Deploy, open **Environment Variables** and paste in every
   value from your `.env.local` — except set `NEXT_PUBLIC_SITE_URL` to the
   `https://your-project-name.vercel.app` URL Vercel shows you (you can
   update this after the first deploy once you know the real URL).
3. Click **Deploy**. In a minute or two, your app is live at that URL, for
   free, with no app store and no review process.
4. Back in your Chapa dashboard, set the webhook URL (under your account/API
   settings) to:
   `https://your-project-name.vercel.app/api/chapa/webhook`
   This is how Chapa tells your app "this person paid" or "this subscription
   failed" so it can lock or unlock their account automatically.

---

## 7. Switch payments to live and start getting paid

1. Finish Chapa's Compliance verification (step 3.5) if you haven't.
2. Swap `CHAPA_SECRET_KEY` in Vercel's environment variables for your *live*
   secret key, and redeploy.
3. Real payments now land in your Chapa balance. From the Chapa dashboard,
   go to **Withdraw** (or Settlement), link your Ethiopian bank account, and
   transfer your balance whenever you like.

---

---

## 8. Show up when people search for it (Google) + let people "download" it

**Being installable is already built in.** Since this is a PWA, not an
app-store app: on a phone, visiting the site shows an "Add to Home Screen"
option. On a laptop/desktop in Chrome or Edge, an install icon shows up right
in the address bar — clicking it installs it like a real app, own window, own
icon, no browser chrome. Nothing extra to do for that part once it's live.

**Showing up in Google search results** takes a few more steps:

1. After deploying (step 6), go to
   [Google Search Console](https://search.google.com/search-console), add
   your site (the Vercel URL or your custom domain), and verify ownership
   (Google walks you through this — usually a DNS record or a meta tag).
2. Once verified, submit your sitemap: `your-url.com/sitemap.xml` — this
   project already generates one automatically (`app/sitemap.js`).
3. Click "Request indexing" on your homepage URL inside Search Console. This
   tells Google to come look at your site now instead of waiting for it to
   stumble across it on its own.

**One honest thing to know:** "claimed" is a normal English word — Google
already has millions of pages using it (dictionaries, other brands, etc.). A
brand-new site will not outrank all of that for the single word "claimed"
any time soon, no matter what we do technically. Two things that actually
help:
- **Buying a domain that matches the name closely** (e.g. `claimed.app` or
  similar) so people can just type it directly instead of searching —
  domains are roughly $10-20/year, the only real cost in this whole project
  if you choose to do it.
- **Sharing the exact link directly** (social posts, Reddit, etc. — see the
  promotion ideas from earlier) gets you real visitors immediately, while
  Google indexing happens quietly in the background over the following
  weeks.

## How the pieces fit together

- **The trial**: every new signup gets a `trial_ends_at` set to 3 days from
  now, automatically, in the database. `lib/access.js` is the one place that
  decides if someone is `trial`, `active`, or `locked` — nothing else
  duplicates that logic.
- **Getting paid**: `/billing` calls `/api/chapa/init`, which asks Chapa for
  a checkout link and redirects the person to it. They can pay with a card,
  telebirr, CBE Birr, or whatever Chapa offers — you don't have to build
  support for each one yourself.
- **Getting cut off if they don't pay**: Chapa calls your
  `/api/chapa/webhook` automatically when a subscription payment fails. That
  route flips `is_subscribed` to false, which locks them out next time
  `lib/access.js` checks.
- **The control room** (`/admin`): a separate password, not tied to anyone's
  account, that lists every signup and lets you manually extend a trial,
  mark someone paid (handy for refunds, friends, or if a payment glitches),
  or lock an account.
- **Notifications**: when someone logs enough savings to hit their goal,
  `app/api/goals/[id]/savings/route.js` sends a real push notification
  through the browser — no third-party notification service needed.
  Remember: on iPhone, this only works if the person added the site to
  their home screen first (Apple's rule, not this app's).

## A few honest limits, so nothing surprises you

- Automated link-reading works well on stores with proper product tags, and
  is unreliable on big retailers like Amazon that actively block this kind
  of request. The manual entry fallback exists because of this — it isn't a
  bug.
- This is a from-scratch build, not a battle-tested platform — test the
  payment flow thoroughly in Chapa's test mode before flipping to live.
- Treat `ADMIN_PASSWORD` and the Supabase `service_role` key like the keys to
  your bank account. Never commit `.env.local` to GitHub (it's already
  excluded by default in this setup).
