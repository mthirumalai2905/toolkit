import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { getSiteUrl } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: "Thirumalai (@mthirumalai2905)",
  description:
    "Products, systems, interfaces, and the real-time web.",
  authors: [{ name: "Thirumalai" }],
  openGraph: {
    title: "Thirumalai",
    description:
      "Products, systems, interfaces, and the real-time web.",
    images: [
      {
        url: "/banner.jpg",
        width: 736,
        height: 414,
        alt: "A torii gate standing in still water",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Thirumalai",
    description:
      "Products, systems, interfaces, and the real-time web.",
    images: ["/banner.jpg"],
  },
};

const themeBoot = `(function(){try{var t=localStorage.getItem("portfolio-theme");if(t!=="light"&&t!=="dim"&&t!=="dark")t="dark";document.documentElement.setAttribute("data-theme",t);}catch(e){document.documentElement.setAttribute("data-theme","dark");}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-page font-sans text-ink">
        <Script id="theme-init" strategy="beforeInteractive">
          {themeBoot}
        </Script>
        {children}
      </body>
    </html>
  );
}
