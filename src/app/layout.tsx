import type { Metadata } from "next";
import { Merriweather_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

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
      <body
        className={`${merriweatherSans.variable} ${playfair.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
