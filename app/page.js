import Link from "next/link";
import BubbleText from "./BubbleText";

export default function Home() {
  return (
    <main className="min-h-screen px-6 py-16 md:py-24">
      <div className="mx-auto max-w-5xl">
        <header className="flex items-center justify-between mb-20">
          <BubbleText as="span" text="claimed." className="font-mono text-lg tracking-tight" />
          <nav className="flex gap-6 text-sm font-mono items-center">
            <Link href="/login" className="hover:text-claim">
              log in
            </Link>
            <Link
              href="/signup"
              className="px-4 py-1.5 bg-claim text-paper rounded-sm hover:opacity-80 transition-opacity"
            >
              start free
            </Link>
          </nav>
        </header>

        <section className="grid md:grid-cols-2 gap-16 items-center mb-28">
          <div>
            <BubbleText
              as="p"
              text="No.0001 — A SAVINGS TICKET"
              className="font-mono text-sm text-claim mb-4 tracking-wide block"
            />
            <h1 className="text-5xl md:text-6xl font-extrabold leading-[1.05] mb-6">
              <BubbleText as="span" text="Paste a link." className="block" />
              <BubbleText as="span" text="Watch the gap close." className="block" />
            </h1>
            <BubbleText
              as="p"
              text="Drop in anything you want — a link, a price, a photo. Log what you save toward it. The moment the math works out, we tell you. No more guessing if today's the day."
              className="text-lg text-ink-soft mb-8 max-w-md block"
            />
            <div className="flex items-center gap-4">
              <Link
                href="/signup"
                className="px-6 py-3 bg-ink text-claim border border-claim rounded-sm font-mono text-sm hover:bg-claim hover:text-paper transition-colors"
              >
                start your first goal →
              </Link>
              <BubbleText
                as="span"
                text="free for 3 days"
                className="text-sm text-ink-soft font-mono"
              />
            </div>
          </div>

          <div className="space-y-6">
            <DemoTicket title="Sony WH-1000XM5" saved={214} target={349.99} />
            <ClaimedTicket title="A week in Switzerland" />
          </div>
        </section>

        <section className="mb-28">
          <BubbleText
            as="p"
            text="HOW IT WORKS"
            className="font-mono text-sm text-ink-soft mb-10 tracking-wide block"
          />
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
          <BubbleText as="p" text="PRICING" className="font-mono text-sm text-ink-soft mb-2 block" />
          <div className="flex flex-wrap items-baseline gap-3 mb-4">
            <BubbleText as="span" text="$29.99" className="text-3xl font-extrabold" />
            <BubbleText as="span" text="once, keep it forever" className="text-ink-soft" />
            <BubbleText as="span" text="or" className="text-ink-soft mx-2" />
            <BubbleText as="span" text="$2.99" className="text-3xl font-extrabold" />
            <BubbleText as="span" text="/month" className="text-ink-soft" />
          </div>
          <BubbleText
            as="p"
            text="Every plan starts with 3 free days, no card required. See your first ticket fill in before you pay for anything."
            className="text-ink-soft max-w-lg block"
          />
        </section>

        <BubbleText
          as="footer"
          text="claimed. — built for the next thing you want."
          className="font-mono text-xs text-ink-soft"
        />
      </div>
    </main>
  );
}

function Step({ n, title, body }) {
  return (
    <div>
      <BubbleText as="p" text={n} className="font-mono text-claim text-sm mb-3 block" />
      <BubbleText as="h3" text={title} className="font-bold text-lg mb-2 block" />
      <BubbleText as="p" text={body} className="text-ink-soft text-sm leading-relaxed block" />
    </div>
  );
}

function DemoTicket({ title, saved, target }) {
  const pct = Math.min(100, Math.round((saved / target) * 100));
  return (
    <div className="ticket px-6 py-6 mx-2">
      <div className="flex justify-between items-start mb-4">
        <div>
          <BubbleText as="p" text="GOAL No.0001" className="font-mono text-xs text-ink-soft mb-1 block" />
          <BubbleText as="p" text={title} className="font-bold block" />
        </div>
        <BubbleText as="p" text={`$${target.toFixed(2)}`} className="font-mono text-sm" />
      </div>
      <div className="ticket-divider mb-4" />
      <div className="flex justify-between font-mono text-xs text-ink-soft mb-2">
        <BubbleText as="span" text={`SAVED $${saved.toFixed(2)}`} />
        <BubbleText as="span" text={`${pct}%`} />
      </div>
      <div className="h-3 bg-paper-dim rounded-sm overflow-hidden">
        <div className="h-full bg-claim bar-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function ClaimedTicket({ title }) {
  return (
    <div className="ticket px-6 py-6 mx-2 relative overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <div>
          <BubbleText as="p" text="GOAL No.0002" className="font-mono text-xs text-ink-soft mb-1 block" />
          <BubbleText as="p" text={title} className="font-bold block" />
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
