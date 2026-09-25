import type { Metadata, Viewport } from "next"
import "./globals.css"

export const viewport: Viewport = {
  themeColor: "#060913",
  width: "device-width",
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL("https://eurekagaming.com.br"),
  title: "Ofertas do Eureka - As Melhores Promoções e Jogos Grátis para PC",
  description:
    "Ofertas e jogos grátis para PC selecionados pelo Francis Eureka. Economize até 95% em chaves Steam na Instant Gaming, Green Man Gaming, Humble e mais!",
  alternates: {
    canonical: "https://eurekagaming.com.br",
  },
  keywords: [
    "Ofertas do Eureka",
    "Francis Eureka",
    "Jogos Grátis",
    "Promoções Steam",
    "Green Man Gaming",
    "Instant Gaming Afiliado",
    "Humble Store",
    "Fanatical",
    "Eneba",
    "G2A",
    "Descontos Games",
    "Menor Preço PC",
  ],
  authors: [{ name: "Francis Eureka" }],
  icons: {
    icon: "/logo.webp",
    shortcut: "/logo.webp",
    apple: "/logo.webp",
  },
  openGraph: {
    title: "Ofertas do Eureka - As Melhores Promoções e Jogos Grátis",
    description:
      "Descontos de até 95% em chaves digitais para PC e jogos 100% grátis todos os dias!",
    url: "https://eurekagaming.com.br",
    siteName: "Ofertas do Eureka",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/logo.webp",
        width: 1024,
        height: 1024,
        alt: "Logo Ofertas do Eureka",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ofertas do Eureka - As Melhores Promoções e Jogos Grátis",
    description:
      "Descontos de até 95% em chaves digitais para PC e jogos 100% grátis todos os dias!",
    images: ["/logo.webp"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="dark h-full antialiased scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Rajdhani:wght@600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: `{"@context": "https://schema.org", "@graph": [{"@type": "WebSite", "@id": "https://eurekagaming.com.br/#website", "url": "https://eurekagaming.com.br", "name": "Ofertas do Eureka", "description": "Portal oficial de ofertas, menores preços e jogos gratuitos para PC da comunidade Francis Eureka.", "publisher": {"@id": "https://eurekagaming.com.br/#organization"}, "inLanguage": "pt-BR"}, {"@type": "Organization", "@id": "https://eurekagaming.com.br/#organization", "name": "Francis Eureka Gaming", "url": "https://eurekagaming.com.br", "logo": {"@type": "ImageObject", "url": "https://eurekagaming.com.br/logo.webp"}, "sameAs": ["https://www.youtube.com/@franciseureka", "https://twitch.tv/franciseureka", "https://discord.gg/h2qMvV264T", "https://kick.com/franciseureka", "https://www.instagram.com/franciseureka", "https://www.tiktok.com/@franciseureka"]}]}` }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#060913] text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  )
}
