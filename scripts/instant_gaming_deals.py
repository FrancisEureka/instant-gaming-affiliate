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
LAST_STORE_FILE = os.path.join(os.path.dirname(__file__), "posted_last_store.json")

HUMBLE_AFFILIATE_BASE = "https://humblebundleinc.sjv.io/c/7758631/2059850/25796"
FANATICAL_AFFILIATE_BASE = "https://www.awin1.com/cread.php?awinmid=118821&awinaffid=3091639&ued="
G2A_AFFILIATE_LINK = "https://www.g2a.com/n/reflink-e9ca0b6c48"

STORE_CONFIG = {
    "instant_gaming": {
        "name": "Instant Gaming",
        "tag_name": "INSTANT GAMING",
        "color": 16744192,  # Laranja Instant Gaming #FF7F00
        "avatar_url": "https://gaming-cdn.com/images/favicon/favicon.png",
        "badge_title": "OFERTA DO DIA NA INSTANT GAMING!",
        "footer_text": "Eureka Gaming • Chave Steam Ativável • Cupom: ?igr=franciseureka",
        "call_to_action_discord": "Clique aqui para garantir na Instant Gaming",
        "call_to_action_wa": "Garanta o seu jogo pelo link de parceiro da Instant Gaming:",
        "footer_wa": "Ativação imediata • Comunidade Eureka",
    },
    "humble_store": {
        "name": "Humble Store",
        "tag_name": "HUMBLE STORE",
        "color": 13313831,  # Vermelho Humble #CB2727
        "avatar_url": "https://cdn.iconscout.com/icon/free/png-512/free-humble-bundle-3628817-3030063.png",
        "badge_title": "OFERTA DO DIA NA HUMBLE STORE!",
        "footer_text": "Eureka Gaming • Parceiro Oficial Humble Bundle • Chave Steam",
        "call_to_action_discord": "Clique aqui para garantir na Humble Store",
        "call_to_action_wa": "Garanta o seu jogo pelo link de parceiro da Humble Store:",
        "footer_wa": "Ativação oficial Steam • Apoie a Comunidade Eureka",
    },
    "fanatical": {
        "name": "Fanatical",
        "tag_name": "FANATICAL",
        "color": 16738560,  # Laranja/Dourado Fanatical #FF6B00
        "avatar_url": "https://cdn.iconscout.com/icon/free/png-512/free-fanatical-3628766-3030012.png",
        "badge_title": "OFERTA DO DIA NA FANATICAL!",
        "footer_text": "Eureka Gaming • Parceiro Oficial Fanatical • Chave Steam",
        "call_to_action_discord": "Clique aqui para garantir na Fanatical",
        "call_to_action_wa": "Garanta o seu jogo pelo link de parceiro da Fanatical:",
        "footer_wa": "Ativação oficial Steam • Apoie a Comunidade Eureka",
    },
    "eneba": {
        "name": "Eneba",
        "tag_name": "ENEBA",
        "color": 5182702,  # Roxo Eneba #4F14EE
        "avatar_url": "https://cdn.iconscout.com/icon/free/png-512/free-eneba-3628761-3030007.png",
        "badge_title": "OFERTA DO DIA NA ENEBA!",
        "footer_text": "Eureka Gaming • Parceiro Oficial Eneba • Chave Steam",
        "call_to_action_discord": "Clique aqui para garantir na Eneba",
        "call_to_action_wa": "Garanta o seu jogo pelo link de parceiro da Eneba:",
        "footer_wa": "Ativação oficial Steam • Apoie a Comunidade Eureka",
    },
    "g2a": {
        "name": "G2A",
        "tag_name": "G2A",
        "color": 15751720,  # Vermelho/Laranja G2A #F05A28
        "avatar_url": "https://cdn.iconscout.com/icon/free/png-512/free-g2a-3628768-3030014.png",
        "badge_title": "OFERTA DO DIA NA G2A!",
        "footer_text": "Eureka Gaming • Parceiro Oficial G2A • Chave Steam",
        "call_to_action_discord": "Clique aqui para garantir na G2A",
        "call_to_action_wa": "Garanta o seu jogo pelo link de parceiro da G2A:",
        "footer_wa": "Ativação oficial Steam • Apoie a Comunidade Eureka",
    },
}

STORES_CYCLE = ["instant_gaming", "humble_store", "fanatical", "eneba", "g2a"]


def get_next_store():
    """Alterna ciclicamente entre Instant Gaming, Humble Store, Fanatical, Eneba e G2A a cada postagem."""
    if os.path.exists(LAST_STORE_FILE):
        try:
            with open(LAST_STORE_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
                last = data.get("last_store", "").lower()
                if last in STORES_CYCLE:
                    idx = STORES_CYCLE.index(last)
                    return STORES_CYCLE[(idx + 1) % len(STORES_CYCLE)]
        except Exception:
            pass
    return "g2a"  # Inicia com G2A para inaugurar a nova parceria!


def save_last_store(store_name):
    try:
        with open(LAST_STORE_FILE, "w", encoding="utf-8") as f:
            json.dump({"last_store": store_name, "updated_at": datetime.now(timezone.utc).isoformat()}, f, indent=2)
    except Exception as e:
        print(f"Aviso ao salvar última loja: {e}")


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


def build_affiliate_url(game_name, store="instant_gaming"):
    if store == "g2a":
        return G2A_AFFILIATE_LINK
    elif store == "eneba":
        query = urllib.parse.quote_plus(game_name)
        return f"https://www.eneba.com/store/all?text={query}&af_id=FrancisEureka01&utm_medium=af&utm_source=FrancisEureka01"
    elif store == "fanatical":
        target = f"https://www.fanatical.com/pt/search?search={urllib.parse.quote_plus(game_name)}"
        return f"{FANATICAL_AFFILIATE_BASE}{urllib.parse.quote(target, safe='')}"
    elif store == "humble_store":
        target = f"https://www.humblebundle.com/store/search?sort=bestselling&search={urllib.parse.quote_plus(game_name)}"
        return f"{HUMBLE_AFFILIATE_BASE}?u={urllib.parse.quote(target, safe='')}"
    else:
        query = urllib.parse.quote_plus(game_name)
        return f"https://www.instant-gaming.com/pt/procurar/?q={query}&igr={AFFILIATE_TAG}"


def translate_to_pt(text):
    """Garante que a sinopse e textos sobre o jogo estejam sempre em Português do Brasil."""
    if not text or not text.strip():
        return ""
    try:
        url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=pt&dt=t&q=" + urllib.parse.quote(text)
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=6) as res:
            data = json.loads(res.read().decode("utf-8"))
            return "".join([part[0] for part in data[0] if part[0]]).strip()
    except Exception as e:
        print(f"Aviso ao traduzir texto para português: {e}")
        return text


def get_game_details(app_id):
    """Busca sinopse em português e gêneros na API oficial da Steam, garantindo tradução se necessário."""
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
            if desc:
                desc = translate_to_pt(desc)
            if len(desc) > 300:
                desc = desc[:297] + "..."
            genres = [g.get("description", "") for g in app_data.get("genres", []) if g.get("description")]
            genres_str = ", ".join(genres[:3]) if genres else ""
            if genres_str:
                genres_str = translate_to_pt(genres_str)
            return {
                "description": desc,
                "genres": genres_str,
            }
    except Exception as e:
        print(f"Aviso ao buscar detalhes de {app_id}: {e}")
    return {"description": "", "genres": ""}


def post_deal(deal, store="instant_gaming"):
    cfg = STORE_CONFIG.get(store, STORE_CONFIG["instant_gaming"])
    name = deal["name"]
    discount = deal["discount"]
    # Usa espaço não-quebrável ( ) para impedir que R$ e valor quebrem de linha
    price = f"R$\u00a0{deal['final_price']:.2f}".replace(".", ",")
    orig_price = f"R$\u00a0{deal['orig_price']:.2f}".replace(".", ",")
    affiliate_link = build_affiliate_url(name, store=store)
    desc_text = deal.get("description", "")
    genres = deal.get("genres", "")

    fields = [
        {
            "name": "🏷️ Desconto",
            "value": f"` -{discount}% `",
            "inline": True,
        },
        {
            "name": "💰 De / Por",
            "value": f"~~{orig_price}~~\n➔ **{price}**",
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
            "inline": False,
        })

    if desc_text:
        fields.append({
            "name": "📖 Sobre o Jogo",
            "value": desc_text,
            "inline": False,
        })

    fields.append({
        "name": "🛒 Comprar Agora",
        "value": f"[👉 **{cfg['call_to_action_discord']}**]({affiliate_link})",
        "inline": False,
    })

    payload = {
        "username": f"Eureka Ofertas [{cfg['tag_name']}]",
        "avatar_url": cfg["avatar_url"],
        "embeds": [
            {
                "author": {
                    "name": f"{cfg['tag_name']} • CHAVE DIGITAL (STEAM / PC) 🎮",
                    "icon_url": "https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/steam.png",
                    "url": affiliate_link,
                },
                "thumbnail": {
                    "url": "https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/steam.png",
                },
                "title": f"🔥 [STEAM] {name} com -{discount}% de Desconto!",
                "url": affiliate_link,
                "description": (
                    f"⚡ **{cfg['badge_title']}**\n"
                    f"Chave digital oficial para ativação na **Steam** com preço reduzido.\n"
                    f"Ao comprar pelo link, você apoia diretamente a comunidade do Eureka sem pagar nada a mais por isso!"
                ),
                "color": cfg["color"],
                "fields": fields,
                "image": {"url": deal["image"]},
                "footer": {
                    "text": cfg["footer_text"],
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


def send_whatsapp_deal(deal, store="instant_gaming"):
    """Envia a oferta para o grupo do WhatsApp caso as variáveis de ambiente estejam configuradas."""
    api_url = (os.environ.get("WHATSAPP_API_URL") or "https://eureka-evolution.onrender.com").rstrip("/")
    api_key = os.environ.get("WHATSAPP_API_KEY") or "A829A3AB4468-4731-9173-1A15C8361FCB"
    instance = os.environ.get("WHATSAPP_INSTANCE") or "Eureka"
    group_id = os.environ.get("WHATSAPP_DEALS_GROUP") or "120363431894288091@g.us"  # Grupo Ofertinhas (Eureka)

    if not api_url or not api_key:
        return False

    cfg = STORE_CONFIG.get(store, STORE_CONFIG["instant_gaming"])
    name = deal["name"]
    discount = deal["discount"]
    price = f"R$ {deal['final_price']:.2f}".replace(".", ",")
    orig_price = f"R$ {deal['orig_price']:.2f}".replace(".", ",")
    affiliate_link = build_affiliate_url(name, store=store)
    desc_section = f"\n📖 *Sobre o jogo:*\n_{deal['description']}_\n" if deal.get("description") else ""
    genres_line = f"🏷️ Gêneros: {deal['genres']}\n" if deal.get("genres") else ""

    caption = (
        f"🏷️ *PLATAFORMA:* *【 STEAM / PC DIGITAL 】*\n"
        f"🔥 *{cfg['badge_title']}*\n\n"
        f"🕹️ *{name}* com *-{discount}% de Desconto!*\n"
        f"💰 De: ~{orig_price}~ por APENAS *{price}*\n"
        f"🔑 Plataforma: Steam / PC Digital\n"
        f"{genres_line}"
        f"{desc_section}\n"
        f"🛒 *{cfg['call_to_action_wa']}*\n"
        f"👉 {affiliate_link}\n\n"
        f"⚡ _{cfg['footer_wa']}_"
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
            print(f"[Ofertas] Ultima oferta postada ha {elapsed:.1f}h. Aguardando intervalo de {min_interval_hours}h.")
            return

    # Determina a loja desta rodada (rotacao alternada entre Instant Gaming, Humble Store, Fanatical, Eneba e G2A)
    store = get_next_store()
    print(f"[Ofertas] Loja selecionada para esta postagem: {store.upper()}")

    deals = get_daily_deals()
    posted_count = 0

    for deal in deals:
        if is_deal_recent(deal["id"], history, max_age_days=3):
            continue

        details = get_game_details(deal["id"])
        deal["description"] = details["description"]
        deal["genres"] = details["genres"]

        print(f"Postando oferta na {store.upper()}: {deal['name']} (-{deal['discount']}%)")
        discord_ok = post_deal(deal, store=store)
        whatsapp_ok = send_whatsapp_deal(deal, store=store)

        if discord_ok or whatsapp_ok:
            history[deal["id"]] = datetime.now(timezone.utc).isoformat()
            save_last_store(store)
            posted_count += 1
            if posted_count >= max_deals:
                break

    save_history(history)
    print(f"Total de ofertas publicadas hoje: {posted_count}")


if __name__ == "__main__":
    run()

