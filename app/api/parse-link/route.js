export async function POST(request) {
  const { url } = await request.json();

  if (!url || !/^https?:\/\//i.test(url)) {
    return Response.json({ error: "That doesn't look like a link." }, { status: 400 });
  }

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
      // Some stores redirect a lot — follow them.
      redirect: "follow",
    });

    if (!res.ok) {
      return Response.json(
        { error: "fallback", reason: `Site responded with ${res.status}` },
        { status: 200 }
      );
    }

    const html = await res.text();

    const title =
      clean(matchMeta(html, "og:title")) || clean(matchTag(html, "title")) || null;
    const image = matchMeta(html, "og:image");

    let price = matchMeta(html, "product:price:amount") || matchMeta(html, "og:price:amount");
    if (!price) {
      const priceMatch = html.match(/[$£€]\s?(\d{1,5}(?:[.,]\d{2})?)/);
      price = priceMatch ? priceMatch[1].replace(",", "") : null;
    }

    if (!title && !price) {
      // Plenty of big retailers (Amazon especially) block server-side fetches.
      return Response.json(
        { error: "fallback", reason: "Couldn't read that page automatically." },
        { status: 200 }
      );
    }

    return Response.json({
      title,
      image,
      price: price ? parseFloat(price) : null,
      url,
    });
  } catch (err) {
    return Response.json(
      { error: "fallback", reason: "Couldn't reach that link." },
      { status: 200 }
    );
  }
}

function matchMeta(html, property) {
  const patterns = [
    new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${property}["']`, "i"),
    new RegExp(`<meta[^>]+name=["']${property}["'][^>]+content=["']([^"']+)["']`, "i"),
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m) return m[1];
  }
  return null;
}

function matchTag(html, tag) {
  const m = html.match(new RegExp(`<${tag}[^>]*>([^<]+)</${tag}>`, "i"));
  return m ? m[1] : null;
}

function clean(str) {
  if (!str) return null;
  return str
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .trim()
    .slice(0, 140);
}
