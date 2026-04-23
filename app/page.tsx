"use client"

import { useState } from "react"
import { products } from "./data/products"

const creatorLinks = [
  {
    id: 1,
    label: "WhatsApp",
    url: "https://wa.me/",
  },
  {
    id: 2,
    label: "Mídia Kit",
    url: "https://drive.google.com/",
  },
  {
    id: 3,
    label: "YouTube",
    url: "https://www.youtube.com/",
  },
  {
    id: 4,
    label: "Kick",
    url: "https://kick.com/",
  },
  {
    id: 5,
    label: "Portifólio",
    url: "https://www.behance.net/",
  },
  {
    id: 6,
    label: "Instagram Profissional",
    url: "https://www.instagram.com/",
  },
  {
    id: 7,
    label: "TikTok",
    url: "https://www.tiktok.com/",
  },
  {
    id: 8,
    label: "Discord",
    url: "https://discord.gg/",
  },
]

export default function Home() {
  const [filter, setFilter] = useState("all")

  const filteredProducts = products.filter((product) => {
    const price = Number(product.newPrice.replace("R$ ", "").replace(",", "."))

    if (filter === "under20") return price <= 20
    if (filter === "under50") return price <= 50
    if (filter === "best") {
      return Number(product.discount.replace("%", "").replace("-", "")) >= 60
    }

    return true
  })

  const filterButtonStyle = (active: boolean) => ({
    background: active ? "#22c55e" : "#111318",
    color: active ? "black" : "white",
    border: active ? "none" : "1px solid #262a33",
    padding: "12px 18px",
    borderRadius: "999px",
    fontWeight: "bold" as const,
    cursor: "pointer",
    fontSize: "14px",
    transition: "all 0.2s ease",
  })

  const socialButtonStyle = {
    display: "inline-block",
    padding: "12px 16px",
    borderRadius: "999px",
    background: "#111318",
    color: "white",
    textDecoration: "none",
    border: "1px solid #262a33",
    fontWeight: "bold" as const,
    fontSize: "14px",
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(34,197,94,0.12), transparent 25%), #050505",
        color: "white",
        padding: "32px 20px 60px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <section
          style={{
            background: "#0b0d11",
            border: "1px solid #1f232b",
            borderRadius: "28px",
            padding: "28px",
            marginBottom: "28px",
            boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.3fr) minmax(280px, 0.7fr)",
              gap: "24px",
              alignItems: "center",
            }}
          >
            <div>
              <p
                style={{
                  color: "#22c55e",
                  fontWeight: "bold",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  margin: 0,
                  marginBottom: "12px",
                  fontSize: "13px",
                }}
              >
                Francis Eureka
              </p>

              <h1
                style={{
                  fontSize: "56px",
                  lineHeight: 1.05,
                  margin: 0,
                  marginBottom: "14px",
                  fontWeight: 800,
                }}
              >
                Promoções, conteúdo e links oficiais
              </h1>

              <p
                style={{
                  color: "#b3b8c5",
                  fontSize: "18px",
                  lineHeight: 1.7,
                  maxWidth: "760px",
                  marginTop: 0,
                  marginBottom: "18px",
                }}
              >
                Criador de conteúdo e memes, designer gráfico e creator gamer.
                Aqui você encontra minhas ofertas da Instant Gaming com link de
                afiliado, além dos principais canais para contato, mídia kit e
                redes sociais.
              </p>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                  marginBottom: "18px",
                }}
              >
                {creatorLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={socialButtonStyle}
                  >
                    {link.label}
                  </a>
                ))}
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    background: "#111318",
                    border: "1px solid #262a33",
                    borderRadius: "16px",
                    padding: "12px 14px",
                    color: "#d6d9e0",
                    fontSize: "14px",
                  }}
                >
                  🎮 Ofertas com afiliado
                </div>

                <div
                  style={{
                    background: "#111318",
                    border: "1px solid #262a33",
                    borderRadius: "16px",
                    padding: "12px 14px",
                    color: "#d6d9e0",
                    fontSize: "14px",
                  }}
                >
                  📩 Contato e mídia kit
                </div>

                <div
                  style={{
                    background: "#111318",
                    border: "1px solid #262a33",
                    borderRadius: "16px",
                    padding: "12px 14px",
                    color: "#d6d9e0",
                    fontSize: "14px",
                  }}
                >
                  📱 Redes e comunidade
                </div>
              </div>
            </div>

            <div>
              <div
                style={{
                  background:
                    "linear-gradient(180deg, rgba(34,197,94,0.15), rgba(17,19,24,1))",
                  border: "1px solid #262a33",
                  borderRadius: "24px",
                  padding: "22px",
                }}
              >
                <div
                  style={{
                    borderRadius: "20px",
                    background: "#111318",
                    padding: "22px",
                    border: "1px solid #2a2f39",
                  }}
                >
                  <p
                    style={{
                      color: "#22c55e",
                      fontWeight: "bold",
                      marginTop: 0,
                      marginBottom: "10px",
                      fontSize: "13px",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    Destaque
                  </p>

                  <h2
                    style={{
                      marginTop: 0,
                      marginBottom: "10px",
                      fontSize: "28px",
                      lineHeight: 1.2,
                    }}
                  >
                    Minha página central de promoções gamer
                  </h2>

                  <p
                    style={{
                      color: "#b3b8c5",
                      fontSize: "15px",
                      lineHeight: 1.7,
                      marginTop: 0,
                      marginBottom: "18px",
                    }}
                  >
                    Use os filtros abaixo para encontrar jogos baratos, melhores
                    descontos e ofertas em destaque da Instant Gaming.
                  </p>

                  <a
                    href="#ofertas"
                    style={{
                      display: "inline-block",
                      background: "#22c55e",
                      color: "black",
                      textDecoration: "none",
                      fontWeight: "bold",
                      padding: "12px 18px",
                      borderRadius: "14px",
                    }}
                  >
                    Ver ofertas
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="ofertas"
          style={{
            marginBottom: "22px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "end",
              gap: "16px",
              flexWrap: "wrap",
              marginBottom: "18px",
            }}
          >
            <div>
              <p
                style={{
                  color: "#22c55e",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  fontSize: "13px",
                  marginTop: 0,
                  marginBottom: "8px",
                }}
              >
                Ofertas
              </p>

              <h2
                style={{
                  fontSize: "36px",
                  margin: 0,
                }}
              >
                Jogos em promoção
              </h2>
            </div>

            <p
              style={{
                color: "#9aa1ae",
                margin: 0,
                fontSize: "15px",
              }}
            >
              {filteredProducts.length} oferta{filteredProducts.length !== 1 ? "s" : ""} encontrada
              {filteredProducts.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              marginBottom: "28px",
            }}
          >
            <button style={filterButtonStyle(filter === "all")} onClick={() => setFilter("all")}>
              Todos
            </button>

            <button
              style={filterButtonStyle(filter === "under20")}
              onClick={() => setFilter("under20")}
            >
              Até R$ 20
            </button>

            <button
              style={filterButtonStyle(filter === "under50")}
              onClick={() => setFilter("under50")}
            >
              Até R$ 50
            </button>

            <button style={filterButtonStyle(filter === "best")} onClick={() => setFilter("best")}>
              Melhores descontos
            </button>
          </div>

          <section
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "20px",
            }}
          >
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                style={{
                  background: "#111318",
                  border: "1px solid #22252b",
                  borderRadius: "24px",
                  padding: "16px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
                }}
              >
                <img
                  src={product.image}
                  alt={product.title}
                  style={{
                    width: "100%",
                    height: "220px",
                    objectFit: "cover",
                    borderRadius: "16px",
                    marginBottom: "14px",
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    flexWrap: "wrap",
                    marginBottom: "12px",
                  }}
                >
                  <span
                    style={{
                      background: "#dc2626",
                      color: "white",
                      fontSize: "12px",
                      fontWeight: "bold",
                      padding: "6px 10px",
                      borderRadius: "999px",
                    }}
                  >
                    {product.discount}
                  </span>

                  <span
                    style={{
                      background: "#16a34a",
                      color: "white",
                      fontSize: "12px",
                      fontWeight: "bold",
                      padding: "6px 10px",
                      borderRadius: "999px",
                    }}
                  >
                    {product.stock}
                  </span>
                </div>

                <h3
                  style={{
                    fontSize: "28px",
                    fontWeight: "bold",
                    lineHeight: 1.2,
                    margin: 0,
                    marginBottom: "8px",
                  }}
                >
                  {product.title}
                </h3>

                <p style={{ color: "#a1a1aa", marginTop: 0, marginBottom: "16px" }}>
                  {product.store}
                </p>

                <div style={{ marginBottom: "20px" }}>
                  <span
                    style={{
                      color: "#71717a",
                      textDecoration: "line-through",
                      marginRight: "10px",
                      fontSize: "18px",
                    }}
                  >
                    {product.oldPrice}
                  </span>

                  <span style={{ fontSize: "34px", fontWeight: "bold" }}>
                    {product.newPrice}
                  </span>
                </div>

                <a
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-block",
                    width: "100%",
                    textAlign: "center",
                    background: "#22c55e",
                    color: "black",
                    fontWeight: "bold",
                    padding: "14px 18px",
                    borderRadius: "14px",
                    textDecoration: "none",
                    fontSize: "18px",
                  }}
                >
                  Ver oferta
                </a>
              </article>
            ))}
          </section>
        </section>
      </div>
    </main>
  )
}