import type { Metadata } from "next";
import { Merriweather_Sans, Playfair_Display } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { TrackingProvider } from "@/components/tracking-provider";
import { GOOGLE_ADS_ID } from "@/lib/tracking";

const merriweatherSans = Merriweather_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Innervate Chiro | Brisbane Chiropractor Woolloongabba | $37 New Patient Special",
  description: "Brisbane's trusted chiropractor in Woolloongabba. Get a comprehensive consultation, chiropractic exam & x-rays for just $37 (normally $145). Over 110+ 5-star Google reviews. Call (07) 3059 9945.",
  keywords: "chiropractor brisbane, woolloongabba chiropractor, back pain brisbane, neck pain treatment, sciatica brisbane, Dr Matt chiropractor",
  openGraph: {
    title: "Innervate Chiro | $37 New Patient Special",
    description: "Get a comprehensive chiropractic consultation, exam & x-rays for just $37. Brisbane's trusted chiropractor with 110+ 5-star reviews.",
    locale: "en_AU",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <Script
          src="//cdn.dni.nimbata.com/56902072856.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-ads-tag" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
gtag('config', '${GOOGLE_ADS_ID}', { allow_enhanced_conversions: true });`}
        </Script>
      </head>
      <body
        className={`${merriweatherSans.variable} ${playfair.variable} antialiased`}
      >
        <TrackingProvider />
        {children}
      </body>
    </html>
  );
}
