import "primereact/resources/themes/lara-light-green/theme.css";
import "primereact/resources/primereact.min.css";
import "./globals.css";
import ToastProvider from "@/components/ToastProvider";
import { Outfit } from "next/font/google";
import ReduxProvider from "@/lib/store/ReduxProvider";
import { PrimeReactProvider } from "primereact/api";
import type { Metadata } from "next";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Prosjektmarkedet",
  description: "Prosjektmarkedet - Project Marketplace Platform",
  manifest: "/manifest.json",
  themeColor: "#ffffff",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Prosjektmarkedet",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Prosjektmarkedet",
    title: "Prosjektmarkedet",
    description: "Prosjektmarkedet - Project Marketplace Platform",
  },
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/icon-192x192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} antialiased`}
        suppressHydrationWarning
      >
        <ReduxProvider>
          <PrimeReactProvider>
            <ToastProvider />
            {children}
          </PrimeReactProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
