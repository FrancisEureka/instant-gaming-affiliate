"use client"

import { useState } from "react"
import { products } from "./data/products"

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
    background: active ? "#22c55e" : "#18181b",
    color: active ? "black" : "white",
    border: active ? "none" : "1px solid #27272a",
    padding: "12px 18px",
    borderRadius: "999px",
    fontWeight: "bold" as const,
    cursor: "pointer",
  })

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#050505",
        color: "white",
        padding: "40px 24px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <header style={{ marginBottom: "32px" }}>
          <p
            style={{
              color: "#22c55e",
              fontWeight: "bold",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: "10px",
            }}
          >
            Instant Gaming
          </p>

          <h1
            style={{
              fontSize: "48px",
              fontWeight: "bold",
              margin: 0,
              marginBottom: "10px",
            }}
          >
            Promoções de jogos
          </h1>

          <p
            style={{
              color: "#a1a1aa",
              fontSize: "18px",
              maxWidth: "700px",
              lineHeight: 1.6,
            }}
          >
            Encontre ofertas com meu link de afiliado e acompanhe promoções em destaque.
          </p>
        </header>

        <section
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
        </section>

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
                borderRadius: "22px",
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

              <h2
                style={{
                  fontSize: "28px",
                  fontWeight: "bold",
                  lineHeight: 1.2,
                  margin: 0,
                  marginBottom: "8px",
                }}
              >
                {product.title}
              </h2>

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
      </div>
    </main>
  )
}