"""
Free Games Daily Poster for Discord
Canal: #🎁・jogos-grátis
Plataformas: Steam, Epic Games Store, GOG, etc.
"""

import json
import os
import time
import urllib.request
from datetime import datetime, timezone

WEBHOOK_URL = "https://discord.com/api/webhooks/1547218388340842567/NpTOzsR2KppRLMAQDW8OlCykKbt4Cz2cTaX8nNKtag00MGOniCBZnOxUAFCUFT7Y1TUT"
HISTORY_FILE = os.path.join(os.path.dirname(__file__), "posted_free_games_history.json")


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
        print(f"Erro ao salvar histórico de jogos grátis: {e}")


def get_free_games():
    """Busca jogos 100% gratuitos para PC de lojas oficiais (Steam, Epic, GOG)."""
    platforms = ["steam", "epic-games-store", "gog"]
    all_games = []

    for plat in platforms:
        url = f"https://www.gamerpower.com/api/giveaways?platform={plat}&type=game"
        req = urllib.request.Request(
            url,
            headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            },
        )
        try:
            with urllib.request.urlopen(req, timeout=12) as res:
                data = json.loads(res.read().decode("utf-8"))
                if isinstance(data, list):
                    all_games.extend(data)
        except Exception as e:
            print(f"Aviso ao consultar plataforma {plat}: {e}")

    # Remove duplicados por ID
    unique_games = {}
    for g in all_games:
        gid = str(g.get("id", g.get("title", "")))
        if gid not in unique_games:
            unique_games[gid] = g

    return list(unique_games.values())


def post_free_game(game):
    title = game.get("title", "Jogo Grátis")
    platforms = game.get("platforms", "PC")
    worth = game.get("worth", "N/A")
    giveaway_url = game.get("open_giveaway_url", "")
    image_url = game.get("image", "")
    description = game.get("description", "")
    end_date = game.get("end_date", "")

    # Limita tamanho da descrição para manter o embed enxuto
    # Limita tamanho da descrição para manter a mensagem bem estruturada
    if len(description) > 280:
        description = description[:277] + "..."

    worth_text = f"~~{worth}~~ ➡️ **GRÁTIS (100% OFF)**" if worth != "N/A" else "**100% GRÁTIS**"

    embed = {
        "title": f"🎁 JOGO 100% GRÁTIS: {title}",
        "url": giveaway_url,
        "description": (
            f"⚡ **Novo jogo gratuito disponível para resgate permanente!**\n"
            f"Adicione à sua biblioteca antes do fim da promoção para ficar com ele para sempre.\n\n"
            f"📖 **Sobre o jogo:**\n{description}"
        ),
        "color": 3066993,  # Verde Esmeralda #2ECC71
        "fields": [
            {
                "name": "🏷️ Preço Original",
                "value": worth_text,
                "inline": True,
            },
            {
                "name": "🔑 Plataforma",
                "value": platforms,
                "inline": True,
            },
            {
                "name": "📥 Onde Resgatar",
                "value": f"[👉 **Clique aqui para resgatar na loja**]({giveaway_url})",
                "inline": False,
            },
        ],
        "image": {"url": image_url} if image_url else None,
        "footer": {
            "text": "Comunidade Eureka • Jogos 100% Grátis para PC" + (f" • Válido até: {end_date}" if end_date and end_date != "N/A" else "")
        },
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }

    payload = {
        "username": "Eureka Jogos Grátis",
        "avatar_url": "https://cdn-icons-png.flaticon.com/512/686/686589.png",
        "embeds": [embed],
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


def send_whatsapp_free_game(game):
    """Envia o jogo grátis para o grupo do WhatsApp caso as variáveis de ambiente estejam configuradas."""
    api_url = (os.environ.get("WHATSAPP_API_URL") or "https://eureka-evolution.onrender.com").rstrip("/")
    api_key = os.environ.get("WHATSAPP_API_KEY") or "A829A3AB4468-4731-9173-1A15C8361FCB"
    instance = os.environ.get("WHATSAPP_INSTANCE") or "Eureka"
    group_id = os.environ.get("WHATSAPP_FREE_GAMES_GROUP") or "120363409592479695@g.us"  # Grupo Jogos Grátis (Eureka)

    if not api_url or not api_key:
        return False

    title = game.get("title", "Jogo Grátis")
    platforms = game.get("platforms", "PC")
    worth = game.get("worth", "N/A")
    giveaway_url = game.get("open_giveaway_url", "")
    description = game.get("description", "").strip()
    if len(description) > 280:
        description = description[:277] + "..."
    worth_text = f"~{worth}~ ➡️ *GRÁTIS (100% OFF)*" if worth != "N/A" else "*100% GRÁTIS*"

    desc_section = f"\n📖 *Sobre o jogo:*\n_{description}_\n" if description else ""

    caption = (
        f"🎁 *JOGO 100% GRÁTIS DISPONÍVEL!*\n\n"
        f"🎮 *{title}*\n"
        f"🏷️ Preço Original: {worth_text}\n"
        f"🔑 Plataforma: {platforms}\n"
        f"{desc_section}\n"
        f"📥 *Resgate agora para a sua conta antes do fim da promoção:*\n"
        f"{giveaway_url}\n\n"
        f"⚡ _Comunidade Eureka • Jogos Grátis para PC_"
    )

    endpoint = f"{api_url}/message/sendMedia/{instance}"
    payload = {
        "number": group_id,
        "mediatype": "image",
        "mimetype": "image/jpeg",
        "caption": caption,
        "media": game.get("image", ""),
        "fileName": f"{title}.jpg",
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
            print(f"Tentativa {attempt}/3 - Aviso ao enviar jogo grátis para o WhatsApp: {e}")
            if attempt < 3:
                time.sleep(6)
    return False


def run(max_games=2):
    history = load_history()
    games = get_free_games()
    posted_count = 0

    for game in games:
        gid = str(game.get("id", game.get("title", "")))
        if gid in history:
            continue

        print(f"Postando jogo grátis: {game.get('title')}")
        discord_ok = post_free_game(game)
        whatsapp_ok = send_whatsapp_free_game(game)

        if discord_ok or whatsapp_ok:
            history[gid] = datetime.now(timezone.utc).isoformat()
            posted_count += 1
            if posted_count >= max_games:
                break

    save_history(history)
    print(f"Total de jogos grátis publicados: {posted_count}")


if __name__ == "__main__":
    run()

