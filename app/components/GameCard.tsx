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
  is_expired?: boolean
  is_price_changed?: boolean
  previous_price_formatted?: string
  is_bot_posted?: boolean
  status?: "active" | "expired" | "price_changed"
}

interface GameCardProps {
  deal: DealItem
}

const STORE_META: Record<string, { name: string; color: string }> = {
  instant_gaming: { name: "Instant Gaming", color: "#FF7F00" },
  green_man_gaming: { name: "Green Man Gaming", color: "#00D166" },
  humble_store: { name: "Humble Store", color: "#CB2727" },
  fanatical: { name: "Fanatical", color: "#FF6B00" },
  eneba: { name: "Eneba", color: "#8a5cf6" },
  g2a: { name: "G2A", color: "#F05A28" },
}

export default function GameCard({ deal }: GameCardProps) {
  const [showRadar, setShowRadar] = useState(false)
  const [copied, setCopied] = useState(false)
  const isFree = deal.is_free
  const isExpired = Boolean(deal.is_expired)
  const isPriceChanged = Boolean(deal.is_price_changed)

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    navigator.clipboard.writeText(deal.affiliate_url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <article
      itemScope
      itemType="https://schema.org/Product"
      className={`group relative rounded-2xl border transition-all duration-300 flex flex-col overflow-hidden ${
        isExpired
          ? "bg-[#080b14]/80 border-rose-900/30 opacity-85 hover:opacity-100 hover:border-rose-700/50"
          : "bg-[#090e1a]/95 hover:bg-[#0d1424] border-white/[0.08] hover:border-emerald-500/70 hover:shadow-[0_0_30px_rgba(16,185,129,0.25)] hover:-translate-y-1.5"
      }`}
    >
      {/* Schema.org hidden SEO data */}
      <meta itemProp="name" content={deal.title} />
      <meta itemProp="image" content={deal.image} />
      <div itemProp="offers" itemScope itemType="https://schema.org/Offer" className="hidden">
        <meta itemProp="priceCurrency" content="BRL" />
        <meta itemProp="price" content={String(deal.final_price)} />
        <link itemProp="availability" href={isExpired ? "https://schema.org/OutOfStock" : "https://schema.org/InStock"} />
      </div>

      {/* Media & Cover Section */}
      <div className="relative w-full aspect-[16/9] bg-slate-950 overflow-hidden">
        <img
          src={deal.image}
          alt={`Capa do jogo ${deal.title}`}
          loading="lazy"
          className={`w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 ${
            isExpired ? "grayscale-[60%] opacity-70" : ""
          }`}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/440/header.jpg"
          }}
        />

        {/* Ambient Dark Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090e1a] via-transparent to-black/40"></div>

        {/* SELO TOP LEFT: Desconto OU Selo de Esgotado/Expirado */}
        <div className="absolute top-2 left-2 z-10">
          {isExpired ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black tracking-wider uppercase bg-rose-600 text-white shadow-lg shadow-rose-600/40">
              <span>🛑</span> ESGOTADO
            </span>
          ) : (
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-black tracking-wider uppercase shadow-lg ${
                isFree
                  ? "bg-emerald-400 text-slate-950 animate-pulse shadow-emerald-400/50"
                  : deal.discount >= 75
                  ? "bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-black shadow-amber-400/30"
                  : "bg-emerald-500 text-slate-950 font-black shadow-emerald-500/30"
              }`}
            >
              {isFree ? "100% OFF" : `-${deal.discount}%`}
            </span>
          )}
        </div>

        {/* SELO TOP RIGHT: Preço Alterado, Menor Histórico ou Encerrado */}
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1.5">
          {isExpired ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black tracking-wide uppercase bg-slate-950/90 text-rose-400 border border-rose-500/40 shadow-md">
              ENCERRADO
            </span>
          ) : isPriceChanged ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black tracking-wide uppercase bg-amber-400 text-slate-950 shadow-md shadow-amber-400/40 animate-pulse">
              <span>🔄</span> PREÇO ALTERADO
            </span>
          ) : deal.badge_label ? (
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase backdrop-blur-md shadow-md ${
                deal.badge_label === "MENOR HISTÓRICO"
                  ? "bg-indigo-600/90 text-indigo-100 border border-indigo-400/40"
                  : deal.badge_label === "100% GRÁTIS"
                  ? "bg-emerald-600/90 text-emerald-100 border border-emerald-400/40"
                  : "bg-slate-950/80 text-slate-300 border border-white/[0.1]"
              }`}
            >
              {deal.badge_label}
            </span>
          ) : null}

          <button
            onClick={handleCopy}
            title="Copiar link direto da oferta"
            aria-label="Copiar link direto da oferta"
            className="p-1 rounded-md bg-slate-950/80 hover:bg-emerald-500 text-slate-300 hover:text-slate-950 border border-white/[0.12] transition-colors shadow"
          >
            {copied ? (
              <span className="text-[10px] font-bold px-1 text-emerald-400">✓ Copiado!</span>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>
        </div>

        {/* Bottom Platform Tag */}
        <div className="absolute bottom-2 left-2 z-10">
          <span className="text-[10px] font-bold text-slate-300 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded border border-white/[0.08]">
            {deal.platform}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Store & Expiration Badge */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${deal.store_badge}`}
            >
              {deal.store_name}
            </span>
            {deal.end_date && (
              <span className={`text-[10px] font-semibold ${isExpired ? "text-rose-400 line-through" : "text-amber-400/90"}`}>
                ⏳ {deal.end_date}
              </span>
            )}
          </div>

          {/* Game Title */}
          <h3
            className={`text-xs sm:text-sm font-bold transition-colors line-clamp-2 leading-snug ${
              isExpired ? "text-slate-400 group-hover:text-rose-300" : "text-slate-100 group-hover:text-emerald-400"
            }`}
            title={deal.title}
          >
            {deal.title}
          </h3>

          {/* Aviso contextual de preço alterado */}
          {isPriceChanged && deal.previous_price_formatted && (
            <p className="text-[10px] text-amber-400/90 font-medium mt-1">
              ⚠️ Preço anterior: {deal.previous_price_formatted}
            </p>
          )}

          {/* Aviso contextual de oferta encerrada */}
          {isExpired && (
            <p className="text-[10px] text-rose-400/90 font-semibold mt-1">
              ⚠️ Promoção finalizada ou chaves esgotadas
            </p>
          )}
        </div>

        {/* Price & Action Block */}
        <div className="pt-2 border-t border-white/[0.06] mt-auto flex flex-col gap-2.5">
          <div className="flex items-end justify-between">
            <div className="flex flex-col">
              {!isFree && deal.original_price > 0 && (
                <span className="text-[10px] text-slate-400 line-through">
                  {deal.original_price_formatted}
                </span>
              )}
              <span
                className={`text-base sm:text-lg font-black tracking-tight leading-none ${
                  isExpired
                    ? "text-slate-400 text-sm line-through"
                    : isFree
                    ? "text-emerald-400 text-lg"
                    : "text-emerald-400"
                }`}
              >
                {isExpired ? "FINALIZADO" : deal.final_price_formatted}
              </span>
            </div>

            {/* Primary CTA Button */}
            <a
              href={deal.affiliate_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Ver oferta de ${deal.title}`}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all duration-200 ${
                isExpired
                  ? "bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/[0.08]"
                  : "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105 active:scale-95"
              }`}
            >
              <span>{isExpired ? "Ver Loja" : isFree ? "Resgatar" : "Ver Oferta"}</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>

          {/* Multi-Store Radar */}
          {deal.all_store_links && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowRadar(!showRadar)}
                className="w-full text-[10px] text-slate-400 hover:text-slate-200 py-1 flex items-center justify-between border-t border-white/[0.04] transition-colors"
                aria-expanded={showRadar}
              >
                <span className="flex items-center gap-1">
                  <span className={isExpired ? "text-slate-400" : "text-emerald-400"}>⚡</span>
                  <span>Radar Multiloja:</span>
                </span>
                <span className={isExpired ? "text-slate-400 font-bold" : "text-emerald-400 font-bold"}>
                  {showRadar ? "▲ Ocultar" : "▼ Comparar Lojas"}
                </span>
              </button>

              {showRadar && (
                <div className="grid grid-cols-2 gap-1.5 pt-1.5 pb-1">
                  {Object.entries(deal.all_store_links).map(([sKey, sUrl]) => {
                    const storeData = STORE_META[sKey]
                    if (!storeData) return null
                    return (
                      <a
                        key={sKey}
                        href={sUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] px-2 py-1 rounded-lg bg-slate-950/80 hover:bg-slate-900 border border-white/[0.06] text-slate-300 hover:text-white flex items-center justify-between transition-colors"
                      >
                        <span className="truncate">{storeData.name}</span>
                        <span
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: storeData.color }}
                        />
                      </a>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
