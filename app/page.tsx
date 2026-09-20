"use client"

import React, { useState, useEffect, useMemo } from "react"
import Sidebar from "./components/Sidebar"
import GameCard, { DealItem } from "./components/GameCard"

export default function Home() {
  const [deals, setDeals] = useState<DealItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStores, setSelectedStores] = useState<string[]>([])
  const [selectedPriceFilter, setSelectedPriceFilter] = useState("all")
  const [activeCategoryTab, setActiveCategoryTab] = useState("all")
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<string>("")

  // Carrega as ofertas do catálogo gerado pelo bot
  useEffect(() => {
    async function loadDeals() {
      try {
        const res = await fetch("/data/deals.json", { cache: "no-store" })
        if (res.ok) {
          const data = await res.json()
          setDeals(data.deals || [])
          if (data.updated_at) {
            const date = new Date(data.updated_at)
            setLastUpdated(
              date.toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })
            )
          }
        }
      } catch (err) {
        console.error("Erro ao carregar ofertas:", err)
      } finally {
        setLoading(false)
      }
    }
    loadDeals()
  }, [])

  // Gerenciador de toggle de lojas
  const handleToggleStore = (storeId: string) => {
    if (storeId === "CLEAR_ALL") {
      setSelectedStores([])
      return
    }
    setSelectedStores((prev) =>
      prev.includes(storeId) ? prev.filter((id) => id !== storeId) : [...prev, storeId]
    )
  }

  // Filtragem combinada
  const filteredDeals = useMemo(() => {
    return deals.filter((deal) => {
      // 1. Busca textual
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const titleMatch = deal.title.toLowerCase().includes(query)
        const storeMatch = deal.store_name.toLowerCase().includes(query)
        if (!titleMatch && !storeMatch) return false
      }

      // 2. Filtro por Abas de Categoria
      if (activeCategoryTab === "free" && !deal.is_free) return false
      if (activeCategoryTab === "super_discount" && deal.discount < 70) return false
      if (activeCategoryTab === "under20" && (deal.final_price > 20 || deal.is_free)) return false

      // 3. Filtro por Lojas
      if (selectedStores.length > 0) {
        if (!selectedStores.includes(deal.store)) return false
      }

      // 4. Filtro por Preço lateral
      if (selectedPriceFilter === "free" && !deal.is_free) return false
      if (selectedPriceFilter === "under10" && (deal.final_price > 10 || deal.is_free)) return false
      if (selectedPriceFilter === "under20" && (deal.final_price > 20 || deal.is_free)) return false
      if (selectedPriceFilter === "under50" && (deal.final_price > 50 || deal.is_free)) return false
      if (selectedPriceFilter === "historical_low" && !deal.is_historical_low) return false

      return true
    })
  }, [deals, searchQuery, activeCategoryTab, selectedStores, selectedPriceFilter])

  const totalFree = useMemo(() => deals.filter((d) => d.is_free).length, [deals])

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Sidebar Lateral */}
      <Sidebar
        selectedStores={selectedStores}
        onToggleStore={handleToggleStore}
        selectedPriceFilter={selectedPriceFilter}
        onSelectPriceFilter={setSelectedPriceFilter}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        totalDeals={deals.length}
        totalFree={totalFree}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 lg:ml-64 flex flex-col">
        {/* Top Header Barra Superior */}
        <header className="sticky top-0 z-20 bg-[#07090e]/80 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Botão Hambúrguer Mobile */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              aria-label="Abrir filtros e menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#22c55e]"></span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest hidden sm:inline">
                Portal de Ofertas
              </span>
            </div>
          </div>

          {/* Status & Last Updated */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            {lastUpdated && (
              <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Sincronizado: {lastUpdated}
              </span>
            )}
            <a
              href="https://discord.gg/h2qMvV264T"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 border border-indigo-500/30 text-xs font-semibold transition-colors"
            >
              <span>Comunidade Discord</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </header>

        {/* Hero Section & Search */}
        <section className="px-4 sm:px-6 lg:px-8 pt-8 pb-6 max-w-7xl w-full mx-auto">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-[#0e1422] to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl mb-8">
            <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-1/4 -mb-12 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"></div>

            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
                🔥 Melhores Preços do Dia
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Economize nos Melhores Jogos para PC
              </h1>
              <p className="mt-2 text-sm sm:text-base text-slate-400">
                Chaves oficiais para ativação na Steam com descontos de até 90% e jogos 100% grátis reunidos em um só lugar.
              </p>

              {/* Barra de Pesquisa */}
              <div className="mt-6 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Pesquisar por título de jogo ou loja..."
                  className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-inner"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Abas Rápidas de Navegação */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-none">
            {[
              { id: "all", label: "🔥 Todas as Ofertas" },
              { id: "free", label: `🎁 Jogos Grátis (${totalFree})` },
              { id: "super_discount", label: "⚡ Super Descontos (-70%+)" },
              { id: "under20", label: "💵 Até R$ 20" },
            ].map((tab) => {
              const active = activeCategoryTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategoryTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    active
                      ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                      : "bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800/80"
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Contador de Resultados & Tags Ativas */}
          <div className="flex items-center justify-between text-xs text-slate-400 py-3">
            <span>
              Mostrando <strong className="text-white">{filteredDeals.length}</strong> de{" "}
              <strong className="text-white">{deals.length}</strong> jogos
            </span>
            {(selectedStores.length > 0 || selectedPriceFilter !== "all" || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedStores([])
                  setSelectedPriceFilter("all")
                  setActiveCategoryTab("all")
                  setSearchQuery("")
                }}
                className="text-emerald-400 hover:text-emerald-300 font-bold"
              >
                Limpar todos os filtros ✕
              </button>
            )}
          </div>

          {/* Grid de Cards */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-2">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-slate-900/60 border border-slate-800/60 p-4 aspect-[4/5] animate-pulse flex flex-col justify-between"
                >
                  <div className="w-full aspect-[16/9] bg-slate-800 rounded-xl mb-4"></div>
                  <div className="h-4 bg-slate-800 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-slate-800 rounded w-1/2"></div>
                  <div className="h-10 bg-slate-800 rounded-xl mt-4"></div>
                </div>
              ))}
            </div>
          ) : filteredDeals.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-2">
              {filteredDeals.map((deal) => (
                <GameCard key={deal.id} deal={deal} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center flex flex-col items-center justify-center bg-slate-900/30 rounded-3xl border border-slate-800/60 my-6">
              <span className="text-4xl mb-3">🔍</span>
              <h3 className="text-lg font-bold text-white">Nenhuma oferta encontrada</h3>
              <p className="text-xs text-slate-400 max-w-sm mt-1 mb-5">
                Não encontramos jogos correspondentes aos filtros selecionados. Tente ajustar o termo de pesquisa ou a faixa de preço.
              </p>
              <button
                onClick={() => {
                  setSelectedStores([])
                  setSelectedPriceFilter("all")
                  setActiveCategoryTab("all")
                  setSearchQuery("")
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
              >
                Resetar Filtros
              </button>
            </div>
          )}
        </section>

        {/* Rodapé do Portal */}
        <footer className="mt-auto border-t border-slate-800/80 bg-[#07090e] px-4 sm:px-6 lg:px-8 py-8 text-xs text-slate-400 text-center flex flex-col items-center gap-2">
          <p className="font-semibold text-slate-300">
            Eureka Gaming • Portal Oficial de Ofertas, Promoções e Jogos Gratuitos
          </p>
          <p className="max-w-xl text-[11px] text-slate-400 leading-relaxed">
            Alguns links disponibilizados contêm afiliação oficial com as lojas parceiras (Instant Gaming, Humble Store, Fanatical, Eneba e G2A). Ao comprar através dos links, a comunidade Eureka recebe uma comissão sem nenhum custo adicional para você.
          </p>
          <p className="text-[10px] text-slate-400 mt-2">
            © 2026 Eureka Gaming. Todos os direitos reservados.
          </p>
        </footer>
      </main>
    </div>
  )
}
