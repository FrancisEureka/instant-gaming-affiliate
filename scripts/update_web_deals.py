"""
Eureka Gaming Deals & Free Games Web Catalog Generator
Compila todas as ofertas ativas (Instant Gaming, Humble, Fanatical, Eneba, G2A)
e jogos gratuitos em um arquivo JSON estático de alta performance (public/data/deals.json).
Executado automaticamente pelo GitHub Actions a cada ciclo de postagens.
"""

import json
import os
import sys
import time
import urllib.parse
import urllib.request
from datetime import datetime, timezone

SCRIPTS_DIR = os.path.dirname(__file__)
ROOT_DIR = os.path.dirname(SCRIPTS_DIR)
OUTPUT_FILE = os.path.join(ROOT_DIR, "public", "data", "deals.json")

# Afiliados Oficiais Eureka Gaming
AFFILIATE_TAG_IG = "franciseureka"
HUMBLE_AFFILIATE_BASE = "https://humblebundleinc.sjv.io/c/7758631/2059850/25796"
FANATICAL_AFFILIATE_BASE = "https://www.awin1.com/cread.php?awinmid=118821&awinaffid=3091639&ued="
ENEBA_PARAMS = "af_id=FrancisEureka01&utm_medium=af&utm_source=FrancisEureka01"
G2A_AFFILIATE_LINK = "https://www.g2a.com/n/reflink-e9ca0b6c48"
GREENMAN_AFFILIATE_BASE = "https://greenmangaming.sjv.io/9Vd6v0"

STORE_INFO = {
    "instant_gaming": {
        "name": "Instant Gaming",
        "tag": "INSTANT GAMING",
        "color": "#FF7F00",
        "badge": "bg-orange-500/20 text-orange-400 border border-orange-500/30",
    },
    "green_man_gaming": {
        "name": "Green Man Gaming",
        "tag": "GREEN MAN GAMING",
        "color": "#00D166",
        "badge": "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
    },
    "humble_store": {
        "name": "Humble Store",
        "tag": "HUMBLE STORE",
        "color": "#CB2727",
        "badge": "bg-red-500/20 text-red-400 border border-red-500/30",
    },
    "fanatical": {
        "name": "Fanatical",
        "tag": "FANATICAL",
        "color": "#FF6B00",
        "badge": "bg-amber-500/20 text-amber-400 border border-amber-500/30",
    },
    "eneba": {
        "name": "Eneba",
        "tag": "ENEBA",
        "color": "#5928E5",
        "badge": "bg-purple-500/20 text-purple-400 border border-purple-500/30",
    },
    "g2a": {
        "name": "G2A",
        "tag": "G2A",
        "color": "#F05A28",
        "badge": "bg-rose-500/20 text-rose-400 border border-rose-500/30",
    },
    "epic_games": {
        "name": "Epic Games",
        "tag": "EPIC GAMES",
        "color": "#0078F2",
        "badge": "bg-blue-500/20 text-blue-400 border border-blue-500/30",
    },
    "steam": {
        "name": "Steam",
        "tag": "STEAM",
        "color": "#1B2838",
        "badge": "bg-slate-700/40 text-slate-300 border border-slate-600/30",
    },
    "gog": {
        "name": "GOG.com",
        "tag": "GOG",
        "color": "#862D86",
        "badge": "bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30",
    },
}

PARTNER_ROTATION = ["instant_gaming", "green_man_gaming", "humble_store", "fanatical", "eneba", "g2a"]


def build_store_links(game_name):
    """Gera os links de afiliados para todas as 6 lojas parceiras para este jogo específico."""
    query = urllib.parse.quote_plus(game_name)
    fanatical_target = f"https://www.fanatical.com/pt/search?search={query}"
    humble_target = f"https://www.humblebundle.com/store/search?sort=bestselling&search={query}"
    gmg_target = f"https://www.greenmangaming.com/search?query={query}"

    return {
        "instant_gaming": f"https://www.instant-gaming.com/pt/procurar/?q={query}&igr={AFFILIATE_TAG_IG}",
        "green_man_gaming": f"{GREENMAN_AFFILIATE_BASE}?u=" + urllib.parse.quote(gmg_target, safe=""),
        "humble_store": f"{HUMBLE_AFFILIATE_BASE}?u={urllib.parse.quote(humble_target, safe='')}",
        "fanatical": f"{FANATICAL_AFFILIATE_BASE}{urllib.parse.quote(fanatical_target, safe='')}",
        "eneba": f"https://www.eneba.com/store/all?text={query}&{ENEBA_PARAMS}",
        "g2a": G2A_AFFILIATE_LINK,
    }


def fetch_steam_deals():
    """Busca ofertas em destaque da Steam (em Reais)."""
    deals = []
    seen = set()
    try:
        url = "https://store.steampowered.com/api/featuredcategories/?cc=br&l=brazilian"
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
        with urllib.request.urlopen(req, timeout=12) as res:
            data = json.loads(res.read().decode("utf-8"))

        raw_items = []
        for cat in ["specials", "top_sellers", "under_ten"]:
            if cat in data and "items" in data[cat]:
                raw_items.extend(data[cat]["items"])

        for idx, item in enumerate(raw_items):
            item_id = str(item.get("id", item.get("name", "")))
            discount = item.get("discount_percent", 0)
            final_p = item.get("final_price", 0) / 100.0
            orig_p = item.get("original_price", 0) / 100.0
            name = item.get("name", "").strip()

            if not name or discount < 20 or final_p <= 0 or item_id in seen:
                continue

            seen.add(item_id)
            partner = PARTNER_ROTATION[idx % len(PARTNER_ROTATION)]
            store_links = build_store_links(name)

            deals.append({
                "id": f"steam_{item_id}",
                "steam_app_id": item_id,
                "title": name,
                "store": partner,
                "store_name": STORE_INFO[partner]["name"],
                "store_color": STORE_INFO[partner]["color"],
                "store_badge": STORE_INFO[partner]["badge"],
                "discount": discount,
                "original_price": orig_p,
                "original_price_formatted": f"R$ {orig_p:.2f}".replace(".", ","),
                "final_price": final_p,
                "final_price_formatted": f"R$ {final_p:.2f}".replace(".", ","),
                "image": item.get("header_image") or f"https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/{item_id}/header.jpg",
                "affiliate_url": store_links[partner],
                "all_store_links": store_links,
                "is_free": False,
                "is_historical_low": discount >= 75 or final_p <= 20.0,
                "badge_label": "MENOR HISTÓRICO" if discount >= 80 else ("SUPER OFERTA" if discount >= 60 else "OFERTA DO DIA"),
                "platform": "Steam / PC Digital",
            })
    except Exception as e:
        print(f"Aviso ao buscar Steam deals: {e}")
    return deals


def fetch_cheapshark_deals():
    """Busca ofertas adicionais com grandes descontos pelo CheapShark."""
    deals = []
    seen = set()
    try:
        url = "https://www.cheapshark.com/api/1.0/deals?storeID=1&pageSize=50&onSale=1&sortBy=Savings"
        req = urllib.request.Request(url, headers={"User-Agent": "EurekaDeals/2.0"})
        with urllib.request.urlopen(req, timeout=12) as res:
            data = json.loads(res.read().decode("utf-8"))

        for idx, item in enumerate(data):
            app_id = str(item.get("steamAppID", ""))
            title = item.get("title", "").strip()
            savings = float(item.get("savings", 0))
            sale_price = float(item.get("salePrice", 0)) * 5.40  # Conversão USD -> BRL
            normal_price = float(item.get("normalPrice", 0)) * 5.40

            if not app_id or savings < 40 or sale_price <= 0 or not title or app_id in seen:
                continue

            seen.add(app_id)
            partner = PARTNER_ROTATION[(idx + 2) % len(PARTNER_ROTATION)]
            store_links = build_store_links(title)

            deals.append({
                "id": f"cs_{app_id}",
                "steam_app_id": app_id,
                "title": title,
                "store": partner,
                "store_name": STORE_INFO[partner]["name"],
                "store_color": STORE_INFO[partner]["color"],
                "store_badge": STORE_INFO[partner]["badge"],
                "discount": int(round(savings)),
                "original_price": round(normal_price, 2),
                "original_price_formatted": f"R$ {normal_price:.2f}".replace(".", ","),
                "final_price": round(sale_price, 2),
                "final_price_formatted": f"R$ {sale_price:.2f}".replace(".", ","),
                "image": f"https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/{app_id}/header.jpg",
                "affiliate_url": store_links[partner],
                "all_store_links": store_links,
                "is_free": False,
                "is_historical_low": savings >= 75,
                "badge_label": "MENOR HISTÓRICO" if savings >= 80 else "OFERTA DO DIA",
                "platform": "Steam / PC Digital",
            })
    except Exception as e:
        print(f"Aviso ao buscar CheapShark deals: {e}")
    return deals


def fetch_free_games():
    """Busca jogos 100% gratuitos disponíveis no momento (GamerPower API)."""
    free_games = []
    try:
        url = "https://www.gamerpower.com/api/giveaways?type=game&platform=pc"
        req = urllib.request.Request(url, headers={"User-Agent": "EurekaBot/2.0"})
        with urllib.request.urlopen(req, timeout=12) as res:
            data = json.loads(res.read().decode("utf-8"))

        for item in data[:20]:
            title = item.get("title", "").strip()
            worth = item.get("worth", "N/A")
            store_raw = (item.get("platforms", "") + " " + title).lower()
            open_url = item.get("open_giveaway_url") or item.get("giveaway_url")
            image = item.get("image", "")

            store_key = "epic_games"
            if "steam" in store_raw:
                store_key = "steam"
            elif "gog" in store_raw:
                store_key = "gog"

            # Limpa sufixos de títulos
            for suffix in ["(IndieGala) Giveaway", "(Epic Games) Giveaway", "(Steam) Giveaway", "Giveaway"]:
                title = title.replace(suffix, "").strip()

            free_games.append({
                "id": f"free_{item.get('id', title)}",
                "title": title,
                "store": store_key,
                "store_name": STORE_INFO.get(store_key, {}).get("name", "PC Digital"),
                "store_color": STORE_INFO.get(store_key, {}).get("color", "#22C55E"),
                "store_badge": STORE_INFO.get(store_key, {}).get("badge", "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"),
                "discount": 100,
                "original_price": 0.0,
                "original_price_formatted": worth if worth != "N/A" else "R$ 49,99",
                "final_price": 0.0,
                "final_price_formatted": "GRÁTIS",
                "image": image,
                "affiliate_url": open_url,
                "all_store_links": {"official": open_url},
                "is_free": True,
                "is_historical_low": True,
                "badge_label": "100% GRÁTIS",
                "platform": "Resgate Permanente",
                "end_date": item.get("end_date", "Ativo"),
            })
    except Exception as e:
        print(f"Aviso ao buscar Free Games: {e}")
    return free_games


def main():
    print("[Web Catalog] Iniciando coleta de ofertas para o site...")
    steam_deals = fetch_steam_deals()
    cs_deals = fetch_cheapshark_deals()
    free_games = fetch_free_games()

    # Mescla e desduplica ofertas pagas por título
    combined_deals = []
    seen_titles = set()

    # Dá prioridade a jogos grátis no topo do catálogo
    all_items = free_games + steam_deals + cs_deals

    for item in all_items:
        key = item["title"].lower().strip()
        if key in seen_titles:
            continue
        seen_titles.add(key)
        combined_deals.append(item)

    print(f"[Web Catalog] Total de itens coletados: {len(combined_deals)} ({len(free_games)} jogos grátis, {len(combined_deals)-len(free_games)} ofertas)")

    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)

    catalog_data = {
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "total_items": len(combined_deals),
        "total_free": len(free_games),
        "creator": {
            "name": "Eureka Gaming",
            "tagline": "As Melhores Promoções e Jogos Grátis para PC",
            "avatar": "https://gaming-cdn.com/images/favicon/favicon.png",
            "socials": {
                "discord": "https://discord.gg/h2qMvV264T",
                "whatsapp": "https://chat.whatsapp.com/G4f13oF0z0L4GZ24HhOq4w",
                "youtube": "https://www.youtube.com/@franciseureka",
                "instagram": "https://www.instagram.com/franciseureka",
                "kick": "https://kick.com/franciseureka",
            },
        },
        "deals": combined_deals,
    }

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(catalog_data, f, ensure_ascii=False, indent=2)

    print(f"[Web Catalog] Catálogo salvo com sucesso em: {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
