"use client"

import { useEffect, useState } from "react"
import sbjs from "sourcebuster"

export interface SourcebusterData {
  // Current visit
  channel: string
  source: string
  medium: string
  campaign: string
  content: string
  term: string
  gclid: string
  // First visit
  firstSource: string
  firstMedium: string
  firstCampaign: string
  // Session
  visits: string
  pagesSeen: string
  // Page
  landingPage: string
  leadPage: string
  referer: string
}

function deriveChannelFromSourcebuster(
  type: string,
  source: string,
  medium: string
): string {
  const src = (source || "").toLowerCase()
  const mdm = (medium || "").toLowerCase()
  const typ = (type || "").toLowerCase()

  if (typ === "utm") {
    if (mdm === "cpc" || mdm === "ppc") return "Paid Search"
    if (mdm === "social" || mdm === "paid_social") return "Paid Social"
    if (mdm === "display" || mdm === "banner") return "Display"
    if (mdm === "email") return "Email"
  }

  if (typ === "organic") return "Organic Search"

  if (typ === "referral") {
    if (
      src.includes("facebook") ||
      src.includes("instagram") ||
      src.includes("linkedin") ||
      src.includes("twitter")
    ) {
      return "Organic Social"
    }
    return "Referral"
  }

  return "Direct"
}

function extractGclidFromUrl(url: string): string {
  if (!url) return ""
  try {
    const urlObj = new URL(url)
    return urlObj.searchParams.get("gclid") || ""
  } catch {
    return ""
  }
}

export function useSourcebuster(): SourcebusterData | null {
  const [data, setData] = useState<SourcebusterData | null>(null)

  useEffect(() => {
    // Initialize Sourcebuster
    sbjs.init({
      lifetime: 6,
      session_length: 30,
      timezone_offset: 10,
    })

    // Get the data
    const sbjsData = sbjs.get

    if (sbjsData) {
      const channel = deriveChannelFromSourcebuster(
        sbjsData.current?.typ || "",
        sbjsData.current?.src || "",
        sbjsData.current?.mdm || ""
      )

      const gclid = extractGclidFromUrl(sbjsData.current_add?.ep || "")

      setData({
        // Current visit
        channel,
        source: sbjsData.current?.src || "",
        medium: sbjsData.current?.mdm || "",
        campaign: sbjsData.current?.cmp || "",
        content: sbjsData.current?.cnt || "",
        term: sbjsData.current?.trm || "",
        gclid,
        // First visit
        firstSource: sbjsData.first?.src || "",
        firstMedium: sbjsData.first?.mdm || "",
        firstCampaign: sbjsData.first?.cmp || "",
        // Session
        visits: sbjsData.udata?.vst || "1",
        pagesSeen: sbjsData.session?.pgs || "1",
        // Page
        landingPage: sbjsData.current_add?.ep || "",
        leadPage: typeof window !== "undefined" ? window.location.href : "",
        referer: sbjsData.current_add?.rf || "",
      })
    }
  }, [])

  return data
}
