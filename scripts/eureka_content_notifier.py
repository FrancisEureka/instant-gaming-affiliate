"""
Eureka Content Notifier
Notificações automáticas de:
- Abertura de Live na Twitch (francis_eureka)
- Novos Vídeos no YouTube (Francis Eureka)
- Memes e atualizações

Canais:
- Discord: #🔴・lives-e-vídeos
- WhatsApp: Padoka dos Gamers
"""

import json
import os
import re
import sys
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

# Webhook do Discord para #🔴・lives-e-vídeos
DISCORD_LIVES_WEBHOOK = "https://discord.com/api/webhooks/1547305895111958659/WjO2GnIrPjr6SEpwgZMTwTmEUKMis1p49FdYweVBPodOj9_Rp-GEwJR1GTMn9FW_09P0"

# Webhook do Discord para #😂・memes
DISCORD_MEMES_WEBHOOK = "https://discord.com/api/webhooks/1547306853677928551/D8Cbi17wScj6ZbMLjhvkMAzHRXqRmDQWMNcEQVmcjC16TIZvs41ibfmg8M6JtJfio6dp"

# Configurações do WhatsApp (Evolution API)
WHATSAPP_API_URL = os.environ.get("WHATSAPP_API_URL", "https://eureka-evolution.onrender.com")
WHATSAPP_API_KEY = os.environ.get("WHATSAPP_API_KEY", "A829A3AB4468-4731-9173-1A15C8361FCB")
WHATSAPP_INSTANCE = os.environ.get("WHATSAPP_INSTANCE", "Eureka")
# Grupo Padoka dos Gamers
WHATSAPP_LIVES_GROUP = os.environ.get("WHATSAPP_LIVES_GROUP", "120363402639065341@g.us")

# Arquivos de histórico
HISTORY_DIR = os.path.dirname(__file__)
YOUTUBE_HISTORY_FILE = os.path.join(HISTORY_DIR, "posted_youtube_history.json")
TWITCH_HISTORY_FILE = os.path.join(HISTORY_DIR, "posted_twitch_history.json")

# Identificadores Oficiais
YOUTUBE_CHANNEL_ID = "UCgvbk72oiJLHQ6lsJjk2cvg"
TWITCH_USERNAME = "francis_eureka"


def load_history(filepath):
    if os.path.exists(filepath):
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return {}
    return {}


def save_history(filepath, data):
    try:
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    except Exception as e:
        print(f"Erro ao salvar histórico ({filepath}): {e}")


# ==========================================
# 🟣 1. TWITCH - Notificação de Live On
# ==========================================

def check_twitch_live():
    """Consulta se Francis Eureka está ao vivo na Twitch via Decapi."""
    try:
        uptime_url = f"https://decapi.me/twitch/uptime/{TWITCH_USERNAME}"
        req = urllib.request.Request(uptime_url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=8) as res:
            uptime = res.read().decode("utf-8").strip()

        if "offline" in uptime.lower() or not uptime:
            return None

        # Live está ONLINE! Pega título e categoria/jogo
        title_url = f"https://decapi.me/twitch/title/{TWITCH_USERNAME}"
        req_title = urllib.request.Request(title_url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req_title, timeout=8) as res:
            title = res.read().decode("utf-8").strip()

        game_url = f"https://decapi.me/twitch/game/{TWITCH_USERNAME}"
        req_game = urllib.request.Request(game_url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req_game, timeout=8) as res:
            game = res.read().decode("utf-8").strip()

        return {
            "uptime": uptime,
            "title": title or "🔴 Live On com Francis Eureka!",
            "game": game or "Variedades",
            "url": f"https://www.twitch.tv/{TWITCH_USERNAME}",
            "preview": f"https://static-cdn.jtvnw.net/previews-ttv/live_user_{TWITCH_USERNAME}-1280x720.jpg",
        }
    except Exception as e:
        print(f"Aviso ao checar Twitch: {e}")
        return None


def post_twitch_live(live):
    history = load_history(TWITCH_HISTORY_FILE)
    today_key = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    # Evita múltiplos alertas no mesmo dia se já notificou a sessão
    last_notified = history.get("last_session", "")
    if last_notified == today_key:
        print("Live da Twitch já notificada hoje.")
        return False

    title = live["title"]
    game = live["game"]
    url = live["url"]
    preview = live["preview"]

    # 1. Enviar para Discord
    discord_payload = {
        "content": "@everyone 🔴 **FRANCIS EUREKA ESTÁ AO VIVO NA TWITCH!** Vem colar na live!",
        "username": "Eureka Lives",
        "avatar_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/twitch-profile_image-70x70.png",
        "embeds": [
            {
                "title": f"🎮 {title}",
                "url": url,
                "description": (
                    f"🟣 **A live acabou de começar!**\n\n"
                    f"🕹️ **Jogando:** `{game}`\n"
                    f"⚡ Vem interagir no chat, dar risada e jogar junto com a comunidade!"
                ),
                "color": 9520895,  # Roxo Twitch #9146FF
                "fields": [
                    {
                        "name": "🔗 Assistir Agora",
                        "value": f"[👉 **Clique aqui para abrir a Twitch**]({url})",
                        "inline": False,
                    }
                ],
                "image": {"url": f"{preview}?t={int(datetime.now().timestamp())}"},
                "footer": {"text": "Comunidade Eureka • Twitch Ao Vivo"},
                "timestamp": datetime.now(timezone.utc).isoformat(),
            }
        ],
    }

    req = urllib.request.Request(
        DISCORD_LIVES_WEBHOOK,
        data=json.dumps(discord_payload).encode("utf-8"),
        headers={"Content-Type": "application/json", "User-Agent": "Mozilla/5.0"},
    )
    try:
        with urllib.request.urlopen(req, timeout=10):
            print("Notificação de live enviada no Discord com sucesso!")
    except Exception as e:
        print(f"Erro ao enviar live no Discord: {e}")

    # 2. Enviar para WhatsApp (Padoka dos Gamers)
    whatsapp_caption = (
        f"🔴 *FRANCIS EUREKA ESTÁ AO VIVO NA TWITCH!*\n\n"
        f"🎮 *{title}*\n"
        f"🕹️ Jogando: *{game}*\n\n"
        f"A live acabou de começar! Vem trocar uma ideia no chat:\n"
        f"{url}\n\n"
        f"⚡ _Padoka dos Gamers • Comunidade Eureka_"
    )
    send_whatsapp_message(WHATSAPP_LIVES_GROUP, whatsapp_caption, media_url=preview)

    history["last_session"] = today_key
    history["last_title"] = title
    save_history(TWITCH_HISTORY_FILE, history)
    return True


# ==========================================
# 📺 2. YOUTUBE - Novos Vídeos
# ==========================================

def get_latest_youtube_videos():
    """Lê o feed RSS oficial do canal do YouTube."""
    feed_url = f"https://www.youtube.com/feeds/videos.xml?channel_id={YOUTUBE_CHANNEL_ID}"
    req = urllib.request.Request(feed_url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=12) as res:
        xml_content = res.read()

    root = ET.fromstring(xml_content)
    ns = {
        "atom": "http://www.w3.org/2005/Atom",
        "yt": "http://www.youtube.com/xml/schemas/2015",
        "media": "http://search.yahoo.com/mrss/",
    }

    videos = []
    for entry in root.findall("atom:entry", ns):
        video_id = entry.find("yt:videoId", ns).text
        title = entry.find("atom:title", ns).text
        link = entry.find("atom:link", ns).attrib["href"]
        published = entry.find("atom:published", ns).text

        # Pega a descrição
        media_group = entry.find("media:group", ns)
        description = ""
        thumbnail = f"https://i.ytimg.com/vi/{video_id}/maxresdefault.jpg"
        if media_group is not None:
            desc_el = media_group.find("media:description", ns)
            if desc_el is not None and desc_el.text:
                description = desc_el.text.strip()
            thumb_el = media_group.find("media:thumbnail", ns)
            if thumb_el is not None and "url" in thumb_el.attrib:
                thumbnail = thumb_el.attrib["url"]

        if len(description) > 280:
            description = description[:277] + "..."

        videos.append({
            "id": video_id,
            "title": title,
            "url": link,
            "published": published,
            "description": description,
            "thumbnail": thumbnail,
        })

    return videos


def post_youtube_video(video):
    video_id = video["id"]
    title = video["title"]
    url = video["url"]
    desc = video["description"]
    thumb = video["thumbnail"]

    # 1. Postar no Discord
    discord_payload = {
        "content": "🎬 **VÍDEO NOVO NO CANAL DO YOUTUBE!** Corre lá pra assistir e deixar o like! 👍",
        "username": "Francis Eureka • YouTube",
        "avatar_url": "https://yt3.googleusercontent.com/zxmqDC1CAxrRE-XNbFG2E5R-d-7nnfu9RXYy18IMsjR4iKGDff47-ZJr-xhdJp-N115Q1iS_jfc=s800-c-k-c0x00ffffff-no-rj",
        "embeds": [
            {
                "title": f"▶️ {title}",
                "url": url,
                "description": (
                    f"📖 **Sinopse do vídeo:**\n_{desc}_\n\n"
                    f"Inscreva-se e fortaleça o canal com seu feedback!"
                ),
                "color": 16711680,  # Vermelho YouTube #FF0000
                "fields": [
                    {
                        "name": "🍿 Assistir no YouTube",
                        "value": f"[👉 **Clique aqui para assistir**]({url})",
                        "inline": False,
                    }
                ],
                "image": {"url": thumb},
                "footer": {"text": "Francis Eureka • Canal Oficial"},
                "timestamp": datetime.now(timezone.utc).isoformat(),
            }
        ],
    }

    req = urllib.request.Request(
        DISCORD_LIVES_WEBHOOK,
        data=json.dumps(discord_payload).encode("utf-8"),
        headers={"Content-Type": "application/json", "User-Agent": "Mozilla/5.0"},
    )
    try:
        with urllib.request.urlopen(req, timeout=10):
            print(f"Vídeo do YouTube publicado no Discord: {title}")
    except Exception as e:
        print(f"Erro ao publicar vídeo no Discord: {e}")

    # 2. Postar no WhatsApp (Padoka dos Gamers)
    whatsapp_caption = (
        f"🎬 *NOVO VÍDEO NO CANAL DO FRANCIS EUREKA!*\n\n"
        f"▶️ *{title}*\n\n"
        f"📖 _{desc}_\n\n"
        f"🍿 *Assista agora no YouTube:*\n"
        f"{url}\n\n"
        f"⚡ _Padoka dos Gamers • Comunidade Eureka_"
    )
    send_whatsapp_message(WHATSAPP_LIVES_GROUP, whatsapp_caption, media_url=thumb)


def check_youtube():
    history = load_history(YOUTUBE_HISTORY_FILE)
    videos = get_latest_youtube_videos()
    new_count = 0

    for video in videos:
        vid = video["id"]
        if vid in history:
            continue

        print(f"Novo vídeo detectado: {video['title']}")
        post_youtube_video(video)
        history[vid] = datetime.now(timezone.utc).isoformat()
        new_count += 1
        # Processa no máximo 1 vídeo novo por execução
        break

    save_history(YOUTUBE_HISTORY_FILE, history)
    return new_count


# ==========================================
# 💬 HELPER WHATSAPP (Evolution API)
# ==========================================

def send_whatsapp_message(group_id, text, media_url=None):
    if not WHATSAPP_API_URL or not WHATSAPP_API_KEY:
        return False

    endpoint = f"{WHATSAPP_API_URL.rstrip('/')}/message/sendText/{WHATSAPP_INSTANCE}"
    payload = {
        "number": group_id,
        "text": text,
    }

    # Se tiver imagem, usa sendMedia
    if media_url:
        endpoint = f"{WHATSAPP_API_URL.rstrip('/')}/message/sendMedia/{WHATSAPP_INSTANCE}"
        payload = {
            "number": group_id,
            "mediatype": "image",
            "mimetype": "image/jpeg",
            "caption": text,
            "media": media_url,
            "fileName": "thumb.jpg",
        }

    try:
        req = urllib.request.Request(
            endpoint,
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Content-Type": "application/json",
                "apikey": WHATSAPP_API_KEY,
                "User-Agent": "Mozilla/5.0",
            },
        )
        with urllib.request.urlopen(req, timeout=15) as res:
            return res.status in (200, 201)
    except Exception as e:
        print(f"Aviso ao enviar mensagem para WhatsApp: {e}")
        return False


def run():
    print("--- Verificando Notificações Eureka (Twitch & YouTube) ---")

    # 1. Twitch
    live = check_twitch_live()
    if live:
        print(f"Twitch: {TWITCH_USERNAME} está AO VIVO!")
        post_twitch_live(live)
    else:
        print(f"Twitch: {TWITCH_USERNAME} está offline.")

    # 2. YouTube
    new_vids = check_youtube()
    print(f"YouTube: {new_vids} novos vídeos processados.")


if __name__ == "__main__":
    run()
