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
    "Portal oficial de ofertas de games da Comunidade Francis Eureka. Economize até 95% em chaves Steam na Instant Gaming, Humble Store, Fanatical, Eneba e G2A, além de jogos 100% gratuitos todos os dias!",
  keywords: [
    "Ofertas do Eureka",
    "Francis Eureka",
    "Jogos Grátis",
    "Promoções Steam",
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
      </head>
      <body className="min-h-full flex flex-col bg-[#060913] text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  )
}
