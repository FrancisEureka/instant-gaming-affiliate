"use client"

import React from "react"

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/[0.08] bg-[#050813] py-12 px-4 sm:px-6 lg:px-8 text-slate-400 text-xs mt-auto">
      <div className="max-w-[1920px] mx-auto flex flex-col items-center text-center gap-6">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-950 border-2 border-emerald-400/80 overflow-hidden flex items-center justify-center shadow-lg">
            <img
              src="/logo.webp"
              alt="Logo Ofertas do Eureka"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://gaming-cdn.com/images/favicon/favicon.png"
              }}
            />
          </div>
          <span className="text-base font-black text-white tracking-tight">
            Ofertas do Eureka
          </span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
            Oficial
          </span>
        </div>

        {/* Disclaimer Legal / Transparência */}
        <p className="max-w-2xl text-[11px] text-slate-400 leading-relaxed">
          O <strong>Ofertas do Eureka</strong> é o portal oficial de curadoria e comparação de promoções de games da comunidade <strong>Francis Eureka</strong>. Alguns links disponibilizados contêm afiliação oficial com as lojas parceiras (Instant Gaming, Humble Store, Fanatical, Eneba e G2A). Ao comprar através dos links, você apoia o criador e a comunidade sem nenhum custo adicional.
        </p>

        {/* Informações Finais */}
        <div className="pt-6 border-t border-white/[0.04] w-full flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-3">
          <p>© {new Date().getFullYear()} Ofertas do Eureka • Comunidade Francis Eureka. Todos os direitos reservados.</p>
          <p className="text-[10px] text-slate-400">Desenvolvido com tecnologia de alta performance para gamers de PC.</p>
        </div>
      </div>
    </footer>
  )
}
