"use client"

import React from "react"

interface SidebarProps {
  selectedStores: string[]
  onToggleStore: (store: string) => void
  selectedPriceFilter: string
  onSelectPriceFilter: (filter: string) => void
  isOpenMobile: boolean
  onCloseMobile: () => void
  totalDeals: number
  totalFree: number
}

const STORES = [
  { id: "instant_gaming", name: "Instant Gaming", color: "#FF7F00", dot: "bg-orange-500" },
  { id: "humble_store", name: "Humble Store", color: "#CB2727", dot: "bg-red-500" },
  { id: "fanatical", name: "Fanatical", color: "#FF6B00", dot: "bg-amber-500" },
  { id: "eneba", name: "Eneba", color: "#5928E5", dot: "bg-purple-500" },
  { id: "g2a", name: "G2A", color: "#F05A28", dot: "bg-rose-500" },
  { id: "epic_games", name: "Epic Games (Grátis)", color: "#0078F2", dot: "bg-blue-500" },
  { id: "steam", name: "Steam (PC)", color: "#1B2838", dot: "bg-slate-400" },
]

const PRICE_FILTERS = [
  { id: "all", label: "Qualquer Preço" },
  { id: "free", label: "🎁 Jogos 100% Grátis" },
  { id: "under10", label: "Abaixo de R$ 10" },
  { id: "under20", label: "Abaixo de R$ 20" },
  { id: "under50", label: "Abaixo de R$ 50" },
  { id: "historical_low", label: "⭐ Menor Histórico / Top" },
]

const SOCIAL_LINKS = [
  {
    name: "Discord",
    url: "https://discord.gg/h2qMvV264T",
    icon: (
      <svg className="w-5 h-5 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    ),
  },
  {
    name: "WhatsApp Ofertas",
    url: "https://chat.whatsapp.com/G4f13oF0z0L4GZ24HhOq4w",
    icon: (
      <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    url: "https://www.youtube.com/@franciseureka",
    icon: (
      <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/franciseureka",
    icon: (
      <svg className="w-5 h-5 text-pink-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
]

export default function Sidebar({
  selectedStores,
  onToggleStore,
  selectedPriceFilter,
  onSelectPriceFilter,
  isOpenMobile,
  onCloseMobile,
  totalDeals,
  totalFree,
}: SidebarProps) {
  const content = (
    <div className="flex flex-col h-full text-slate-200">
      {/* Brand & Profile Header */}
      <div className="flex flex-col items-center pb-6 border-b border-slate-800">
        <div className="relative group mb-3">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-indigo-500 opacity-75 blur-md group-hover:opacity-100 transition duration-300"></div>
          <div className="relative w-20 h-20 rounded-full bg-slate-900 border-2 border-emerald-400 overflow-hidden flex items-center justify-center shadow-xl">
            <img
              src="https://gaming-cdn.com/images/favicon/favicon.png"
              alt="Eureka Gaming"
              className="w-14 h-14 object-contain"
            />
          </div>
        </div>
        <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
          Eureka Gaming
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        </h1>
        <p className="text-xs text-slate-400 mt-0.5 text-center font-medium">
          As Melhores Promoções & Jogos Grátis
        </p>

        <div className="flex items-center gap-2 mt-3 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span>{totalDeals} Ofertas • {totalFree} Grátis</span>
        </div>
      </div>

      {/* Social Links */}
      <div className="py-4 border-b border-slate-800">
        <h2 className="text-[11px] uppercase tracking-wider font-bold text-slate-400 px-2 mb-2">
          Comunidade & Redes
        </h2>
        <div className="space-y-1">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all duration-200 border border-transparent hover:border-slate-700/50"
            >
              <span className="p-1 rounded-md bg-slate-900/60">{link.icon}</span>
              <span>{link.name}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Filters by Store */}
      <div className="py-4 border-b border-slate-800 flex-1">
        <div className="flex items-center justify-between px-2 mb-2">
          <h2 className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
            Lojas Parceiras
          </h2>
          {selectedStores.length > 0 && (
            <button
              onClick={() => onToggleStore("CLEAR_ALL")}
              className="text-[10px] text-emerald-400 hover:text-emerald-300 font-semibold"
            >
              Limpar
            </button>
          )}
        </div>
        <div className="space-y-1.5">
          {STORES.map((s) => {
            const isChecked = selectedStores.includes(s.id)
            return (
              <label
                key={s.id}
                className="flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${s.dot}`}></span>
                  <span className={isChecked ? "text-white font-semibold" : "text-slate-300"}>
                    {s.name}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onToggleStore(s.id)}
                  className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-950 cursor-pointer accent-emerald-500"
                />
              </label>
            )
          })}
        </div>
      </div>

      {/* Filters by Price */}
      <div className="py-4">
        <h2 className="text-[11px] uppercase tracking-wider font-bold text-slate-400 px-2 mb-2">
          Faixa de Preço
        </h2>
        <div className="space-y-1">
          {PRICE_FILTERS.map((f) => {
            const isActive = selectedPriceFilter === f.id
            return (
              <button
                key={f.id}
                onClick={() => onSelectPriceFilter(f.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? "bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20"
                    : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                }`}
              >
                {f.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-3 border-t border-slate-800/80 text-[10px] text-slate-400 text-center">
        <p>Links com afiliação oficial.</p>
        <p className="mt-0.5 text-slate-400">© 2026 Eureka Gaming</p>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar (Fixed Left) */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64 bg-[#0a0d14]/95 border-r border-slate-800/80 p-5 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent z-30 backdrop-blur-xl">
        {content}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <aside className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-[#0a0d14] border-r border-slate-800 p-5 overflow-y-auto z-50 shadow-2xl flex flex-col">
            <div className="flex justify-end pb-2">
              <button
                onClick={onCloseMobile}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {content}
          </aside>
        </div>
      )}
    </>
  )
}
