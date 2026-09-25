"use client"

import React from "react"

interface FilterHUDProps {
  activeCategory: string
  onSelectCategory: (cat: string) => void
  selectedStores: string[]
  onToggleStore: (store: string) => void
  onClearStores: () => void
  selectedSort: string
  onSelectSort: (sort: string) => void
  storeCounts: Record<string, number>
  totalFiltered: number
  totalDeals: number
  onResetAll: () => void
}

const CATEGORIES = [
  { id: "all", label: "🎮 Todas as Ofertas", badge: null },
  { id: "free", label: "🎁 100% Grátis", badge: "FREE" },
  { id: "super_deals", label: "🔥 Super Descontos (-70%+)", badge: "TOP" },
  { id: "historical_low", label: "💎 Menores Históricos", badge: "RECORD" },
  { id: "under10", label: "🪙 Até R$ 10", badge: null },
  { id: "under20", label: "💵 Até R$ 20", badge: null },
  { id: "under50", label: "🏷️ Até R$ 50", badge: null },
  { id: "expired", label: "🛑 Encerradas / Esgotadas", badge: "HISTÓRICO" },
]

const STORES = [
  { id: "instant_gaming", name: "Instant Gaming", color: "#FF7F00", border: "hover:border-[#FF7F00]/60 active:border-[#FF7F00]" },
  { id: "green_man_gaming", name: "Green Man Gaming", color: "#00D166", border: "hover:border-[#00D166]/60 active:border-[#00D166]" },
  { id: "humble_store", name: "Humble Store", color: "#CB2727", border: "hover:border-[#CB2727]/60 active:border-[#CB2727]" },
  { id: "fanatical", name: "Fanatical", color: "#FF6B00", border: "hover:border-[#FF6B00]/60 active:border-[#FF6B00]" },
  { id: "eneba", name: "Eneba", color: "#8a5cf6", border: "hover:border-[#8a5cf6]/60 active:border-[#8a5cf6]" },
  { id: "g2a", name: "G2A", color: "#F05A28", border: "hover:border-[#F05A28]/60 active:border-[#F05A28]" },
  { id: "epic_games", name: "Epic Games", color: "#0078F2", border: "hover:border-[#0078F2]/60 active:border-[#0078F2]" },
  { id: "steam", name: "Steam", color: "#38bdf8", border: "hover:border-[#38bdf8]/60 active:border-[#38bdf8]" },
]

export default function FilterHUD({
  activeCategory,
  onSelectCategory,
  selectedStores,
  onToggleStore,
  onClearStores,
  selectedSort,
  onSelectSort,
  storeCounts,
  totalFiltered,
  totalDeals,
  onResetAll,
}: FilterHUDProps) {
  const hasActiveFilters =
    activeCategory !== "all" || selectedStores.length > 0

  return (
    <section className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 mb-6">
      <div className="rounded-3xl bg-[#080d19]/90 border border-white/[0.08] p-4 sm:p-6 backdrop-blur-xl shadow-2xl flex flex-col gap-5">
        {/* Row 1: Category Chips Gamer */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 shrink-0 mr-1 hidden sm:inline">
            Filtros:
          </span>
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`relative px-4 py-2 rounded-xl text-xs font-bold tracking-wide shrink-0 transition-all duration-200 flex items-center gap-1.5 ${
                  isActive
                    ? "bg-emerald-500 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.35)] scale-[1.02]"
                    : "bg-slate-900/80 hover:bg-slate-800/90 text-slate-300 hover:text-white border border-white/[0.06]"
                }`}
              >
                <span>{cat.label}</span>
                {cat.badge && (
                  <span
                    className={`text-[9px] font-black px-1.5 py-0.2 rounded ${
                      isActive ? "bg-slate-950 text-emerald-400" : "bg-emerald-500/20 text-emerald-400"
                    }`}
                  >
                    {cat.badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Row 2: Store Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/[0.06]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-1">
              Lojas Oficiais:
            </span>
            {STORES.map((store) => {
              const isSelected = selectedStores.includes(store.id)
              const count = storeCounts[store.id] || 0
              return (
                <button
                  key={store.id}
                  onClick={() => onToggleStore(store.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all duration-200 border ${
                    isSelected
                      ? "bg-slate-800 text-white border-emerald-400 shadow-md ring-2 ring-emerald-500/30"
                      : "bg-slate-900/60 text-slate-400 hover:text-slate-200 border-white/[0.06] hover:bg-slate-800/70"
                  } ${store.border}`}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: store.color }}
                  />
                  <span>{store.name}</span>
                  {count > 0 && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                        isSelected
                          ? "bg-emerald-500 text-slate-950"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              )
            })}

            {selectedStores.length > 0 && (
              <button
                onClick={onClearStores}
                className="text-xs text-rose-400 hover:text-rose-300 font-semibold underline underline-offset-4 ml-1 transition-colors"
              >
                Limpar Lojas
              </button>
            )}
          </div>

          {/* Sort Selection */}
          <div className="flex items-center gap-2 shrink-0 ml-auto">
            <span className="text-xs text-slate-400 font-medium">Ordenar:</span>
            <select
              value={selectedSort}
              onChange={(e) => onSelectSort(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/[0.08] text-xs text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="featured">🔥 Mais Populares</option>
              <option value="price_asc">📉 Menor Preço (R$)</option>
              <option value="discount_desc">📈 Maior Desconto (%)</option>
              <option value="title_asc">🔤 Nome (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Row 3: Meta & Counter Bar */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/[0.04]">
          <div className="flex items-center gap-2">
            <span>
              Mostrando <strong className="text-white font-bold">{totalFiltered}</strong> de{" "}
              <strong className="text-white font-bold">{totalDeals}</strong> ofertas disponíveis
            </span>
            {hasActiveFilters && (
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[11px] font-bold">
                Filtros ativos
              </span>
            )}
          </div>

          {hasActiveFilters && (
            <button
              onClick={onResetAll}
              className="text-xs text-slate-400 hover:text-emerald-400 font-semibold transition-colors flex items-center gap-1"
            >
              <span>↺</span>
              <span>Resetar Filtros</span>
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
