document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImg");
  const closeBtn = document.querySelector(".modal-close");

  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });

  // === CARICA I PROGETTI E COSTRUISCI IL PORTFOLIO ===
  fetch('projects.json')
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById("portfolio");
      const timelineContainer = document.querySelector(".timeline-container") || container;

      // Pulisce il container
      container.innerHTML = '<h2>Portfolio</h2>';

      // Ordina per anno decrescente
      data.sort((a, b) => b.anno - a.anno);

      // Inserisce i progetti
      data.forEach(progetto => {
        const el = document.createElement("div");
        el.className = "project";
        el.setAttribute("data-year", progetto.anno);

        el.innerHTML = `
          <div class="clickable-image">
            <img src="${progetto.img}" alt="${progetto.titolo}" data-img>
          </div>
          <div>
            <h3>${progetto.titolo}</h3>
            <p>${progetto.descrizione}</p>
            <ul>
              <li><strong>Status:</strong> ${progetto.status || 'In corso'}</li>
              <li><strong>Periodo:</strong> ${progetto.periodo}</li>
              <li><strong>Affiliazione:</strong> ${progetto.affiliazione}</li>
              <li><strong>Ruolo:</strong> ${progetto.ruolo}</li>
            </ul>
          </div>
        `;

        container.appendChild(el);
      });

      // === Attiva il modal su tutte le immagini data-img
      document.querySelectorAll('[data-img]').forEach(img => {
        img.addEventListener("click", () => {
          modal.style.display = "flex";
          modalImg.src = img.src;
        });
      });

      // === Linea + dots timeline dinamici
      const line = document.createElement("div");
      line.classList.add("timeline-line");
      timelineContainer.appendChild(line);

      const projects = Array.from(container.getElementsByClassName("project"));
      projects.forEach(project => {
        const year = project.dataset.year;
        const dot = document.createElement("div");
        dot.classList.add("timeline-dot");
        const offsetTop = project.offsetTop + (project.offsetHeight / 2) - 8;
        dot.style.top = `${offsetTop}px`;
        dot.setAttribute("title", year);
        timelineContainer.appendChild(dot);
      });
    });
});
