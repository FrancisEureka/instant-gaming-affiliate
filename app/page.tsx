const products = [
  {
    id: 1,
    title: "Scythe: Digital Edition",
    store: "Instant Gaming",
    oldPrice: "R$ 129,99",
    newPrice: "R$ 25,06",
    discount: "-81%",
    stock: "Em estoque",
    image:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80",
    url: "https://www.instant-gaming.com/en/8207-buy-scythe-digital-edition-digital-edition-pc-mac-game-steam/?igr=franciseureka",
  },
  {
    id: 2,
    title: "Hollow Knight",
    store: "Instant Gaming",
    oldPrice: "R$ 59,99",
    newPrice: "R$ 19,90",
    discount: "-67%",
    stock: "Em estoque",
    image:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=900&q=80",
    url: "https://www.instant-gaming.com/?igr=franciseureka",
  },
  {
    id: 3,
    title: "Cyberpunk 2077",
    store: "Instant Gaming",
    oldPrice: "R$ 199,99",
    newPrice: "R$ 89,90",
    discount: "-55%",
    stock: "Em estoque",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
    url: "https://www.instant-gaming.com/?igr=franciseureka",
  },
  {
    id: 4,
    title: "Dead Cells",
    store: "Instant Gaming",
    oldPrice: "R$ 79,99",
    newPrice: "R$ 29,99",
    discount: "-62%",
    stock: "Em estoque",
    image:
      "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?auto=format&fit=crop&w=900&q=80",
    url: "https://www.instant-gaming.com/?igr=franciseureka",
  },
]

export default function Home() {
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
          <button
            style={{
              background: "#22c55e",
              color: "black",
              border: "none",
              padding: "12px 18px",
              borderRadius: "999px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Todos
          </button>

          <button
            style={{
              background: "#18181b",
              color: "white",
              border: "1px solid #27272a",
              padding: "12px 18px",
              borderRadius: "999px",
              cursor: "pointer",
            }}
          >
            Até R$ 20
          </button>

          <button
            style={{
              background: "#18181b",
              color: "white",
              border: "1px solid #27272a",
              padding: "12px 18px",
              borderRadius: "999px",
              cursor: "pointer",
            }}
          >
            Até R$ 50
          </button>

          <button
            style={{
              background: "#18181b",
              color: "white",
              border: "1px solid #27272a",
              padding: "12px 18px",
              borderRadius: "999px",
              cursor: "pointer",
            }}
          >
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
          {products.map((product) => (
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