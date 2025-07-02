<script>
  const alignments = [
    "Lawful Good", "Neutral Good", "Chaotic Good",
    "Lawful Neutral", "Neutral", "Chaotic Neutral",
    "Lawful Evil", "Neutral Evil", "Chaotic Evil"
  ];

  function alignmentToGridCoords(alignment) {
    const index = alignments.indexOf(alignment);
    if (index === -1) return null;
    return { mainRow: Math.floor(index / 3), mainCol: index % 3 };
  }

  function getPosition(users, username) {
    const alignment = users[username].position.current;
    const { mainRow, mainCol } = alignmentToGridCoords(alignment);
    return {
      mainRow,
      mainCol,
      subRow: 1,
      subCol: 1 // iniziale
    };
  }

  function isValidMove(current, proposed) {
    const sameMain = current.mainRow === proposed.mainRow && current.mainCol === proposed.mainCol;
    const deltaRow = Math.abs(current.subRow - proposed.subRow);
    const deltaCol = Math.abs(current.subCol - proposed.subCol);
    return sameMain && (deltaRow + deltaCol === 1); // massimo 1 mossa ortogonale
  }

  async function setupVoting(users, currentUser) {
    const votingArea = document.getElementById("voting-area");

    for (const user in users) {
      if (user === currentUser) continue;

      const currentPos = getPosition(users, user);
      const icon = users[user].icon || "❓";

      const container = document.createElement("div");
      container.className = "vote-box";

      const title = document.createElement("div");
      title.innerHTML = `<strong>${icon} ${user}</strong>`;
      container.appendChild(title);

      const moveOptions = [
        { label: "Su", dr: -1, dc: 0 },
        { label: "Giù", dr: 1, dc: 0 },
        { label: "Sinistra", dr: 0, dc: -1 },
        { label: "Destra", dr: 0, dc: 1 }
      ];

      const select = document.createElement("select");
      moveOptions.forEach(opt => {
        const sr = currentPos.subRow + opt.dr;
        const sc = currentPos.subCol + opt.dc;
        if (sr >= 0 && sr <= 2 && sc >= 0 && sc <= 2) {
          const option = document.createElement("option");
          option.value = JSON.stringify({ subRow: sr, subCol: sc });
          option.textContent = opt.label;
          select.appendChild(option);
        }
      });
      container.appendChild(select);

      const textarea = document.createElement("textarea");
      textarea.rows = 2;
      textarea.placeholder = "Motivazione...";
      container.appendChild(textarea);

      const button = document.createElement("button");
      button.textContent = "Vota";
      button.onclick = () => {
        const selected = JSON.parse(select.value);
        const vote = {
          by: currentUser,
          target: user,
          vote: {
            mainRow: currentPos.mainRow,
            mainCol: currentPos.mainCol,
            subRow: selected.subRow,
            subCol: selected.subCol
          },
          reason: textarea.value
        };

        console.log("🗳️ Voto registrato:", vote);
        alert(`Hai votato per spostare ${user} a sub(${selected.subRow}, ${selected.subCol})`);
        // Qui puoi salvarlo in localStorage o inviarlo a un backend
      };
      container.appendChild(button);

      votingArea.appendChild(container);
    }
  }

  // ⚙️ Da chiamare in alignments.html
  window.onload = async function () {
    if (!sessionStorage.getItem("loggedIn") || !sessionStorage.getItem("username")) {
      alert("Accesso negato!");
      window.location.href = "index.html";
      return;
    }

    const currentUser = sessionStorage.getItem("username");
    const res = await fetch('data.json');
    const data = await res.json();
    const users = data.users;

    await setupVoting(users, currentUser);
  };
</script>
