"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, CheckCircle2 } from "lucide-react";
import Script from "next/script";
import { useEffect, useState } from "react";
import {
  CONVERSIONS,
  getLeadUser,
  reportConversion,
  setUserData,
  takePendingLead,
  toE164AU,
} from "@/lib/tracking";

const BOOKING_URL = "https://api.leadconnectorhq.com/widget/booking/T4ADkzxyjZE9CYS4MQ7k";

// GHL's official embed script passes the iframe's URL params into the calendar, which
// prefills its form from them (the consent box stays for the patient to tick).
function bookingUrlFor(user: { name?: string; email?: string; phone?: string } | null): string {
  if (!user) return BOOKING_URL;
  const params = new URLSearchParams();
  const [first, ...rest] = (user.name || "").trim().split(/\s+/);
  if (first) params.set("first_name", first);
  if (rest.length) params.set("last_name", rest.join(" "));
  if (user.email) params.set("email", user.email.trim());
  const phone = user.phone ? toE164AU(user.phone) : "";
  if (phone) params.set("phone", phone);
  const qs = params.toString();
  return qs ? `${BOOKING_URL}?${qs}` : BOOKING_URL;
}

const GHL_ORIGINS = ["https://api.leadconnectorhq.com", "https://x.activeflow.io", "https://link.msgsndr.com"];

// GHL's "set-sticky-contacts" message carries the booker's details as a JSON string.
function contactFromGhl(data: unknown): { email?: string; phone?: string } | null {
  if (!Array.isArray(data)) return null;
  for (const part of data) {
    if (typeof part !== "string" || !part.startsWith("{")) continue;
    try {
      const c = JSON.parse(part);
      if (c && (c.email || c.phone)) return { email: c.email, phone: c.phone };
    } catch {
      // not JSON
    }
  }
  return null;
}

export default function VoucherCode() {
  // The calendar only renders once GHL's embed script is ready (it answers the
  // calendar's request for params) and we've read the patient's details.
  const [embedReady, setEmbedReady] = useState(false);
  const [bookingSrc, setBookingSrc] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBookingSrc(bookingUrlFor(getLeadUser()));
  }, []);

  useEffect(() => {
    // Form lead: fire once, only when arriving from a successful submit.
    const lead = takePendingLead();
    if (lead) {
      setUserData(lead);
      reportConversion(CONVERSIONS.leadForm, lead.leadId);
    }

    let booked = false;
    const onMessage = (e: MessageEvent) => {
      if (!GHL_ORIGINS.includes(e.origin) || !Array.isArray(e.data)) return;
      const [eventName, payload] = e.data as [string, Record<string, string> | undefined];

      if (eventName === "set-sticky-contacts") {
        const contact = contactFromGhl(e.data);
        if (contact) setUserData(contact);
      }

      if (eventName === "msgsndr-booking-complete" && !booked) {
        booked = true;
        const user = getLeadUser();
        if (user) setUserData(user);
        reportConversion(CONVERSIONS.booking, payload?.fingerprint || undefined);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8faff]">
      {/* Header */}
      <header className="bg-[#0d2577]">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 lg:px-8">
          <a href="/" className="flex items-center">
            <img
              src="https://assets.guestsnapper.com/wedding-gallery-media/innervate%20chiro%20darkmode.webp"
              alt="Innervate Chiro"
              className="h-16 w-auto"
            />
          </a>
          <a href="tel:+61481882278">
            <Button className="h-12 gap-2 rounded-full bg-[#ff9b36] px-4 hover:bg-[#e88520] sm:px-6">
              <Phone className="h-5 w-5" />
              <span className="hidden sm:inline">(04) 8188 2278</span>
            </Button>
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-2xl">
          {/* Voucher Card */}
          <Card className="mb-10 overflow-hidden border-0 shadow-xl">
            <div
              className="px-6 py-8 text-center text-white"
              style={{
                background: "linear-gradient(135deg, #0d2577 0%, #1a3a9e 50%, #3a5aaa 100%)"
              }}
            >
              <div className="mb-2 flex items-center justify-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-[#ff9b36]" />
                <p className="text-lg font-medium text-white/90">Here is your voucher code!</p>
              </div>
              <div className="my-6 rounded-xl bg-white/10 px-6 py-4 backdrop-blur-sm">
                <p className="font-mono text-5xl font-bold tracking-wider text-[#ff9b36] md:text-6xl">
                  21POINT
                </p>
              </div>
              <p className="text-white/80">
                Let our team know this code and we&apos;ll apply the discount for you!
              </p>
            </div>
            <CardContent className="bg-white p-6 text-center">
              <p className="mb-4 text-lg font-semibold text-[#0d2577]">
                Call (04) 8188 2278 to Book!
              </p>
              <a href="tel:+61481882278">
                <Button className="h-14 w-full gap-2 rounded-full bg-[#ff9b36] px-8 text-base font-semibold text-white hover:bg-[#e88520] sm:w-auto">
                  <Phone className="h-5 w-5" />
                  Call Now
                </Button>
              </a>
            </CardContent>
          </Card>

          {/* Booking Section */}
          <div className="text-center">
            <h2 className="mb-6 font-serif text-2xl italic text-[#0d2577] md:text-3xl">
              Or book your consultation instantly below:
            </h2>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-0">
                {embedReady && bookingSrc ? (
                  <iframe
                    src={bookingSrc}
                    style={{ width: "100%", border: "none", overflow: "hidden", minHeight: "600px" }}
                    scrolling="no"
                    id="msgsndr-calendar"
                  />
                ) : (
                  <div style={{ minHeight: "600px" }} />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0d2577] py-8 text-center text-white">
        <div className="container mx-auto px-4">
          <p className="text-sm text-white/50">
            &copy; {new Date().getFullYear()} Innervate Chiro. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Booking Widget Script */}
      {/* GHL's official embed script: resizes the calendar and passes it the prefill params. */}
      <Script
        src="https://link.msgsndr.com/js/form_embed.js"
        strategy="afterInteractive"
        onReady={() => setEmbedReady(true)}
        onError={() => setEmbedReady(true)}
      />
    </div>
  );
}
