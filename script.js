// PARTICLE CANVAS
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let W,
  H,
  particles = [],
  mouse = { x: -999, y: -999 };
const N = 90;

function resize() {
  W = canvas.width = canvas.offsetWidth;
  H = canvas.height = canvas.offsetHeight;
}
resize();
window.addEventListener("resize", () => {
  resize();
});

document.getElementById("hero").addEventListener("mousemove", (e) => {
  const r = canvas.getBoundingClientRect();
  mouse.x = e.clientX - r.left;
  mouse.y = e.clientY - r.top;
});
document.getElementById("hero").addEventListener("mouseleave", () => {
  mouse.x = -999;
  mouse.y = -999;
});

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.r = Math.random() * 1.5 + 0.5;
    this.alpha = Math.random() * 0.5 + 0.2;
  }
  update() {
    const dx = this.x - mouse.x,
      dy = this.y - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 120) {
      this.vx += (dx / dist) * 0.3;
      this.vy += (dy / dist) * 0.3;
    }
    this.vx *= 0.97;
    this.vy *= 0.97;
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0) this.x = W;
    if (this.x > W) this.x = 0;
    if (this.y < 0) this.y = H;
    if (this.y > H) this.y = 0;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(79,142,247,${this.alpha})`;
    ctx.fill();
  }
}

for (let i = 0; i < N; i++) particles.push(new Particle());

function drawLines() {
  for (let i = 0; i < N; i++) {
    for (let j = i + 1; j < N; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 130) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(79,142,247,${0.15 * (1 - d / 130)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach((p) => {
    p.update();
    p.draw();
  });
  drawLines();
  requestAnimationFrame(animate);
}
animate();

// SCROLL REVEAL
const reveals = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add("visible"), i * 80);
        observer.unobserve(e.target);
      }
    });
  },
  { threshold: 0.1 },
);
reveals.forEach((el) => observer.observe(el));

// CTA
function handleCTA() {
  const v = document.getElementById("email-input").value.trim();
  if (!v || !v.includes("@")) {
    document.getElementById("email-input").style.borderColor =
      "rgba(239,68,68,0.5)";
    setTimeout(
      () => (document.getElementById("email-input").style.borderColor = ""),
      1500,
    );
    return;
  }

  fetch(
    "https://script.google.com/macros/s/AKfycbxfI769F4MKw63_1aGuuux83NziYLFbiyPGBP-89F1ujPVZH3TR0RXDovse1yD0XGPfXg/exec",
    {
      method: "POST",
      body: JSON.stringify({ email: v }),
    },
  );

  document.getElementById("email-input").value = "";
  const btn = document.querySelector(".cta-form .btn-primary");
  btn.textContent = "✓ We'll be in touch!";
  btn.style.background = "linear-gradient(135deg,#22c55e,#16a34a)";
  setTimeout(() => {
    btn.textContent = "Let's talk →";
    btn.style.background = "";
  }, 3500);
}
