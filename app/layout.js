import "./globals.css";
import IntroAnimation from "./IntroAnimation";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
const title = "claimed. — save toward the thing you actually want";
const description =
  "Paste a link to anything you want. claimed. tracks the price, tracks what you've saved, and tells you the moment you can afford it.";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  manifest: "/manifest.json",
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: "claimed.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
};

export const viewport = {
  themeColor: "#0c1f33",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Manrope:wght@400;500;700;800&display=swap"
          rel="stylesheet"
        />
        <link rel="apple-touch-icon" href="/icons/icon.svg" />
      </head>
      <body>
        <IntroAnimation />
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function () {
                  navigator.serviceWorker.register('/sw.js').catch(function () {});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
