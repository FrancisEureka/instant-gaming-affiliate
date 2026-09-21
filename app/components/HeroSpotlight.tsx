"use client"

import React from "react"
import { DealItem } from "./GameCard"

interface HeroSpotlightProps {
  featuredDeal?: DealItem
  deals: DealItem[]
  onSelectCategory: (cat: string) => void
}

export default function HeroSpotlight({
  featuredDeal,
  deals,
  onSelectCategory,
}: HeroSpotlightProps) {
  // Top ticker deals
  const tickerDeals = Array.isArray(deals) ? deals.slice(0, 10) : []

  return (
    <div className="w-full relative overflow-hidden mb-8">
      {/* Marquee Ticker de Ofertas Relâmpago */}
      <div className="w-full bg-[#050813] border-b border-white/[0.06] py-2 overflow-hidden flex items-center relative">
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#050813] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#050813] to-transparent z-10 pointer-events-none"></div>

        <div className="flex items-center gap-2 px-4 shrink-0 bg-[#050813] text-emerald-400 border-r border-emerald-500/30 text-[11px] font-black uppercase tracking-wider z-20 shadow-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          RADAR DE OFERTAS:
        </div>

        <div className="animate-marquee flex items-center gap-8 text-xs text-slate-300 font-medium">
          {tickerDeals.concat(tickerDeals).map((d, i) => (
            <a
              key={i}
              href={d.affiliate_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 hover:text-emerald-400 transition-colors whitespace-nowrap"
            >
              <span className="font-bold text-white">{d.title}</span>
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-black ${
                  d.is_free
                    ? "bg-emerald-500 text-slate-950"
                    : "bg-amber-400/90 text-slate-950"
                }`}
              >
                {d.is_free ? "GRÁTIS" : `-${d.discount}%`}
              </span>
              <span className="text-emerald-400 font-bold">{d.final_price_formatted}</span>
              <span className="text-[10px] text-slate-400 uppercase">({d.store_name})</span>
              <span className="text-slate-400">•</span>
            </a>
          ))}
        </div>
      </div>

      {/* Hero Showcase Container */}
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0c1222] via-[#080d1a] to-[#0a1020] border border-white/[0.08] p-6 sm:p-10 lg:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.7)]">
          {/* Ambient Cyber Neon Orbs */}
          <div className="absolute top-0 right-1/4 -mt-20 w-96 h-96 rounded-full bg-emerald-500/15 blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-10 -mb-20 w-96 h-96 rounded-full bg-indigo-600/15 blur-[100px] pointer-events-none"></div>
          <div className="absolute -top-10 -left-10 w-72 h-72 rounded-full bg-cyan-500/10 blur-[80px] pointer-events-none"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content (Hero Info) */}
            <div className="lg:col-span-7 flex flex-col items-start">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
                <span className="text-sm">🔥</span> Portal Oficial da Comunidade Francis Eureka
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08]">
                As Melhores Ofertas de <br />
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  Games & Jogos Grátis
                </span>
              </h1>

              <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                Descubra descontos de até <strong>95%</strong> e resgates permanentes nas lojas oficiais: <strong>Instant Gaming, Humble Store, Fanatical, Eneba, G2A, Epic Games</strong> e <strong>Steam</strong>. Preços checados em tempo real pelo bot.
              </p>

              {/* Action Buttons & Quick Filters */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onSelectCategory("free")}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-[0_0_25px_rgba(16,185,129,0.35)] hover:shadow-[0_0_35px_rgba(16,185,129,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                >
                  <span>🎁 Ver Jogos 100% Grátis</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-950/20 text-xs font-black">
                    {deals.filter((d) => d.is_free).length}
                  </span>
                </button>

                <button
                  onClick={() => onSelectCategory("super_deals")}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white border border-white/[0.12] hover:border-amber-400/50 font-bold text-sm hover:-translate-y-0.5 transition-all duration-200 shadow-md"
                >
                  <span>🔥 Super Descontos (-70%+)</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="mt-8 pt-6 border-t border-white/[0.06] grid grid-cols-2 sm:grid-cols-4 gap-4 w-full text-slate-400 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold text-base">✓</span>
                  <span>100% Chaves Oficiais</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold text-base">✓</span>
                  <span>Menores Preços BRL</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold text-base">✓</span>
                  <span>Radar Multiloja</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold text-base">✓</span>
                  <span>Sem Custos Extras</span>
                </div>
              </div>
            </div>

            {/* Right Content (Spotlight Card) */}
            {featuredDeal && (
              <div className="lg:col-span-5 w-full">
                <div className="relative group rounded-2xl overflow-hidden bg-[#0a0f1d] border-2 border-emerald-500/40 p-4 sm:p-5 shadow-[0_10px_40px_rgba(0,0,0,0.8)] hover:shadow-[0_0_40px_rgba(16,185,129,0.25)] hover:border-emerald-400 transition-all duration-300">
                  {/* Glowing Spotlight Header */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[11px] font-black uppercase tracking-wider">
                      ⭐ Destaque do Dia
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">
                      Na {featuredDeal.store_name}
                    </span>
                  </div>

                  {/* Image Container with Badge */}
                  <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-slate-900 shadow-inner">
                    <img
                      src={featuredDeal.image}
                      alt={featuredDeal.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1d] via-transparent to-black/30"></div>

                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-3 py-1 rounded-lg bg-emerald-500 text-slate-950 font-black text-sm uppercase shadow-lg">
                        {featuredDeal.is_free ? "100% GRÁTIS" : `-${featuredDeal.discount}%`}
                      </span>
                    </div>

                    <div className="absolute bottom-2 left-2.5">
                      <span className="text-[10px] font-bold text-slate-200 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-700">
                        {featuredDeal.platform}
                      </span>
                    </div>
                  </div>

                  {/* Spotlight Info & Action */}
                  <div className="mt-4 flex flex-col gap-3">
                    <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                      {featuredDeal.title}
                    </h3>

                    <div className="flex items-center justify-between pt-2 border-t border-white/[0.08]">
                      <div className="flex flex-col">
                        {!featuredDeal.is_free && featuredDeal.original_price > 0 && (
                          <span className="text-xs text-slate-400 line-through">
                            {featuredDeal.original_price_formatted}
                          </span>
                        )}
                        <span className="text-2xl font-black text-emerald-400 leading-none">
                          {featuredDeal.final_price_formatted}
                        </span>
                      </div>

                      <a
                        href={featuredDeal.affiliate_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/30 hover:scale-105 active:scale-100 transition-all duration-200"
                      >
                        <span>{featuredDeal.is_free ? "RESGATAR AGORA" : "PEGAR OFERTA"}</span>
                        <span>→</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
