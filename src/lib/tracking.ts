// Google Ads conversion tracking helpers (account 192-795-9198).

export const GOOGLE_ADS_ID = "AW-11282338404";

export const CONVERSIONS = {
  leadForm: `${GOOGLE_ADS_ID}/v1ugCImO_6MdEOSk64Mq`,
  booking: `${GOOGLE_ADS_ID}/cy6TCIyO_6MdEOSk64Mq`,
  phoneTap: `${GOOGLE_ADS_ID}/jj6tCI-O_6MdEOSk64Mq`,
} as const;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

function gtag(...args: unknown[]) {
  if (typeof window === "undefined") return;
  if (!window.gtag) {
    // Same stub as the Google tag snippet; gtag.js only reads `arguments` objects from the queue.
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
  }
  window.gtag(...args);
}

// Australian numbers to E.164 (+61...), as enhanced conversions expects.
export function toE164AU(raw: string): string {
  const digits = (raw || "").replace(/[^\d+]/g, "");
  if (!digits) return "";
  if (digits.startsWith("+")) return digits;
  if (digits.startsWith("61")) return `+${digits}`;
  if (digits.startsWith("0")) return `+61${digits.slice(1)}`;
  return `+61${digits}`;
}

export interface LeadUserData {
  email?: string;
  phone?: string;
}

// Enhanced conversions: Google hashes these before sending.
export function setUserData({ email, phone }: LeadUserData) {
  const data: Record<string, string> = {};
  if (email) data.email = email.trim().toLowerCase();
  const tel = phone ? toE164AU(phone) : "";
  if (tel) data.phone_number = tel;
  if (Object.keys(data).length) gtag("set", "user_data", data);
}

export function reportConversion(sendTo: string, transactionId?: string) {
  gtag("event", "conversion", {
    send_to: sendTo,
    value: 1.0,
    currency: "AUD",
    ...(transactionId ? { transaction_id: transactionId } : {}),
  });
}

// ---- Click IDs (gclid / gbraid / wbraid), kept 90 days for offline uploads ----

const CLICK_ID_KEY = "ic_click_ids";
const CLICK_ID_TTL_MS = 90 * 24 * 60 * 60 * 1000;

export interface ClickIds {
  gclid: string;
  gbraid: string;
  wbraid: string;
}

export function captureClickIds() {
  if (typeof window === "undefined") return;
  try {
    const p = new URLSearchParams(window.location.search);
    const found = {
      gclid: p.get("gclid") || "",
      gbraid: p.get("gbraid") || "",
      wbraid: p.get("wbraid") || "",
    };
    if (found.gclid || found.gbraid || found.wbraid) {
      localStorage.setItem(CLICK_ID_KEY, JSON.stringify({ ...found, ts: Date.now() }));
    }
  } catch {
    // Storage blocked: the URL value is still read at submit time.
  }
}

export function getClickIds(): ClickIds {
  const empty = { gclid: "", gbraid: "", wbraid: "" };
  if (typeof window === "undefined") return empty;
  try {
    const raw = localStorage.getItem(CLICK_ID_KEY);
    if (!raw) return empty;
    const v = JSON.parse(raw);
    if (Date.now() - (v.ts || 0) > CLICK_ID_TTL_MS) return empty;
    return { gclid: v.gclid || "", gbraid: v.gbraid || "", wbraid: v.wbraid || "" };
  } catch {
    return empty;
  }
}

// ---- Pending lead hand-off from the form to /voucher-code ----

const PENDING_KEY = "ic_pending_lead";
const USER_KEY = "ic_lead_user";

export interface PendingLead extends LeadUserData {
  leadId: string;
  name?: string;
}

export function savePendingLead(lead: PendingLead) {
  try {
    sessionStorage.setItem(PENDING_KEY, JSON.stringify(lead));
    sessionStorage.setItem(
      USER_KEY,
      JSON.stringify({ name: lead.name, email: lead.email, phone: lead.phone })
    );
  } catch {
    // ignore
  }
}

// Returns the pending lead once, then clears it so refreshes don't recount.
export function takePendingLead(): PendingLead | null {
  try {
    const raw = sessionStorage.getItem(PENDING_KEY);
    if (!raw) return null;
    sessionStorage.removeItem(PENDING_KEY);
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getLeadUser(): (LeadUserData & { name?: string }) | null {
  try {
    const raw = sessionStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function newLeadId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
