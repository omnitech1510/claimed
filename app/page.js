import Link from "next/link";
import BubbleText from "./BubbleText";

export default function Home() {
  return (
    <main className="min-h-screen px-6 py-16 md:py-24">
      <div className="mx-auto max-w-5xl">
        <header className="flex items-center justify-between mb-20">
          <span className="font-mono text-lg tracking-tight">claimed.</span>
          <nav className="flex gap-6 text-sm font-mono">
            <Link href="/login" className="hover:text-stamp">log in</Link>
            <Link
              href="/signup"
              className="px-4 py-1.5 bg-ink text-paper rounded-sm hover:bg-stamp transition-colors"
            >
              start free
            </Link>
          </nav>
        </header>

        <section className="grid md:grid-cols-2 gap-16 items-center mb-28">
          <div>
            <p className="font-mono text-sm text-stamp mb-4 tracking-wide">
              No.0001 — A SAVINGS TICKET
            </p>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-[1.05] mb-6">
              <BubbleText as="span" text="Paste a link." className="block" />
              <BubbleText as="span" text="Watch the gap close." className="block" />
            </h1>
            <p className="text-lg text-ink-soft mb-8 max-w-md">
              Drop in anything you want — a link, a price, a photo. Log what you
              save toward it. The moment the math works out, we tell you. No more
              guessing if today's the day.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/signup"
                className="px-6 py-3 bg-stamp text-paper rounded-sm font-mono text-sm hover:opacity-90 transition-opacity"
              >
                start your first goal →
              </Link>
              <span className="text-sm text-ink-soft font-mono">free for 3 days</span>
            </div>
          </div>

          <div className="space-y-6">
            <DemoTicket
              title="Sony WH-1000XM5"
              saved={214}
              target={349.99}
            />
            <ClaimedTicket title="A week in Switzerland" />
          </div>
        </section>

        <section className="mb-28">
          <p className="font-mono text-sm text-ink-soft mb-10 tracking-wide">HOW IT WORKS</p>
          <div className="grid md:grid-cols-3 gap-10">
            <Step
              n="01"
              title="Paste the link"
              body="Any product page. We read the name, photo, and price for you — or you type it in yourself, takes ten seconds either way."
            />
            <Step
              n="02"
              title="Log what you save"
              body="Every time you set money aside, add it. Watch the ticket fill in, deposit by deposit."
            />
            <Step
              n="03"
              title="Get claimed"
              body="The second your saved amount meets the price, we notify you. The ticket gets stamped. Go buy the thing."
            />
          </div>
        </section>

        <section className="ticket px-8 py-10 mb-20">
          <p className="font-mono text-sm text-ink-soft mb-2">PRICING</p>
          <div className="flex flex-wrap items-baseline gap-3 mb-4">
            <span className="text-3xl font-extrabold">$29.99</span>
            <span className="text-ink-soft">once, keep it forever</span>
            <span className="text-ink-soft mx-2">or</span>
            <span className="text-3xl font-extrabold">$2.99</span>
            <span className="text-ink-soft">/month</span>
          </div>
          <p className="text-ink-soft max-w-lg">
            Every plan starts with 3 free days, no card required. See your first
            ticket fill in before you pay for anything.
          </p>
        </section>

        <footer className="font-mono text-xs text-ink-soft">
          claimed. — built for the next thing you want.
        </footer>
      </div>
    </main>
  );
}

function Step({ n, title, body }) {
  return (
    <div>
      <p className="font-mono text-stamp text-sm mb-3">{n}</p>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-ink-soft text-sm leading-relaxed">{body}</p>
    </div>
  );
}

function DemoTicket({ title, saved, target }) {
  const pct = Math.min(100, Math.round((saved / target) * 100));
  return (
    <div className="ticket px-6 py-6 mx-2">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="font-mono text-xs text-ink-soft mb-1">GOAL No.0001</p>
          <p className="font-bold">{title}</p>
        </div>
        <p className="font-mono text-sm">${target.toFixed(2)}</p>
      </div>
      <div className="ticket-divider mb-4" />
      <div className="flex justify-between font-mono text-xs text-ink-soft mb-2">
        <span>SAVED ${saved.toFixed(2)}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-3 bg-paper-dim rounded-sm overflow-hidden">
        <div
          className="h-full bg-claim bar-fill"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function ClaimedTicket({ title }) {
  return (
    <div className="ticket px-6 py-6 mx-2 relative overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="font-mono text-xs text-ink-soft mb-1">GOAL No.0002</p>
          <p className="font-bold">{title}</p>
        </div>
      </div>
      <div className="ticket-divider mb-4" />
      <div className="flex justify-center py-2">
        <span className="stamp-claimed px-4 py-1 text-sm font-semibold uppercase rounded-sm">
          claimed
        </span>
      </div>
    </div>
  );
}
