/**
 * Cloudflare Worker: Instant Gaming Daily Deals Poster
 * Roda 100% nas nuvens da Cloudflare gratuitamente com Cron Trigger.
 */

const WEBHOOK_URL = "https://discord.com/api/webhooks/1547214145227587624/EPx13UxO5Z90JeW6528MLOliJbbBNJiHjEd7BvQf8up8AiIouRMQiREMYhcUFzoYOtkX";
const AFFILIATE_TAG = "franciseureka";

export default {
  // Disparo agendado (Cron Trigger)
  async scheduled(event, env, ctx) {
    ctx.waitUntil(postDailyDeals());
  },

  // Disparo manual via URL (teste no navegador)
  async fetch(request, env, ctx) {
    await postDailyDeals();
    return new Response("Ofertas publicadas no Discord com sucesso!", {
      headers: { "Content-Type": "text/plain; charset=utf-8" }
    });
  }
};

async function postDailyDeals() {
  try {
    const res = await fetch("https://store.steampowered.com/api/featuredcategories/?cc=br&l=brazilian", {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
    });
    const data = await res.json();
    const items = data?.specials?.items || [];

    // Filtra promoções com desconto >= 25%
    const deals = items
      .filter(i => i.discount_percent >= 25 && i.final_price > 0)
      .sort((a, b) => b.discount_percent - a.discount_percent)
      .slice(0, 2);

    for (const deal of deals) {
      const name = deal.name;
      const discount = deal.discount_percent;
      const finalPrice = (deal.final_price / 100).toFixed(2).replace(".", ",");
      const origPrice = (deal.original_price / 100).toFixed(2).replace(".", ",");
      const affiliateUrl = `https://www.instant-gaming.com/pt/procurar/?q=${encodeURIComponent(name)}&igr=${AFFILIATE_TAG}`;

      const payload = {
        username: "Instant Gaming Ofertas",
        avatar_url: "https://gaming-cdn.com/images/favicon/favicon.png",
        embeds: [{
          title: `🔥 ${name} com -${discount}% de Desconto!`,
          url: affiliateUrl,
          description: "⚡ **Super Oferta na Instant Gaming!**\nAproveite as chaves digitais com preço reduzido e ativação imediata.\nAo comprar pelo link, você apoia diretamente a comunidade do Eureka sem pagar nada a mais por isso!",
          color: 16744192,
          fields: [
            { name: "🏷️ Desconto", value: `\`-${discount}%\``, inline: true },
            { name: "💰 De / Por", value: `~~R$ ${origPrice}~~ ➡️ **R$ ${finalPrice}**`, inline: true },
            { name: "🔑 Plataforma", value: "Steam / PC Digital", inline: true },
            { name: "🛒 Comprar Agora", value: `[👉 **Clique aqui para garantir com desconto**](${affiliateUrl})`, inline: false }
          ],
          image: { url: deal.header_image },
          footer: { text: "Instant Gaming • Cupom & Link de Afiliado: ?igr=franciseureka" },
          timestamp: new Date().toISOString()
        }]
      };

      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    }
  } catch (err) {
    console.error("Erro ao postar ofertas:", err);
  }
}
