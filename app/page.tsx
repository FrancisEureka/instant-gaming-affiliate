"use client"

import React, { useState, useEffect, useMemo } from "react"
import Navbar from "./components/Navbar"
import HeroSpotlight from "./components/HeroSpotlight"
import FilterHUD from "./components/FilterHUD"
import GameCard, { DealItem } from "./components/GameCard"
import CommunitySection from "./components/CommunitySection"
import Footer from "./components/Footer"

export default function Home() {
  const [deals, setDeals] = useState<DealItem[]>([])
  const [loading, setLoading] = useState(true)

  // Filters State
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [selectedStores, setSelectedStores] = useState<string[]>([])
  const [selectedSort, setSelectedSort] = useState("featured")
  const [showScrollTop, setShowScrollTop] = useState(false)

  // Fetch Deals
  useEffect(() => {
    async function loadDeals() {
      try {
        const res = await fetch("/data/deals.json", { cache: "no-store" })
        if (!res.ok) throw new Error("Falha ao carregar ofertas")
        const data: DealItem[] = await res.json()
        setDeals(data)
      } catch (err) {
        console.error("Erro ao carregar ofertas:", err)
      } finally {
        setLoading(false)
      }
    }
    loadDeals()
  }, [])

  // Scroll listener for back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Toggle Store filter
  const handleToggleStore = (storeId: string) => {
    setSelectedStores((prev) =>
      prev.includes(storeId) ? prev.filter((s) => s !== storeId) : [...prev, storeId]
    )
  }

  const handleClearStores = () => {
    setSelectedStores([])
  }

  const handleResetAll = () => {
    setSearchQuery("")
    setActiveCategory("all")
    setSelectedStores([])
    setSelectedSort("featured")
  }

  // Count items per store
  const storeCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    deals.forEach((d) => {
      counts[d.store] = (counts[d.store] || 0) + 1
    })
    return counts
  }, [deals])

  // Free deals count
  const totalFree = useMemo(() => deals.filter((d) => d.is_free).length, [deals])

  // Featured Deal for Hero Spotlight (prefer free game or biggest discount)
  const featuredDeal = useMemo(() => {
    if (deals.length === 0) return undefined
    const freeGame = deals.find((d) => d.is_free && d.image)
    if (freeGame) return freeGame
    const topDiscount = [...deals].sort((a, b) => b.discount - a.discount)[0]
    return topDiscount || deals[0]
  }, [deals])

  // Filter & Sort Logic
  const filteredDeals = useMemo(() => {
    return deals
      .filter((deal) => {
        // Search Filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase()
          const matchesTitle = deal.title.toLowerCase().includes(q)
          const matchesStore = deal.store_name.toLowerCase().includes(q)
          if (!matchesTitle && !matchesStore) return false
        }

        // Store Filter
        if (selectedStores.length > 0) {
          if (!selectedStores.includes(deal.store)) return false
        }

        // Category Filter
        if (activeCategory === "free" && !deal.is_free) return false
        if (activeCategory === "super_deals" && deal.discount < 70) return false
        if (activeCategory === "historical_low" && !deal.is_historical_low) return false
        if (activeCategory === "under10" && (deal.final_price > 10 || deal.is_free)) return false
        if (activeCategory === "under20" && (deal.final_price > 20 || deal.is_free)) return false
        if (activeCategory === "under50" && (deal.final_price > 50 || deal.is_free)) return false

        return true
      })
      .sort((a, b) => {
        if (selectedSort === "price_asc") {
          return a.final_price - b.final_price
        }
        if (selectedSort === "discount_desc") {
          return b.discount - a.discount
        }
        if (selectedSort === "title_asc") {
          return a.title.localeCompare(b.title)
        }
        // "featured": Free games first, then highest discount
        if (a.is_free && !b.is_free) return -1
        if (!a.is_free && b.is_free) return 1
        return b.discount - a.discount
      })
  }, [deals, searchQuery, selectedStores, activeCategory, selectedSort])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#060913] text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* 1. Top Gaming Command Navbar */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalDeals={deals.length}
        totalFree={totalFree}
      />

      {/* 2. Hero Spotlight com Marquee e Destaque da Semana */}
      <HeroSpotlight
        featuredDeal={featuredDeal}
        deals={deals}
        onSelectCategory={setActiveCategory}
      />

      {/* 3. Horizontal Gaming Filter HUD */}
      <FilterHUD
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        selectedStores={selectedStores}
        onToggleStore={handleToggleStore}
        onClearStores={handleClearStores}
        selectedSort={selectedSort}
        onSelectSort={setSelectedSort}
        storeCounts={storeCounts}
        totalFiltered={filteredDeals.length}
        totalDeals={deals.length}
        onResetAll={handleResetAll}
      />

      {/* 4. Main Game Deals Fluid Grid (Até 6 ou 7 Colunas em Telas Grandes!) */}
      <main className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 pb-12 flex-1">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 min-[2200px]:grid-cols-7 gap-4 sm:gap-5">
            {[...Array(14)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-slate-900/60 border border-white/[0.06] p-4 aspect-[4/5] animate-pulse flex flex-col justify-between"
              >
                <div className="w-full aspect-[16/9] bg-slate-800/60 rounded-xl"></div>
                <div className="h-4 bg-slate-800/60 rounded w-3/4 mt-3"></div>
                <div className="h-3 bg-slate-800/60 rounded w-1/2 mt-1"></div>
                <div className="flex justify-between items-center mt-auto pt-3 border-t border-slate-800/40">
                  <div className="h-5 bg-slate-800/60 rounded w-1/3"></div>
                  <div className="h-8 bg-slate-800/60 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredDeals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 min-[2200px]:grid-cols-7 gap-4 sm:gap-5">
            {filteredDeals.map((deal) => (
              <GameCard key={deal.id} deal={deal} />
            ))}
          </div>
        ) : (
          /* Empty State Gamer */
          <div className="rounded-3xl bg-[#080d19] border border-white/[0.08] p-12 text-center max-w-lg mx-auto flex flex-col items-center gap-4 my-8">
            <span className="text-4xl">🕹️</span>
            <h3 className="text-lg font-bold text-white">
              Nenhuma oferta encontrada com esses filtros
            </h3>
            <p className="text-xs text-slate-400">
              Tente pesquisar por outro título, desmarcar algumas lojas ou resetar os filtros para ver todo o catálogo.
            </p>
            <button
              onClick={handleResetAll}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow-lg shadow-emerald-500/20 mt-2"
            >
              Resetar Todos os Filtros
            </button>
          </div>
        )}
      </main>

      {/* 5. Seção Especial da Comunidade Francis Eureka */}
      <CommunitySection />

      {/* 6. Rodapé do Portal */}
      <Footer />

      {/* Botão Flutuante Voltar ao Topo */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Voltar ao topo da página"
          className="fixed bottom-6 right-6 z-40 p-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-xl shadow-emerald-500/30 hover:scale-110 active:scale-95 transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </div>
  )
}
