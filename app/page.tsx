export default function Home() {
  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0a", color: "white", padding: "40px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "40px", fontWeight: "bold", marginBottom: "10px" }}>
          Promoções Instant Gaming
        </h1>

        <p style={{ color: "#a1a1aa", marginBottom: "30px" }}>
          Ofertas com meu link de afiliado.
        </p>

        <div
          style={{
            background: "#18181b",
            border: "1px solid #27272a",
            borderRadius: "18px",
            padding: "20px",
            maxWidth: "380px",
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1542751371-adc38448a05e"
            alt="Game"
            style={{
              width: "100%",
              height: "220px",
              objectFit: "cover",
              borderRadius: "12px",
              marginBottom: "16px",
            }}
          />

          <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
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
              -81%
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
              Em estoque
            </span>
          </div>

          <h2 style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "8px" }}>
            Scythe: Digital Edition
          </h2>

          <p style={{ color: "#a1a1aa", marginBottom: "14px" }}>Instant Gaming</p>

          <div style={{ marginBottom: "18px" }}>
            <span
              style={{
                color: "#71717a",
                textDecoration: "line-through",
                marginRight: "10px",
              }}
            >
              R$ 129,99
            </span>
            <span style={{ fontSize: "28px", fontWeight: "bold" }}>R$ 25,06</span>
          </div>

          <a
            href="https://www.instant-gaming.com/en/8207-buy-scythe-digital-edition-digital-edition-pc-mac-game-steam/?igr=franciseureka"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              background: "#22c55e",
              color: "black",
              fontWeight: "bold",
              padding: "12px 18px",
              borderRadius: "12px",
              textDecoration: "none",
            }}
          >
            Ver oferta
          </a>
        </div>
      </div>
    </main>
  )
}