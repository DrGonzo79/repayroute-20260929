import type {Metadata} from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RepayRoute — turn a loan notice into a next-step brief",
  description: "A deterministic prototype for understanding student-loan payment changes and preparing questions for a servicer."
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return <html lang="en"><body>{children}</body></html>;
}
