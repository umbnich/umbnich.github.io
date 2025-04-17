document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImg");
    const closeBtn = document.querySelector(".modal-close");
  
    // === ZOOM IMMAGINE ===
    document.querySelectorAll("[data-img], .clickable-image img").forEach(img => {
      img.addEventListener("click", () => {
        modal.style.display = "flex";
        modalImg.src = img.src;
      });
    });
  
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });
  
    window.addEventListener("click", (e) => {
      if (e.target === modal) modal.style.display = "none";
    });
  
    // === ORDINAMENTO PER ANNO ===
    const container = document.getElementById("portfolio");
    const projects = Array.from(container.getElementsByClassName("project"));
  
    projects.sort((a, b) => parseInt(b.dataset.year) - parseInt(a.dataset.year));
    projects.forEach(p => container.appendChild(p));
  
    // === TIMELINE DOTS DINAMICI ===
    const timelineContainer = document.querySelector(".timeline-container");
    const line = document.createElement("div");
    line.classList.add("timeline-line");
    timelineContainer.appendChild(line);
  
    projects.forEach(project => {
      const year = project.dataset.year;
      const dot = document.createElement("div");
      dot.classList.add("timeline-dot");
      
      const rect = project.getBoundingClientRect();
      const offsetTop = project.offsetTop + (project.offsetHeight / 2) - 8;
  
      dot.style.top = `${offsetTop}px`;
      dot.setAttribute("title", year);
      timelineContainer.appendChild(dot);
    });
  });
  