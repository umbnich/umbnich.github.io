import json
import csv
from collections import Counter, defaultdict

DATA_FILE = "data.json"
VOTES_FILE = "votes.csv"

# Mappa da nome allineamento a coordinate (centrate nella subgriglia)
ALIGNMENT_COORDS = {
    "Lawful Good": {"mainRow": 0, "mainCol": 0, "subRow": 1, "subCol": 1},
    "Neutral Good": {"mainRow": 0, "mainCol": 1, "subRow": 1, "subCol": 1},
    "Chaotic Good": {"mainRow": 0, "mainCol": 2, "subRow": 1, "subCol": 1},
    "Lawful Neutral": {"mainRow": 1, "mainCol": 0, "subRow": 1, "subCol": 1},
    "Neutral": {"mainRow": 1, "mainCol": 1, "subRow": 1, "subCol": 1},
    "Chaotic Neutral": {"mainRow": 1, "mainCol": 2, "subRow": 1, "subCol": 1},
    "Lawful Evil": {"mainRow": 2, "mainCol": 0, "subRow": 1, "subCol": 1},
    "Neutral Evil": {"mainRow": 2, "mainCol": 1, "subRow": 1, "subCol": 1},
    "Chaotic Evil": {"mainRow": 2, "mainCol": 2, "subRow": 1, "subCol": 1}
}

def load_data():
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def save_data(data):
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def position_key(pos):
    return (pos["mainRow"], pos["mainCol"], pos["subRow"], pos["subCol"])

def is_valid_step(current, target):
    same_main = (current["mainRow"] == target["mainRow"] and
                 current["mainCol"] == target["mainCol"])
    if not same_main:
        return False
    delta_row = abs(current["subRow"] - target["subRow"])
    delta_col = abs(current["subCol"] - target["subCol"])
    return (delta_row + delta_col) == 1

def parse_votes_from_csv(path):
    votes_by_target = defaultdict(list)
    with open(path, newline='', encoding="utf-8") as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            by = row.get("by", "").strip()
            target = row.get("target", "").strip()
            vote_label = row.get("vote", "").strip()
            reason = row.get("reason", "").strip()

            coords = ALIGNMENT_COORDS.get(vote_label)
            if not by or not target or not coords:
                print(f"⚠️ Voto ignorato: dati incompleti o allineamento non valido → {row}")
                continue

            vote_obj = {
                "by": by,
                "vote": coords,
                "reason": reason
            }
            votes_by_target[target].append(vote_obj)

    return votes_by_target

def apply_votes(data, votes_by_target):
    users = data["users"]

    for target, votes in votes_by_target.items():
        if target not in users:
            print(f"⚠️ Utente target '{target}' non trovato, voto ignorato.")
            continue

        current_pos = users[target]["position"]
        vote_counts = Counter()
        vote_map = defaultdict(list)

        # Mantiene un solo voto per ogni votante
        latest_votes = {}
        for vote in votes:
            latest_votes[vote["by"]] = vote

        for vote in latest_votes.values():
            key = position_key(vote["vote"])
            vote_counts[key] += 1
            vote_map[key].append(vote["reason"])

        most_common = vote_counts.most_common(1)
        if not most_common:
            continue

        most_common_key, _ = most_common[0]
        proposed_pos = {
            "mainRow": most_common_key[0],
            "mainCol": most_common_key[1],
            "subRow": most_common_key[2],
            "subCol": most_common_key[3]
        }

        if is_valid_step(current_pos, proposed_pos):
            print(f"✅ {target} si sposta: {current_pos} → {proposed_pos}")
            users[target]["position"]["previous"] = current_pos
            users[target]["position"]["current"] = proposed_pos
        else:
            print(f"❌ Movimento invalido per {target}: ignorato.")

        # Svuota la lista dei voti salvati
        users[target]["votes"] = []

def main():
    data = load_data()
    votes_by_target = parse_votes_from_csv(VOTES_FILE)
    apply_votes(data, votes_by_target)
    save_data(data)
    print("✔️ File aggiornato: data.json")

if __name__ == "__main__":
    main()
