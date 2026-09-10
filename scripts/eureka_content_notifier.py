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
import time
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

# Webhook do Discord para #🔴・lives
DISCORD_LIVES_WEBHOOK = "https://discord.com/api/webhooks/1547305895111958659/WjO2GnIrPjr6SEpwgZMTwTmEUKMis1p49FdYweVBPodOj9_Rp-GEwJR1GTMn9FW_09P0"

# Webhook do Discord para #🎬・vídeos
DISCORD_VIDEOS_WEBHOOK = "https://discord.com/api/webhooks/1547583809527095358/DXWbssLZeGd5xXaEx5RnAUsneDQ7CkMILwmoqKJJEEbTPXnfuuCrBqRlPZYxoQR7tlQY"

# Webhook do Discord para #😂・memes
DISCORD_MEMES_WEBHOOK = "https://discord.com/api/webhooks/1547306853677928551/D8Cbi17wScj6ZbMLjhvkMAzHRXqRmDQWMNcEQVmcjC16TIZvs41ibfmg8M6JtJfio6dp"

# Configurações do WhatsApp (Evolution API)
WHATSAPP_API_URL = (os.environ.get("WHATSAPP_API_URL") or "https://eureka-evolution.onrender.com").rstrip("/")
WHATSAPP_API_KEY = os.environ.get("WHATSAPP_API_KEY") or "A829A3AB4468-4731-9173-1A15C8361FCB"
WHATSAPP_INSTANCE = os.environ.get("WHATSAPP_INSTANCE") or "Eureka"
# Grupo Padoka dos Gamers (destinado a novos vídeos do YouTube e memes)
WHATSAPP_LIVES_GROUP = os.environ.get("WHATSAPP_LIVES_GROUP") or "120363402639065341@g.us"
# Usuário definiu que no Padoka só entram novos vídeos do YouTube e memes do Instagram
NOTIFY_LIVES_ON_WHATSAPP = False

# Arquivos de histórico
HISTORY_DIR = os.path.dirname(__file__)
YOUTUBE_HISTORY_FILE = os.path.join(HISTORY_DIR, "posted_youtube_history.json")
LIVE_HISTORY_FILE = os.path.join(HISTORY_DIR, "posted_live_history.json")

# Identificadores Oficiais
YOUTUBE_CHANNEL_ID = "UCgvbk72oiJLHQ6lsJjk2cvg"
TWITCH_USERNAME = "francis_eureka"
KICK_USERNAME = "franciseureka"


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
# 🔴 1. MULTISTREAM - Lives Simultâneas (Twitch, Kick, YouTube)
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
            "platform": "Twitch",
            "name": "Twitch",
            "icon": "🟣",
            "uptime": uptime,
            "title": title or "🔴 Live On com Francis Eureka!",
            "game": game or "Variedades",
            "url": f"https://www.twitch.tv/{TWITCH_USERNAME}",
            "preview": f"https://static-cdn.jtvnw.net/previews-ttv/live_user_{TWITCH_USERNAME}-1280x720.jpg",
        }
    except Exception as e:
        print(f"Aviso ao checar Twitch: {e}")
        return None


def check_kick_live():
    """Consulta se Francis Eureka está ao vivo na Kick via API oficial."""
    try:
        url = f"https://kick.com/api/v2/channels/{KICK_USERNAME}"
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
        with urllib.request.urlopen(req, timeout=8) as res:
            data = json.loads(res.read().decode("utf-8"))
            livestream = data.get("livestream")
            if not livestream:
                return None

            title = livestream.get("session_title") or "🔴 Live On na Kick!"
            categories = livestream.get("categories", [])
            game = categories[0].get("name") if categories else "Variedades"
            thumb = livestream.get("thumbnail", {}).get("url") if isinstance(livestream.get("thumbnail"), dict) else None

            return {
                "platform": "Kick",
                "name": "Kick",
                "icon": "🟢",
                "title": title,
                "game": game,
                "url": f"https://kick.com/{KICK_USERNAME}",
                "preview": thumb or "https://kick.com/favicon.ico",
            }
    except Exception as e:
        print(f"Aviso ao checar Kick: {e}")
        return None


def check_youtube_live():
    """Consulta se Francis Eureka está ao vivo no YouTube."""
    try:
        url = f"https://www.youtube.com/channel/{YOUTUBE_CHANNEL_ID}/live"
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"})
        with urllib.request.urlopen(req, timeout=10) as res:
            html = res.read().decode("utf-8", errors="ignore")

        m = re.search(r'ytInitialPlayerResponse\s*=\s*({.+?});', html)
        if not m:
            m = re.search(r'var ytInitialPlayerResponse = ({.+?});', html)

        if m:
            data = json.loads(m.group(1))
            vr = data.get("videoDetails", {})
            playability = data.get("playabilityStatus", {}).get("status")
            micro = data.get("microformat", {}).get("playerMicroformatRenderer", {})
            broadcast = micro.get("liveBroadcastDetails", {})
            is_live_now = broadcast.get("isLiveNow") is True or (vr.get("isLive") is True and playability == "OK")

            if is_live_now:
                vid = vr.get("videoId")
                watch_url = f"https://www.youtube.com/watch?v={vid}" if vid else f"https://www.youtube.com/channel/{YOUTUBE_CHANNEL_ID}/live"
                thumb = f"https://i.ytimg.com/vi/{vid}/maxresdefault.jpg" if vid else None
                return {
                    "platform": "YouTube",
                    "name": "YouTube",
                    "icon": "🔴",
                    "title": vr.get("title") or "🔴 Live On no YouTube!",
                    "game": "Live Stream",
                    "url": watch_url,
                    "preview": thumb,
                }
        return None
    except Exception as e:
        print(f"Aviso ao checar YouTube Live: {e}")
        return None


def check_all_lives():
    """Checa simultaneamente Twitch, Kick e YouTube Live."""
    active_lives = []

    tw = check_twitch_live()
    if tw:
        active_lives.append(tw)

    kick = check_kick_live()
    if kick:
        active_lives.append(kick)

    yt = check_youtube_live()
    if yt:
        active_lives.append(yt)

    return active_lives


def post_live_streams(active_lives):
    history = load_history(LIVE_HISTORY_FILE)

    if not active_lives:
        # Se estava ao vivo antes e agora caiu tudo, reseta a sessão
        if history.get("is_live_active") is True:
            history["is_live_active"] = False
            history["ended_at"] = datetime.now(timezone.utc).isoformat()
            save_history(LIVE_HISTORY_FILE, history)
            print("Live finalizada. Histórico resetado para a próxima transmissão.")
        return False

    # Se já notificou essa sessão ao vivo, não repete notificação
    if history.get("is_live_active") is True:
        print("Live já notificada nesta sessão ativa.")
        return False

    main = active_lives[0]
    raw_title = next((l["title"] for l in active_lives if l.get("title")), "Live com Francis Eureka!")
    clean_title = re.sub(r'^[🔴\s\-:]+', '', raw_title).strip() or raw_title
    preview = next((l["preview"] for l in active_lives if l.get("preview")), None)
    game = next((l["game"] for l in active_lives if l.get("game")), "Variedades")

    # 1. Enviar para WhatsApp (Padoka dos Gamers)
    if len(active_lives) == 1:
        whatsapp_caption = (
            f"🔴 Francis Eureka está ao vivo - \"{clean_title}\"\n\n"
            f"👉 {main['url']}"
        )
    else:
        links_lines = "\n".join([f"{l['icon']} {l['name']}: {l['url']}" for l in active_lives])
        whatsapp_caption = (
            f"🔴 Francis Eureka está ao vivo - \"{clean_title}\"\n\n"
            f"Assista onde preferir:\n"
            f"{links_lines}"
        )
    if NOTIFY_LIVES_ON_WHATSAPP:
        send_whatsapp_message(WHATSAPP_LIVES_GROUP, whatsapp_caption, media_url=preview)

    # 2. Enviar para Discord (#🔴・lives-e-vídeos)
    if len(active_lives) == 1:
        desc = (
            f"{main['icon']} **A live acabou de começar na {main['name']}!**\n\n"
            f"🕹️ **Jogando:** `{game}`\n"
            f"⚡ Vem interagir no chat, dar risada e jogar junto com a comunidade!"
        )
        fields = [
            {
                "name": "🔗 Assistir Agora",
                "value": f"[👉 **Clique aqui para abrir a {main['name']}**]({main['url']})",
                "inline": False,
            }
        ]
        color = 9520895 if main["platform"] == "Twitch" else (5566085 if main["platform"] == "Kick" else 16711680)
    else:
        desc = (
            f"🔴 **Transmissão Simultânea (Multistream) Ativa!**\n\n"
            f"🕹️ **Jogando:** `{game}`\n"
            f"⚡ Escolha sua plataforma favorita e venha trocar uma ideia com a comunidade!"
        )
        links_discord = "\n".join([f"{l['icon']} **{l['name']}:** [Assistir na {l['name']}]({l['url']})" for l in active_lives])
        fields = [
            {
                "name": "📺 Links de Transmissão Simultânea",
                "value": links_discord,
                "inline": False,
            }
        ]
        color = 16744192  # Laranja chamativo Multistream

    discord_payload = {
        "content": "@everyone 🔴 **FRANCIS EUREKA ESTÁ AO VIVO!** Vem colar na transmissão!",
        "username": "Eureka Lives",
        "avatar_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/twitch-profile_image-70x70.png",
        "embeds": [
            {
                "title": f"🎮 {clean_title}",
                "description": desc,
                "color": color,
                "fields": fields,
                "image": {"url": f"{preview}?t={int(datetime.now().timestamp())}"} if preview else None,
                "footer": {"text": "Comunidade Eureka • Transmissão Ao Vivo"},
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

    history["is_live_active"] = True
    history["session_title"] = clean_title
    history["started_at"] = datetime.now(timezone.utc).isoformat()
    history["platforms"] = [l["name"] for l in active_lives]
    save_history(LIVE_HISTORY_FILE, history)
    return True


# ==========================================
# 📺 2. YOUTUBE - Novos Vídeos
# ==========================================

def get_latest_youtube_videos():
    """Lê o feed RSS oficial do canal do YouTube."""
    feed_url = f"https://www.youtube.com/feeds/videos.xml?channel_id={YOUTUBE_CHANNEL_ID}"
    req = urllib.request.Request(feed_url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, timeout=12) as res:
            xml_content = res.read()
    except Exception as e:
        print(f"Aviso ao ler feed do YouTube: {e}")
        return []

    try:
        root = ET.fromstring(xml_content)
    except Exception as e:
        print(f"Aviso ao parsear XML do YouTube: {e}")
        return []
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
        DISCORD_VIDEOS_WEBHOOK,
        data=json.dumps(discord_payload).encode("utf-8"),
        headers={"Content-Type": "application/json", "User-Agent": "Mozilla/5.0"},
    )
    try:
        with urllib.request.urlopen(req, timeout=10):
            print(f"Vídeo do YouTube publicado no Discord: {title}")
    except Exception as e:
        print(f"Erro ao publicar vídeo no Discord: {e}")

    # 2. Postar no WhatsApp (Padoka dos Gamers) - Breve descritivo
    brief_desc = ""
    if desc:
        first_line = desc.strip().split("\n")[0].strip()
        brief_desc = first_line if len(first_line) <= 160 else first_line[:157] + "..."

    desc_line = f"\n{brief_desc}\n" if brief_desc else ""
    whatsapp_caption = (
        f"🎬 Novo vídeo: *{title}*\n"
        f"{desc_line}\n"
        f"👉 {url}"
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

    for attempt in range(1, 4):
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
            with urllib.request.urlopen(req, timeout=45) as res:
                return res.status in (200, 201)
        except Exception as e:
            print(f"Tentativa {attempt}/3 - Aviso ao enviar mensagem para WhatsApp: {e}")
            if attempt < 3:
                time.sleep(6)
    return False


# ==========================================
# 😂 3. MEMES (Instagram / Discord / WhatsApp)
# ==========================================

def post_meme_notification(image_url, caption="", source_url=""):
    """Envia meme para Discord (#😂・memes) e WhatsApp (Padoka dos Gamers) com breve descritivo."""
    # 1. Discord
    discord_payload = {
        "content": f"😂 **Novo meme:** {caption}" if caption else "😂",
        "username": "Eureka Memes",
        "avatar_url": "https://cdn-icons-png.flaticon.com/512/1784/1784578.png",
        "embeds": [
            {
                "description": caption,
                "color": 16766720,
                "image": {"url": image_url},
                "footer": {"text": "Memes do Eureka"},
                "timestamp": datetime.now(timezone.utc).isoformat(),
            }
        ],
    }
    if source_url:
        discord_payload["embeds"][0]["url"] = source_url

    try:
        req = urllib.request.Request(
            DISCORD_MEMES_WEBHOOK,
            data=json.dumps(discord_payload).encode("utf-8"),
            headers={"Content-Type": "application/json", "User-Agent": "Mozilla/5.0"},
        )
        with urllib.request.urlopen(req, timeout=10):
            print("Meme publicado no Discord.")
    except Exception as e:
        print(f"Erro ao publicar meme no Discord: {e}")

    # 2. WhatsApp (Padoka dos Gamers) - Breve descritivo
    wa_caption = f"😂 {caption}" if caption else "😂"
    if source_url:
        wa_caption += f"\n👉 {source_url}"

    send_whatsapp_message(WHATSAPP_LIVES_GROUP, wa_caption, media_url=image_url)


def run():
    print("--- Verificando Notificações Eureka (Multistream, YouTube & Memes) ---")

    # 1. Checagem de Lives Multistream (Twitch, Kick, YouTube)
    active_lives = check_all_lives()
    if active_lives:
        names = ", ".join([l["name"] for l in active_lives])
        print(f"LIVES AO VIVO DETECTADAS: {names}!")
        post_live_streams(active_lives)
    else:
        print("Lives: Nenhuma transmissão ao vivo no momento (Twitch, Kick, YouTube).")
        # Mantém histórico em sincronia para detectar encerramento de lives
        post_live_streams([])

    # 2. YouTube novos vídeos
    new_vids = check_youtube()
    print(f"YouTube: {new_vids} novos vídeos processados.")

    # 3. Ofertas e Jogos Grátis (agendamento inteligente por slots: 08h, 12h, 18h BRT)
    try:
        from daily_scheduler import check_and_post_deals_slots
        check_and_post_deals_slots()
    except Exception as e:
        print(f"Erro ao verificar agendamento de ofertas: {e}")


if __name__ == "__main__":
    run()
