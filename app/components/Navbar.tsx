"use client"

import React, { useState } from "react"

interface NavbarProps {
  searchQuery: string
  onSearchChange: (q: string) => void
  totalDeals: number
  totalFree: number
}

const SOCIAL_LINKS = [
  {
    name: "Twitch",
    url: "https://twitch.tv/franciseureka",
    badge: "LIVE",
    badgeColor: "bg-purple-500 text-white",
    hoverColor: "hover:text-purple-400 hover:border-purple-500/50",
    icon: (
      <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    url: "https://www.youtube.com/@franciseureka",
    hoverColor: "hover:text-red-400 hover:border-red-500/50",
    icon: (
      <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    name: "Discord",
    url: "https://discord.gg/h2qMvV264T",
    badge: "VIP",
    badgeColor: "bg-indigo-500 text-white",
    hoverColor: "hover:text-indigo-400 hover:border-indigo-500/50",
    icon: (
      <svg className="w-4 h-4 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    ),
  },
  {
    name: "WhatsApp",
    url: "https://chat.whatsapp.com/G4f13oF0z0L4GZ24HhOq4w",
    badge: "OFERTAS",
    badgeColor: "bg-emerald-500 text-slate-950",
    hoverColor: "hover:text-emerald-400 hover:border-emerald-500/50",
    icon: (
      <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
      </svg>
    ),
  },
  {
    name: "Kick",
    url: "https://kick.com/franciseureka",
    hoverColor: "hover:text-emerald-400 hover:border-emerald-500/50",
    icon: (
      <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.333 0H4.667C2.089 0 0 2.089 0 4.667v14.666C0 21.911 2.089 24 4.667 24h14.666C21.911 24 24 21.911 24 19.333V4.667C24 2.089 21.911 0 19.333 0zm-5.748 18.006h-2.912l-2.45-5.385v5.385H5.435V5.994h2.788v5.334l2.42-5.334h2.902l-3.374 6.818 3.414 5.194z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/franciseureka",
    hoverColor: "hover:text-pink-400 hover:border-pink-500/50",
    icon: (
      <svg className="w-4 h-4 text-pink-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    name: "TikTok",
    url: "https://www.tiktok.com/@franciseureka",
    hoverColor: "hover:text-cyan-400 hover:border-cyan-500/50",
    icon: (
      <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
  },
]

export default function Navbar({
  searchQuery,
  onSearchChange,
  totalDeals,
  totalFree,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#060913]/90 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.6)]">
      {/* Barra de Status ao Vivo Gamer */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-950 to-indigo-950/60 border-b border-white/[0.04] px-4 py-1.5 text-[11px] text-slate-300">
        <div className="max-w-[1920px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 font-bold text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              AO VIVO
            </span>
            <span className="hidden sm:inline text-slate-400">•</span>
            <span className="hidden sm:inline text-slate-300">
              <strong className="text-white font-semibold">{totalDeals}</strong> Ofertas Ativas Hoje
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-emerald-300 font-semibold">
              🎁 <strong>{totalFree}</strong> Jogos Grátis para Resgatar
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-400">
            <span className="hidden md:inline text-[10px] tracking-wide uppercase text-slate-400">
              Comunidade Oficial Francis Eureka
            </span>
            <a
              href="https://discord.gg/h2qMvV264T"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <span>Entrar no Discord</span>
              <span>→</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand & Logo com Efeito Gamer */}
        <div className="flex items-center gap-3.5 shrink-0">
          <a href="#" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-indigo-500 opacity-70 blur-sm group-hover:opacity-100 group-hover:blur transition duration-300"></div>
              <div className="relative w-11 h-11 rounded-full bg-slate-950 border-2 border-emerald-400 overflow-hidden flex items-center justify-center shadow-lg">
                <img
                  src="/logo.webp"
                  alt="Logo Ofertas do Eureka"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://gaming-cdn.com/images/favicon/favicon.png"
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-black tracking-tight text-white group-hover:text-emerald-400 transition-colors leading-none flex items-center gap-1.5">
                Ofertas do Eureka
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block shadow-[0_0_8px_#22c55e]"></span>
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-400 mt-1">
                Portal Gamer Oficial de Promoções
              </span>
            </div>
          </a>
        </div>

        {/* Central Search Bar Integrada */}
        <div className="flex-1 max-w-xl hidden md:block">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar jogos, lojas parceiras ou títulos grátis..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900/90 border border-white/[0.08] focus:border-emerald-500/80 focus:bg-slate-900 text-slate-100 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition-colors"
                title="Limpar busca"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Right Side: Social Media Hub Integrado */}
        <div className="hidden lg:flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-semibold text-slate-400 mr-1 uppercase tracking-wider">
            Canais:
          </span>
          {SOCIAL_LINKS.map((item) => (
            <a
              key={item.name}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              title={item.name}
              className={`relative p-2 rounded-xl bg-slate-900/80 border border-white/[0.06] ${item.hoverColor} hover:bg-slate-800/80 hover:-translate-y-0.5 transition-all duration-200 shadow-sm flex items-center gap-1.5`}
            >
              {item.icon}
              {item.badge && (
                <span className={`text-[9px] font-black px-1 rounded ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </a>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl bg-slate-900 border border-white/[0.08] text-slate-300 hover:text-white"
            aria-label="Abrir menu de redes sociais"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Search & Social Dropdown */}
      <div className={`md:hidden px-4 pb-4 pt-2 border-t border-white/[0.06] bg-[#080c18] ${mobileMenuOpen ? "block" : "hidden"}`}>
        <div className="mb-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Pesquisar jogos ou lojas..."
            className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="grid grid-cols-4 gap-2">
          {SOCIAL_LINKS.map((item) => (
            <a
              key={item.name}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 hover:text-white gap-1"
            >
              {item.icon}
              <span className="text-[10px] font-medium">{item.name}</span>
            </a>
          ))}
        </div>
      </div>
    </header>
  )
}
