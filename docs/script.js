// Footer year
document.getElementById("yr").textContent = new Date().getFullYear();

// Scroll reveal
const io = new IntersectionObserver(
  (entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add("in"), io.unobserve(e.target))),
  { threshold: 0.12 }
);
document.querySelectorAll(".section, .banner, .book, .teach-card, .papers li").forEach((el) => {
  el.classList.add("reveal");
  io.observe(el);
});

// Drifting network graph background: a nod to graphs & networks
(() => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const c = document.getElementById("network");
  const ctx = c.getContext("2d");
  let w, h, nodes;
  const mouse = { x: -9999, y: -9999 };

  function init() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    w = c.width = innerWidth * dpr;
    h = c.height = innerHeight * dpr;
    ctx.scale(1, 1);
    const n = Math.round(Math.min(90, (innerWidth * innerHeight) / 16000));
    nodes = Array.from({ length: n }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25 * dpr,
      vy: (Math.random() - 0.5) * 0.25 * dpr,
      r: (Math.random() * 1.6 + 0.6) * dpr,
      hot: Math.random() < 0.12,
    }));
    c.dpr = dpr;
  }

  function tick() {
    const dpr = c.dpr;
    const link = 140 * dpr;
    ctx.clearRect(0, 0, w, h);
    for (const p of nodes) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
    }
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < link) {
          ctx.strokeStyle = `rgba(127, 209, 230, ${0.18 * (1 - d / link)})`;
          ctx.lineWidth = dpr * 0.8;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      const dm = Math.hypot(a.x - mouse.x * dpr, a.y - mouse.y * dpr);
      const near = dm < 160 * dpr;
      ctx.fillStyle = a.hot || near ? "rgba(255, 122, 69, 0.9)" : "rgba(243, 238, 228, 0.5)";
      ctx.beginPath(); ctx.arc(a.x, a.y, near ? a.r * 1.8 : a.r, 0, Math.PI * 2); ctx.fill();
    }
    requestAnimationFrame(tick);
  }

  addEventListener("resize", init);
  addEventListener("mousemove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
  init();
  tick();
})();
