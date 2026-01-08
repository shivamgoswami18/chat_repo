import "primereact/resources/themes/lara-light-green/theme.css";
import "primereact/resources/primereact.min.css";
import "./globals.css";
import ToastProvider from "@/components/ToastProvider";
import { Outfit } from "next/font/google";
import ReduxProvider from "@/lib/store/ReduxProvider";
import { PrimeReactProvider } from "primereact/api";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

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
