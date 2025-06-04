import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClientBody } from "./ClientBody";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Elite Escort - Элитное эскорт-сопровождение премиум класса",
    template: "%s | Elite Escort"
  },
  description: "Элитное эскорт-сопровождение премиум класса. Красивые девушки для деловых встреч, светских мероприятий и частного общения.",
  keywords: ["элитное эскорт", "эскорт сопровождение", "vip эскорт", "премиум эскорт", "деловое сопровождение"],
  authors: [{ name: "Elite Escort" }],
  creator: "Elite Escort",
  publisher: "Elite Escort",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: process.env.NEXT_PUBLIC_SITE_DOMAIN,
    title: "Elite Escort - Элитное эскорт-сопровождение",
    description: "Элитное эскорт-сопровождение премиум класса. Красивые девушки для деловых встреч и светских мероприятий.",
    siteName: "Elite Escort",
  },
  twitter: {
    card: "summary_large_image",
    title: "Elite Escort - Элитное эскорт-сопровождение",
    description: "Элитное эскорт-сопровождение премиум класса",
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_DOMAIN,
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Structured Data для SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Elite Escort",
              "description": "Элитное эскорт-сопровождение премиум класса",
              "url": process.env.NEXT_PUBLIC_SITE_DOMAIN,
              "logo": `${process.env.NEXT_PUBLIC_SITE_DOMAIN}/logo.png`,
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "availableLanguage": ["Russian", "English"]
              }
            })
          }}
        />
      </head>
      <ClientBody className={inter.className}>
        {children}
      </ClientBody>
    </html>
  );
}
