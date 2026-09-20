"use client"

import React, { useState } from "react"

export interface DealItem {
  id: string
  steam_app_id?: string
  title: string
  store: string
  store_name: string
  store_color: string
  store_badge: string
  discount: number
  original_price: number
  original_price_formatted: string
  final_price: number
  final_price_formatted: string
  image: string
  affiliate_url: string
  all_store_links?: Record<string, string>
  is_free: boolean
  is_historical_low: boolean
  badge_label: string
  platform: string
  end_date?: string
}

interface GameCardProps {
  deal: DealItem
}

const STORE_LABELS: Record<string, { name: string; color: string }> = {
  instant_gaming: { name: "Instant Gaming", color: "#FF7F00" },
  humble_store: { name: "Humble Store", color: "#CB2727" },
  fanatical: { name: "Fanatical", color: "#FF6B00" },
  eneba: { name: "Eneba", color: "#5928E5" },
  g2a: { name: "G2A", color: "#F05A28" },
}

export default function GameCard({ deal }: GameCardProps) {
  const [showStores, setShowStores] = useState(false)
  const isFree = deal.is_free

  return (
    <div className="group relative bg-[#0e131d]/90 hover:bg-[#131926] border border-slate-800/80 hover:border-emerald-500/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-[0_0_25px_rgba(34,197,94,0.15)] transition-all duration-300 flex flex-col">
      {/* Cover Image Container */}
      <div className="relative w-full aspect-[16/9] bg-slate-900 overflow-hidden">
        <img
          src={deal.image}
          alt={deal.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            // Fallback para imagem padrão se der erro
            (e.target as HTMLImageElement).src = "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/440/header.jpg"
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e131d] via-transparent to-black/40"></div>

        {/* Discount Badge (Top Left) */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-black tracking-wider uppercase shadow-md ${
              isFree
                ? "bg-emerald-500 text-slate-950 font-black animate-pulse"
                : deal.discount >= 75
                ? "bg-amber-400 text-slate-950 font-black"
                : "bg-emerald-500 text-slate-950 font-black"
            }`}
          >
            {isFree ? "100% OFF" : `-${deal.discount}%`}
          </span>
        </div>

        {/* Highlight Badge (Top Right) */}
        {deal.badge_label && (
          <div className="absolute top-2.5 right-2.5 z-10">
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase backdrop-blur-md shadow-md ${
                deal.badge_label === "MENOR HISTÓRICO"
                  ? "bg-indigo-600/90 text-indigo-100 border border-indigo-400/40"
                  : deal.badge_label === "100% GRÁTIS"
                  ? "bg-emerald-600/90 text-emerald-100 border border-emerald-400/40"
                  : "bg-slate-900/80 text-slate-300 border border-slate-700/50"
              }`}
            >
              {deal.badge_label}
            </span>
          </div>
        )}

        {/* Platform Pill (Bottom Left overlay) */}
        <div className="absolute bottom-2 left-2.5 z-10">
          <span className="text-[10px] font-semibold text-slate-300 bg-slate-950/70 backdrop-blur-md px-2 py-0.5 rounded border border-slate-800">
            {deal.platform}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Store Origin */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${deal.store_badge}`}>
              {deal.store_name}
            </span>
            {deal.end_date && (
              <span className="text-[10px] text-amber-400/90 font-medium">
                ⏳ {deal.end_date}
              </span>
            )}
          </div>

          {/* Game Title */}
          <h3
            className="text-sm font-bold text-slate-100 group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug"
            title={deal.title}
          >
            {deal.title}
          </h3>
        </div>

        {/* Price & Action Section */}
        <div className="pt-2 border-t border-slate-800/80 mt-auto flex flex-col gap-2.5">
          <div className="flex items-end justify-between">
            <div className="flex flex-col">
              {!isFree && deal.original_price > 0 && (
                <span className="text-[11px] text-slate-400 line-through">
                  {deal.original_price_formatted}
                </span>
              )}
              <span
                className={`text-lg font-black tracking-tight leading-none ${
                  isFree ? "text-emerald-400 text-xl" : "text-emerald-400"
                }`}
              >
                {deal.final_price_formatted}
              </span>
            </div>

            {/* Primary CTA Button */}
            <a
              href={deal.affiliate_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              <span>{isFree ? "Resgatar" : "Ver Oferta"}</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>

          {/* Partner Stores Comparator Toggle (For Paid Deals) */}
          {!isFree && deal.all_store_links && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowStores(!showStores)}
                className="w-full text-[10px] text-slate-400 hover:text-slate-300 py-1 flex items-center justify-between border-t border-slate-800/40 transition-colors"
              >
                <span>Comparar em outras lojas:</span>
                <span className="text-emerald-400 font-bold">
                  {showStores ? "▲ Ocultar" : "▼ 5 Lojas"}
                </span>
              </button>

              {showStores && (
                <div className="grid grid-cols-2 gap-1.5 pt-1.5 pb-1">
                  {Object.entries(deal.all_store_links).map(([sKey, sUrl]) => {
                    const storeData = STORE_LABELS[sKey]
                    if (!storeData) return null
                    return (
                      <a
                        key={sKey}
                        href={sUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] px-2 py-1 rounded bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-between transition-colors"
                      >
                        <span className="truncate">{storeData.name}</span>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: storeData.color }} />
                      </a>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
