import json
from collections import Counter, defaultdict

DATA_FILE = "data.json"

def load_data():
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def save_data(data):
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def position_key(pos):
    """Genera una chiave hashabile per una posizione."""
    return (pos["mainRow"], pos["mainCol"], pos["subRow"], pos["subCol"])

def is_valid_step(current, target):
    """Verifica se il movimento è di una sola sub-cella all'interno della stessa cella grande."""
    same_main = (current["mainRow"] == target["mainRow"] and
                 current["mainCol"] == target["mainCol"])
    if not same_main:
        return False
    delta_row = abs(current["subRow"] - target["subRow"])
    delta_col = abs(current["subCol"] - target["subCol"])
    return (delta_row + delta_col) == 1

def apply_votes(data):
    users = data["users"]

    for username, info in users.items():
        current_pos = info["position"]
        votes = info.get("votes", [])

        if not votes:
            continue  # Nessun voto ricevuto

        vote_counts = Counter()
        vote_map = defaultdict(list)

        for vote in votes:
            target_pos = vote["vote"]
            key = position_key(target_pos)
            vote_counts[key] += 1
            vote_map[key].append(vote["reason"])

        # Trova la posizione più votata
        most_common_key, _ = vote_counts.most_common(1)[0]
        proposed_pos = {
            "mainRow": most_common_key[0],
            "mainCol": most_common_key[1],
            "subRow": most_common_key[2],
            "subCol": most_common_key[3]
        }

        # Verifica che lo spostamento sia valido
        if is_valid_step(current_pos, proposed_pos):
            print(f"✅ {username} si sposta: {current_pos} → {proposed_pos}")
            info["position"]["previous"] = current_pos
            info["position"]["current"] = proposed_pos
        else:
            print(f"❌ Movimento invalido per {username}: ignorato.")

        # Svuota i voti
        info["votes"] = []

def main():
    data = load_data()
    apply_votes(data)
    save_data(data)
    print("✔️ File aggiornato: data.json")

if __name__ == "__main__":
    main()
