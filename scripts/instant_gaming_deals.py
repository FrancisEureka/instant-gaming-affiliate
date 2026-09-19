"""
Instant Gaming Daily Deals Poster for Discord
Canal: #🕹️・instant-gaming
Afiliado: ?igr=franciseureka
"""

import json
import os
import time
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
    """Busca as melhores ofertas do dia na Steam (Specials e Top Sellers) e no CheapShark."""
    deals = []
    seen_ids = set()

    # 1. API Oficial da Steam (Specials e Top Sellers com desconto)
    try:
        url = "https://store.steampowered.com/api/featuredcategories/?cc=br&l=brazilian"
        req = urllib.request.Request(
            url,
            headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            },
        )
        with urllib.request.urlopen(req, timeout=15) as res:
            data = json.loads(res.read().decode("utf-8"))

        candidate_items = []
        if "specials" in data and "items" in data["specials"]:
            candidate_items.extend(data["specials"]["items"])
        if "top_sellers" in data and "items" in data["top_sellers"]:
            candidate_items.extend(data["top_sellers"]["items"])

        for item in candidate_items:
            name = item.get("name", "").strip()
            discount = item.get("discount_percent", 0)
            final_price = item.get("final_price", 0) / 100.0
            orig_price = item.get("original_price", 0) / 100.0
            header_image = item.get("header_image", "")
            item_id = str(item.get("id", name))

            if discount >= 20 and final_price > 0 and item_id not in seen_ids:
                seen_ids.add(item_id)
                deals.append({
                    "id": item_id,
                    "name": name,
                    "discount": discount,
                    "final_price": final_price,
                    "orig_price": orig_price,
                    "image": header_image,
                })
    except Exception as e:
        print(f"Aviso ao buscar ofertas da Steam: {e}")

    # 2. Complemento / Fallback: CheapShark API (Grandes descontos da Steam)
    if len(deals) < 15:
        try:
            cs_url = "https://www.cheapshark.com/api/1.0/deals?storeID=1&pageSize=30&onSale=1&sortBy=Deal%20Rating"
            cs_req = urllib.request.Request(
                cs_url,
                headers={
                    "User-Agent": "EurekaBot/1.0 (contact@franciseureka.com)"
                },
            )
            with urllib.request.urlopen(cs_req, timeout=15) as cs_res:
                cs_data = json.loads(cs_res.read().decode("utf-8"))
                for cs_item in cs_data:
                    app_id = str(cs_item.get("steamAppID", ""))
                    if not app_id or app_id in seen_ids:
                        continue
                    savings = float(cs_item.get("savings", 0))
                    sale_price = float(cs_item.get("salePrice", 0))
                    normal_price = float(cs_item.get("normalPrice", 0))
                    title = cs_item.get("title", "").strip()

                    if savings >= 30 and sale_price > 0 and title:
                        seen_ids.add(app_id)
                        deals.append({
                            "id": app_id,
                            "name": title,
                            "discount": int(round(savings)),
                            "final_price": round(sale_price * 5.40, 2),
                            "orig_price": round(normal_price * 5.40, 2),
                            "image": f"https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/{app_id}/header.jpg",
                        })
        except Exception as e:
            print(f"Aviso ao buscar ofertas complementares no CheapShark: {e}")

    # Ordena pelos maiores descontos
    deals.sort(key=lambda x: x["discount"], reverse=True)
    return deals


def build_affiliate_url(game_name):
    query = urllib.parse.quote_plus(game_name)
    return f"https://www.instant-gaming.com/pt/procurar/?q={query}&igr={AFFILIATE_TAG}"


def get_game_details(app_id):
    """Busca sinopse em português e gêneros na API oficial da Steam."""
    try:
        url = f"https://store.steampowered.com/api/appdetails?appids={app_id}&l=brazilian"
        req = urllib.request.Request(
            url,
            headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            },
        )
        with urllib.request.urlopen(req, timeout=6) as res:
            data = json.loads(res.read().decode("utf-8"))
            app_data = data.get(str(app_id), {}).get("data", {})
            desc = app_data.get("short_description", "").strip()
            # Limita descrição se for muito longa
            if len(desc) > 300:
                desc = desc[:297] + "..."
            genres = [g.get("description", "") for g in app_data.get("genres", []) if g.get("description")]
            return {
                "description": desc,
                "genres": ", ".join(genres[:3]) if genres else "",
            }
    except Exception as e:
        print(f"Aviso ao buscar detalhes de {app_id}: {e}")
    return {"description": "", "genres": ""}


def post_deal(deal):
    name = deal["name"]
    discount = deal["discount"]
    price = f"R$ {deal['final_price']:.2f}".replace(".", ",")
    orig_price = f"R$ {deal['orig_price']:.2f}".replace(".", ",")
    affiliate_link = build_affiliate_url(name)
    desc_text = deal.get("description", "")
    genres = deal.get("genres", "")

    fields = [
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
    ]

    if genres:
        fields.append({
            "name": "🎮 Gêneros",
            "value": genres,
            "inline": True,
        })

    if desc_text:
        fields.append({
            "name": "📖 Sobre o Jogo",
            "value": desc_text,
            "inline": False,
        })

    fields.append({
        "name": "🛒 Comprar Agora",
        "value": f"[👉 **Clique aqui para garantir com desconto**]({affiliate_link})",
        "inline": False,
    })

    payload = {
        "username": "Eureka Ofertas",
        "avatar_url": "https://gaming-cdn.com/images/favicon/favicon.png",
        "embeds": [
            {
                "author": {
                    "name": "INSTANT GAMING • CHAVE DIGITAL (STEAM / PC) 🎮",
                    "icon_url": "https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/steam.png",
                    "url": affiliate_link,
                },
                "thumbnail": {
                    "url": "https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/steam.png",
                },
                "title": f"🔥 [STEAM] {name} com -{discount}% de Desconto!",
                "url": affiliate_link,
                "description": (
                    f"⚡ **Super Oferta na Instant Gaming!**\n"
                    f"Chave digital para ativação na **Steam** com preço reduzido.\n"
                    f"Ao comprar pelo link, você apoia diretamente a comunidade do Eureka sem pagar nada a mais por isso!"
                ),
                "color": 16744192,  # Laranja Instant Gaming #FF7F00
                "fields": fields,
                "image": {"url": deal["image"]},
                "footer": {
                    "text": "Eureka Gaming • Chave Steam Ativável • Cupom: ?igr=franciseureka",
                    "icon_url": "https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/steam.png",
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


def send_whatsapp_deal(deal):
    """Envia a oferta para o grupo do WhatsApp caso as variáveis de ambiente estejam configuradas."""
    api_url = (os.environ.get("WHATSAPP_API_URL") or "https://eureka-evolution.onrender.com").rstrip("/")
    api_key = os.environ.get("WHATSAPP_API_KEY") or "A829A3AB4468-4731-9173-1A15C8361FCB"
    instance = os.environ.get("WHATSAPP_INSTANCE") or "Eureka"
    group_id = os.environ.get("WHATSAPP_DEALS_GROUP") or "120363431894288091@g.us"  # Grupo Ofertinhas (Eureka)

    if not api_url or not api_key:
        return False

    name = deal["name"]
    discount = deal["discount"]
    price = f"R$ {deal['final_price']:.2f}".replace(".", ",")
    orig_price = f"R$ {deal['orig_price']:.2f}".replace(".", ",")
    affiliate_link = build_affiliate_url(name)
    desc_section = f"\n📖 *Sobre o jogo:*\n_{deal['description']}_\n" if deal.get("description") else ""
    genres_line = f"🏷️ Gêneros: {deal['genres']}\n" if deal.get("genres") else ""

    caption = (
        f"🏷️ *PLATAFORMA:* *【 STEAM / PC DIGITAL 】*\n"
        f"🔥 *OFERTA DO DIA NA INSTANT GAMING!*\n\n"
        f"🕹️ *{name}* com *-{discount}% de Desconto!*\n"
        f"💰 De: ~{orig_price}~ por APENAS *{price}*\n"
        f"🔑 Plataforma: Steam / PC Digital\n"
        f"{genres_line}"
        f"{desc_section}\n"
        f"🛒 *Garanta o seu jogo com desconto pelo link de parceiro:*\n"
        f"👉 {affiliate_link}\n\n"
        f"⚡ _Ativação imediata • Comunidade Eureka_"
    )

    # Endpoint padrão da Evolution API / gateways compatíveis
    endpoint = f"{api_url}/message/sendMedia/{instance}"
    payload = {
        "number": group_id,
        "mediatype": "image",
        "mimetype": "image/jpeg",
        "caption": caption,
        "media": deal["image"],
        "fileName": f"{name}.jpg",
    }

    for attempt in range(1, 4):
        try:
            req = urllib.request.Request(
                endpoint,
                data=json.dumps(payload).encode("utf-8"),
                headers={
                    "Content-Type": "application/json",
                    "apikey": api_key,
                    "User-Agent": "Mozilla/5.0",
                },
            )
            with urllib.request.urlopen(req, timeout=45) as res:
                return res.status in (200, 201)
        except Exception as e:
            print(f"Tentativa {attempt}/3 - Aviso ao enviar oferta para o WhatsApp: {e}")
            if attempt < 3:
                time.sleep(6)
    return False


def get_hours_since_last_deal(history):
    if not history:
        return 999.0
    latest_dt = None
    for val in history.values():
        try:
            clean_val = str(val).replace("Z", "+00:00")
            dt = datetime.fromisoformat(clean_val)
            if latest_dt is None or dt > latest_dt:
                latest_dt = dt
        except Exception:
            pass
    if latest_dt is None:
        return 999.0
    if latest_dt.tzinfo is None:
        latest_dt = latest_dt.replace(tzinfo=timezone.utc)
    diff = (datetime.now(timezone.utc) - latest_dt).total_seconds() / 3600.0
    return diff


def is_deal_recent(deal_id, history, max_age_days=3):
    """Retorna True se o deal já foi postado recentemente (menos de max_age_days dias atrás)."""
    if deal_id not in history:
        return False
    try:
        val = history[deal_id]
        clean_val = str(val).replace("Z", "+00:00")
        dt = datetime.fromisoformat(clean_val)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        age_days = (datetime.now(timezone.utc) - dt).total_seconds() / 86400.0
        return age_days < max_age_days
    except Exception:
        return True


def run(max_deals=1, min_interval_hours=1.5):
    history = load_history()
    
    # Se ja postou recentemente, aguarda o intervalo minimo para evitar flood de ofertas
    if min_interval_hours > 0:
        elapsed = get_hours_since_last_deal(history)
        if elapsed < min_interval_hours:
            print(f"[Instant Gaming] Ultima oferta postada ha {elapsed:.1f}h. Aguardando intervalo de {min_interval_hours}h.")
            return

    deals = get_daily_deals()
    posted_count = 0

    for deal in deals:
        if is_deal_recent(deal["id"], history, max_age_days=3):
            continue

        details = get_game_details(deal["id"])
        deal["description"] = details["description"]
        deal["genres"] = details["genres"]

        print(f"Postando oferta: {deal['name']} (-{deal['discount']}%)")
        discord_ok = post_deal(deal)
        whatsapp_ok = send_whatsapp_deal(deal)

        if discord_ok or whatsapp_ok:
            history[deal["id"]] = datetime.now(timezone.utc).isoformat()
            posted_count += 1
            if posted_count >= max_deals:
                break

    save_history(history)
    print(f"Total de ofertas publicadas hoje: {posted_count}")


if __name__ == "__main__":
    run()

