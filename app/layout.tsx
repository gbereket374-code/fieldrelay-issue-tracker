import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import { FieldRelayProvider } from "@/components/provider";
import { Shell } from "@/components/shell";
import "./globals.css";

const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex",
});

export const metadata: Metadata = {
  title: "FieldRelay",
  description: "An offline-first field issue tracker that works anywhere, even where there's no signal.",
  applicationName: "FieldRelay",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icon.svg" },
  appleWebApp: { capable: true, title: "FieldRelay" },
};

export const viewport: Viewport = {
  themeColor: "#0f2744",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${plex.variable} antialiased`}>
        <FieldRelayProvider>
          <Shell>{children}</Shell>
        </FieldRelayProvider>
      </body>
    </html>
  );
}
