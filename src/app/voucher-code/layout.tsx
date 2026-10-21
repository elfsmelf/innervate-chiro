import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Voucher | Innervate Chiro",
  robots: { index: false, follow: false },
};

export default function VoucherLayout({ children }: { children: React.ReactNode }) {
  return children;
}
