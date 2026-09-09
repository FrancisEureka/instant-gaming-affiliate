"""
Instant Gaming Daily Deals Poster for Discord
Canal: #🕹️・instant-gaming
Afiliado: ?igr=franciseureka
"""

import json
import os
import urllib.parse
import urllib.request
from datetime import datetime, timezone

WEBHOOK_URL = "https://discord.com/api/webhooks/1547214145227587624/EPx13UxO5Z90JeW6528MLOliJbbBNJiHjEd7BvQf8up8AiIouRMQiREMYhcUFzoYOtkX"
AFFILIATE_TAG = "franciseureka"
HISTORY_FILE = os.path.join(os.path.dirname(__file__), "posted_deals_history.json")


def load_history():
    if os.path.exists(HISTORY_FILE):
        try:
            with open(HISTORY_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return {}
    return {}


def save_history(history):
    try:
        with open(HISTORY_FILE, "w", encoding="utf-8") as f:
            json.dump(history, f, indent=2, ensure_ascii=False)
    except Exception as e:
        print(f"Erro ao salvar histórico: {e}")


def get_daily_deals():
    """Busca as melhores ofertas do dia com descontos expressivos."""
    url = "https://store.steampowered.com/api/featuredcategories/?cc=br&l=brazilian"
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        },
    )
    with urllib.request.urlopen(req, timeout=15) as res:
        data = json.loads(res.read().decode("utf-8"))

    items = data.get("specials", {}).get("items", [])
    deals = []

    for item in items:
        name = item.get("name", "")
        discount = item.get("discount_percent", 0)
        final_price = item.get("final_price", 0) / 100.0
        orig_price = item.get("original_price", 0) / 100.0
        header_image = item.get("header_image", "")
        item_id = str(item.get("id", name))

        if discount >= 20 and final_price > 0:
            deals.append({
                "id": item_id,
                "name": name,
                "discount": discount,
                "final_price": final_price,
                "orig_price": orig_price,
                "image": header_image,
            })

    # Ordena pelos maiores descontos
    deals.sort(key=lambda x: x["discount"], reverse=True)
    return deals


def build_affiliate_url(game_name):
    query = urllib.parse.quote_plus(game_name)
    return f"https://www.instant-gaming.com/pt/procurar/?q={query}&igr={AFFILIATE_TAG}"


def post_deal(deal):
    name = deal["name"]
    discount = deal["discount"]
    price = f"R$ {deal['final_price']:.2f}".replace(".", ",")
    orig_price = f"R$ {deal['orig_price']:.2f}".replace(".", ",")
    affiliate_link = build_affiliate_url(name)

    payload = {
        "username": "Instant Gaming Ofertas",
        "avatar_url": "https://gaming-cdn.com/images/favicon/favicon.png",
        "embeds": [
            {
                "title": f"🔥 {name} com -{discount}% de Desconto!",
                "url": affiliate_link,
                "description": (
                    f"⚡ **Super Oferta na Instant Gaming!**\n"
                    f"Aproveite as chaves digitais com preço reduzido e ativação imediata.\n"
                    f"Ao comprar pelo link, você apoia diretamente a comunidade do Eureka sem pagar nada a mais por isso!"
                ),
                "color": 16744192,  # Laranja Instant Gaming #FF7F00
                "fields": [
                    {
                        "name": "🏷️ Desconto",
                        "value": f"`-{discount}%`",
                        "inline": True,
                    },
                    {
                        "name": "💰 De / Por",
                        "value": f"~~{orig_price}~~ ➡️ **{price}**",
                        "inline": True,
                    },
                    {
                        "name": "🔑 Plataforma",
                        "value": "Steam / PC Digital",
                        "inline": True,
                    },
                    {
                        "name": "🛒 Comprar Agora",
                        "value": f"[👉 **Clique aqui para garantir com desconto**]({affiliate_link})",
                        "inline": False,
                    },
                ],
                "image": {"url": deal["image"]},
                "footer": {
                    "text": "Instant Gaming • Cupom & Link de Afiliado: ?igr=franciseureka"
                },
                "timestamp": datetime.now(timezone.utc).isoformat(),
            }
        ],
    }

    req = urllib.request.Request(
        WEBHOOK_URL,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        },
    )
    with urllib.request.urlopen(req, timeout=10) as res:
        return res.status in (200, 204)


def run(max_deals=2):
    history = load_history()
    deals = get_daily_deals()
    posted_count = 0

    for deal in deals:
        if deal["id"] in history:
            continue

        print(f"Postando oferta: {deal['name']} (-{deal['discount']}%)")
        if post_deal(deal):
            history[deal["id"]] = datetime.now().isoformat()
            posted_count += 1
            if posted_count >= max_deals:
                break

    save_history(history)
    print(f"Total de ofertas publicadas hoje: {posted_count}")


if __name__ == "__main__":
    run()
