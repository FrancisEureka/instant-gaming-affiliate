"""
Eureka Daily Deals Slot Scheduler
Garante que as ofertas da Instant Gaming e os jogos grátis sejam postados
rigorosamente nas 3 janelas diárias (08:00, 12:00 e 18:00 - Horário de Brasília).
À prova de falhas: se uma execução atrasar na fila do GitHub Actions, o slot
é verificado e disparado assim que o robô acordar.
"""

import json
import os
import sys
from datetime import datetime, timezone, timedelta

# Garante importação dos scripts irmãos
SCRIPTS_DIR = os.path.dirname(__file__)
if SCRIPTS_DIR not in sys.path:
    sys.path.insert(0, SCRIPTS_DIR)

try:
    import instant_gaming_deals
    import free_games_deals
except ImportError:
    from scripts import instant_gaming_deals, free_games_deals

SLOTS_HISTORY_FILE = os.path.join(SCRIPTS_DIR, "posted_slots_history.json")


def get_brt_now():
    """Retorna o horário atual no fuso de Brasília (UTC-3)."""
    return datetime.now(timezone(timedelta(hours=-3)))


def get_current_slot(brt_time):
    """
    Determina o slot correspondente com base no horário de Brasília:
    - morning: entre 08:00 e 11:59 BRT
    - noon:    entre 12:00 e 17:59 BRT
    - evening: a partir das 18:00 BRT
    """
    hour = brt_time.hour
    date_str = brt_time.strftime("%Y-%m-%d")

    if 8 <= hour < 12:
        return f"{date_str}_morning"
    elif 12 <= hour < 18:
        return f"{date_str}_noon"
    elif hour >= 18:
        return f"{date_str}_evening"
    return None


def load_slots_history():
    if os.path.exists(SLOTS_HISTORY_FILE):
        try:
            with open(SLOTS_HISTORY_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return {}
    return {}


def save_slots_history(history):
    try:
        with open(SLOTS_HISTORY_FILE, "w", encoding="utf-8") as f:
            json.dump(history, f, indent=2, ensure_ascii=False)
    except Exception as e:
        print(f"Erro ao salvar histórico de slots: {e}")


def check_and_post_deals_slots():
    """
    Verifica se o slot atual de ofertas já foi publicado hoje.
    Se ainda não foi, dispara as ofertas e salva o registro.
    """
    brt = get_brt_now()
    slot = get_current_slot(brt)

    if not slot:
        print(f"[Scheduler] Fora do intervalo de postagem de ofertas (horário BRT: {brt.strftime('%H:%M')}).")
        return False

    history = load_slots_history()
    if slot in history:
        print(f"[Scheduler] Slot de ofertas '{slot}' já foi postado hoje às {history[slot]}.")
        return False

    print(f"\n🚀 [Scheduler] Disparando ofertas programadas do slot: {slot} (Horário BRT: {brt.strftime('%H:%M')})")
    
    # 1. Ofertas Instant Gaming
    try:
        print("\n--- Publicando Ofertas Instant Gaming ---")
        instant_gaming_deals.run(max_deals=2)
    except Exception as e:
        print(f"Erro ao rodar instant_gaming_deals: {e}")

    # 2. Jogos Grátis
    try:
        print("\n--- Publicando Jogos Grátis ---")
        free_games_deals.run(max_games=2)
    except Exception as e:
        print(f"Erro ao rodar free_games_deals: {e}")

    # Salva slot como concluído
    history[slot] = brt.isoformat()
    save_slots_history(history)
    print(f"✅ [Scheduler] Slot '{slot}' finalizado e registrado com sucesso!\n")
    return True


if __name__ == "__main__":
    check_and_post_deals_slots()
