import type { Metadata, Viewport } from "next"
import "./globals.css"

export const viewport: Viewport = {
  themeColor: "#07090e",
  width: "device-width",
  initialScale: 1,
}

export const metadata: Metadata = {
  title: "Eureka Gaming - As Melhores Promoções e Jogos Grátis para PC",
  description:
    "Encontre as melhores promoções, menores preços históricos em chaves Steam e jogos 100% gratuitos para resgate permanente. Parceiro oficial Instant Gaming, Humble Store, Fanatical, Eneba e G2A.",
  keywords: [
    "Eureka Gaming",
    "Jogos Grátis",
    "Promoções Steam",
    "Instant Gaming Afiliado",
    "Humble Bundle",
    "Fanatical",
    "Eneba",
    "G2A",
    "Desconto em Jogos",
    "Menor Preço PC",
  ],
  authors: [{ name: "Eureka Gaming" }],
  openGraph: {
    title: "Eureka Gaming - As Melhores Promoções e Jogos Grátis",
    description:
      "Descontos de até 90% em chaves digitais para PC e jogos 100% grátis todos os dias!",
    url: "https://eureka-gaming.vercel.app",
    siteName: "Eureka Gaming",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eureka Gaming - As Melhores Promoções e Jogos Grátis",
    description:
      "Descontos de até 90% em chaves digitais para PC e jogos 100% grátis todos os dias!",
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
