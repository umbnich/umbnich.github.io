// Effetto "abissi": scurisce lo sfondo con lo scroll
window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  const darkness = Math.min(scrollY / maxScroll, 1);

  const startColor = [26, 26, 26]; // #1a1a1a
  const endColor = [5, 5, 5];      // quasi nero

  const r = Math.round(startColor[0] + (endColor[0] - startColor[0]) * darkness);
  const g = Math.round(startColor[1] + (endColor[1] - startColor[1]) * darkness);
  const b = Math.round(startColor[2] + (endColor[2] - startColor[2]) * darkness);

  document.body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
});
