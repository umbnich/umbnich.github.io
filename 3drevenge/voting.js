const alignments = [
  "Lawful Good", "Neutral Good", "Chaotic Good",
  "Lawful Neutral", "Neutral", "Chaotic Neutral",
  "Lawful Evil", "Neutral Evil", "Chaotic Evil"
];

// Se hai link precompilato, serve l'URL BASE e gli ID dei campi
const FORM_URL_BASE = "https://docs.google.com/forms/d/e/TUO_FORM_ID/viewform";
const FIELD_IDS = {
  by: "entry.1234567890",       // votante
  target: "entry.2345678901",   // votato
  vote: "entry.3456789012",     // nuovo allineamento
  reason: "entry.4567890123"    // motivazione
};

function buildFormURL({ by, target, vote, reason }) {
  const params = new URLSearchParams();
  params.append(FIELD_IDS.by, by);
  params.append(FIELD_IDS.target, target);
  params.append(FIELD_IDS.vote, vote);
  params.append(FIELD_IDS.reason, reason);
  return `${FORM_URL_BASE}?${params.toString()}`;
}

function alignmentToCoords(alignment) {
  const index = alignments.indexOf(alignment);
  if (index === -1) return null;
  return {
    mainRow: Math.floor(index / 3),
    mainCol: index % 3,
    subRow: 1,
    subCol: 1
  };
}

window.onload = async function () {
  if (!sessionStorage.getItem("loggedIn") || !sessionStorage.getItem("username")) {
    alert("Accesso negato! Torna al login.");
    window.location.href = "index.html";
    return;
  }

  const currentUser = sessionStorage.getItem("username");
  const res = await fetch('data.json');
  const data = await res.json();
  const users = data.users;

  // Posizionamento icone
  for (const user in users) {
    const alignment = users[user].position.current;
    const iconChar = users[user].icon;
    const coords = alignmentToCoords(alignment);
    if (coords) {
      const cellId = `cell-${coords.mainRow}-${coords.mainCol}-1-1`;
      const target = document.getElementById(cellId);
      if (target) {
        const icon = document.createElement("div");
        icon.className = "icon";
        icon.textContent = iconChar;
        target.appendChild(icon);
      }
    }
  }

  // Cronologia
  const historyContainer = document.getElementById("history");
  for (const user in users) {
    const { icon, position } = users[user];
    const entry = document.createElement("div");
    entry.className = "history-entry";
    entry.innerText = `${icon} ${user}: ${position.previous} → ${position.current}`;
    historyContainer.appendChild(entry);
  }

  // Votazione
  const votingArea = document.getElementById("voting-area");
  for (const user in users) {
    if (user === currentUser) continue;

    const icon = users[user].icon || "❓";
    const container = document.createElement("div");
    container.className = "vote-box";

    const title = document.createElement("div");
    title.innerHTML = `<strong>${icon} ${user}</strong>`;
    container.appendChild(title);

    const select = document.createElement("select");
    alignments.forEach(alignment => {
      const option = document.createElement("option");
      option.value = alignment;
      option.textContent = alignment;
      select.appendChild(option);
    });
    container.appendChild(select);

    const textarea = document.createElement("textarea");
    textarea.rows = 2;
    textarea.placeholder = "Motivazione...";
    container.appendChild(textarea);

    const button = document.createElement("button");
    button.textContent = "Vota";

    button.onclick = function () {
      const voto = select.value;
      const motivo = textarea.value;

      if (!voto) return alert("Scegli un allineamento.");
      if (!motivo.trim()) return alert("Scrivi una motivazione.");

      const url = buildFormURL({
        by: currentUser,
        target: user,
        vote: voto,
        reason: motivo
      });

      window.open(url, "_blank");
    };

    container.appendChild(button);
    votingArea.appendChild(container);
  }
};
