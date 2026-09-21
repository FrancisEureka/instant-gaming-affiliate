import type { Metadata, Viewport } from "next"
import "./globals.css"

export const viewport: Viewport = {
  themeColor: "#07090e",
  width: "device-width",
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://eurekagaming.com.br'),
  title: "Ofertas do Eureka - As Melhores Promoções e Jogos Grátis para PC",
  description:
    "Portal oficial de ofertas de games da Comunidade Eureka. Economize até 90% em chaves Steam na Instant Gaming, Humble Store, Fanatical, Eneba e G2A, além de jogos 100% gratuitos todos os dias!",
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
      "Descontos de até 90% em chaves digitais para PC e jogos 100% grátis todos os dias!",
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
      "Descontos de até 90% em chaves digitais para PC e jogos 100% grátis todos os dias!",
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
      <body className="min-h-full flex flex-col bg-[#07090e] text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  )
}
