"use client"

import React from "react"

const COMMUNITY_CARDS = [
  {
    name: "Twitch",
    tag: "LIVES & GAMEPLAY",
    description: "Lives diárias, gameplay com a comunidade, bate-papo gamer e sorteios de chaves de jogos.",
    url: "https://twitch.tv/franciseureka",
    cta: "Seguir na Twitch",
    color: "from-purple-900/40 via-purple-950/20 to-transparent",
    border: "border-purple-500/30 hover:border-purple-400",
    buttonBg: "bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/30",
    icon: (
      <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    tag: "VÍDEOS & REVIEWS",
    description: "Vídeos semanais com as melhores promoções, reviews de jogos, gameplays e novidades do mundo gamer.",
    url: "https://www.youtube.com/@franciseureka",
    cta: "Inscrever-se no Canal",
    color: "from-red-900/40 via-red-950/20 to-transparent",
    border: "border-red-500/30 hover:border-red-400",
    buttonBg: "bg-red-600 hover:bg-red-500 text-white shadow-red-600/30",
    icon: (
      <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    name: "Discord",
    tag: "COMUNIDADE VIP",
    description: "Participe da comunidade oficial, canais de voz para jogar junto, bot de música e alertas automáticos de jogos grátis.",
    url: "https://discord.gg/h2qMvV264T",
    cta: "Entrar no Servidor",
    color: "from-indigo-900/40 via-indigo-950/20 to-transparent",
    border: "border-indigo-500/30 hover:border-indigo-400",
    buttonBg: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30",
    icon: (
      <svg className="w-6 h-6 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    ),
  },
  {
    name: "WhatsApp Ofertas",
    tag: "ALERTAS INSTANTÂNEOS",
    description: "Receba as notificações de jogos 100% grátis e bugs de preço diretamente no seu smartphone antes que esgote.",
    url: "https://chat.whatsapp.com/G4f13oF0z0L4GZ24HhOq4w",
    cta: "Entrar no Grupo WhatsApp",
    color: "from-emerald-900/40 via-emerald-950/20 to-transparent",
    border: "border-emerald-500/30 hover:border-emerald-400",
    buttonBg: "bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black shadow-emerald-500/30",
    icon: (
      <svg className="w-6 h-6 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
      </svg>
    ),
  },
]

const SECONDARY_SOCIALS = [
  { name: "Kick", url: "https://kick.com/franciseureka", tag: "Transmissões ao Vivo" },
  { name: "Instagram", url: "https://www.instagram.com/franciseureka", tag: "Stories & Bastidores" },
  { name: "TikTok", url: "https://www.tiktok.com/@franciseureka", tag: "Clipes & Shorts" },
]

export default function CommunitySection() {
  return (
    <section className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="rounded-3xl bg-gradient-to-b from-[#0a0f1e] to-[#060812] border border-white/[0.08] p-6 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden">
        {/* Glow ambient */}
        <div className="absolute top-0 right-1/3 w-80 h-80 rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none"></div>

        {/* Header da Seção */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-3">
            🎮 Comunidade Francis Eureka
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Conecte-se em Todas as Redes
          </h2>
          <p className="mt-2 text-sm text-slate-400 leading-relaxed">
            Acompanhe nossas transmissões, participe das conversas no Discord e receba os alertas mais rápidos da internet sobre jogos gratuitos e menores preços.
          </p>
        </div>

        {/* 4 Cards Principais */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          {COMMUNITY_CARDS.map((card) => (
            <div
              key={card.name}
              className={`rounded-2xl bg-gradient-to-b ${card.color} bg-[#080d19] border ${card.border} p-6 flex flex-col justify-between shadow-xl hover:-translate-y-1 transition-all duration-300 group`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-white/[0.08] shadow-inner group-hover:scale-110 transition-transform">
                    {card.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-white/[0.06] text-slate-300">
                    {card.tag}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2">{card.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  {card.description}
                </p>
              </div>

              <a
                href={card.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold text-center transition-all duration-200 shadow-md ${card.buttonBg}`}
              >
                {card.cta} →
              </a>
            </div>
          ))}
        </div>

        {/* Redes Secundárias em Chips Estilizados */}
        <div className="relative z-10 pt-6 border-t border-white/[0.06] flex flex-wrap items-center justify-center gap-4 text-xs">
          <span className="text-slate-400 font-medium">Outras Redes:</span>
          {SECONDARY_SOCIALS.map((s) => (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/[0.08] text-slate-300 hover:text-white font-semibold transition-all hover:-translate-y-0.5 flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>{s.name}</span>
              <span className="text-slate-400 text-[11px] font-normal">({s.tag})</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
