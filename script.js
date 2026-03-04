/* ───────────────────────────────────────────
   CUSTOM CURSOR
─────────────────────────────────────────── */
const cursor      = document.getElementById("cursor");
const cursorTrail = document.getElementById("cursor-trail");

let mouseX = 0, mouseY = 0;

document.addEventListener("mousemove", e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + "px";
  cursor.style.top  = mouseY + "px";
  cursorTrail.style.left = mouseX + "px";
  cursorTrail.style.top  = mouseY + "px";
});

document.querySelectorAll("a, button, .proj-card, .repo-card").forEach(el => {
  el.addEventListener("mouseenter", () => {
    cursor.style.transform = "translate(-50%,-50%) scale(1.8)";
    cursor.style.opacity   = "0.6";
  });
  el.addEventListener("mouseleave", () => {
    cursor.style.transform = "translate(-50%,-50%) scale(1)";
    cursor.style.opacity   = "1";
  });
});

/* ───────────────────────────────────────────
   NAV SCROLL STATE
─────────────────────────────────────────── */
const nav = document.getElementById("nav");
window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 30);
});

/* ───────────────────────────────────────────
   HAMBURGER
─────────────────────────────────────────── */
const hamburger  = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  mobileMenu.classList.toggle("open");
});

document.querySelectorAll(".mob-link").forEach(l => {
  l.addEventListener("click", () => {
    hamburger.classList.remove("open");
    mobileMenu.classList.remove("open");
  });
});

/* ───────────────────────────────────────────
   TYPEWRITER
─────────────────────────────────────────── */
const phrases = [
  "AI Engineer // Computer Vision",
  "Edge AI // On-device Inference",
  "Deep Learning // YOLOv8 + OpenCV",
  "Seeking Internship // Open to Opportunities",
];

let pIdx = 0, cIdx = 0, deleting = false;
const tw = document.getElementById("typewriter");

function typeLoop() {
  const current = phrases[pIdx];
  if (!deleting) {
    tw.textContent = current.slice(0, ++cIdx);
    if (cIdx === current.length) {
      deleting = true;
      setTimeout(typeLoop, 2200);
      return;
    }
    setTimeout(typeLoop, 48);
  } else {
    tw.textContent = current.slice(0, --cIdx);
    if (cIdx === 0) {
      deleting = false;
      pIdx = (pIdx + 1) % phrases.length;
      setTimeout(typeLoop, 320);
      return;
    }
    setTimeout(typeLoop, 26);
  }
}
typeLoop();

/* ───────────────────────────────────────────
   HERO CANVAS — particle network
─────────────────────────────────────────── */
(function () {
  const canvas = document.getElementById("heroCanvas");
  const ctx    = canvas.getContext("2d");

  function resize() {
    canvas.width  = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
  }
  resize();

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 200);
  });

  const N     = 60;
  const REACH = 140;
  const SPD   = 0.35;

  const pts = Array.from({ length: N }, () => ({
    x:  Math.random() * canvas.width,
    y:  Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * SPD,
    vy: (Math.random() - 0.5) * SPD,
  }));

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < N; i++) {
      const p = pts[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0,212,170,0.55)";
      ctx.fill();

      for (let j = i + 1; j < N; j++) {
        const q = pts[j];
        const d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < REACH) {
          const a = (1 - d / REACH) * 0.22;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(0,212,170,${a})`;
          ctx.lineWidth   = 0.7;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(tick);
  }
  tick();
})();

/* ───────────────────────────────────────────
   SCROLL REVEAL + PROF BARS
─────────────────────────────────────────── */
const reveals = document.querySelectorAll(".reveal");

const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add("visible");

    // Animate proficiency bars when their section reveals
    e.target.querySelectorAll(".prof-fill").forEach(bar => {
      const w = bar.dataset.w;
      setTimeout(() => { bar.style.width = w + "%"; }, 200);
    });

    revealObs.unobserve(e.target);
  });
}, { threshold: 0.08 });

reveals.forEach(el => revealObs.observe(el));

// Also handle bars that are in already-visible elements
document.querySelectorAll(".prof-fill").forEach(bar => {
  const rect = bar.getBoundingClientRect();
  if (rect.top < window.innerHeight) {
    setTimeout(() => { bar.style.width = bar.dataset.w + "%"; }, 400);
  }
});

/* ───────────────────────────────────────────
   PROJECT MODAL
─────────────────────────────────────────── */
const modal      = document.getElementById("projectModal");
const modalTitle = document.getElementById("modalTitle");
const modalDesc  = document.getElementById("modalDesc");
const modalTech  = document.getElementById("modalTech");

function openModal(card) {
  modalTitle.textContent = card.dataset.title || "";
  modalDesc.textContent  = card.dataset.desc  || "";
  modalTech.textContent  = card.dataset.tech  || "";
  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeModalFn() {
  modal.classList.remove("open");
  document.body.style.overflow = "";
}

document.querySelectorAll(".proj-card").forEach(c => {
  c.addEventListener("click", () => openModal(c));
});

document.getElementById("closeModal").addEventListener("click", closeModalFn);
modal.querySelector(".modal-bg").addEventListener("click", closeModalFn);
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModalFn(); });

/* ───────────────────────────────────────────
   GITHUB REPOS
─────────────────────────────────────────── */
const LANG_COLORS = {
  Python:     "#3572A5",
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  C:          "#555555",
  "C++":      "#f34b7d",
  HTML:       "#e34c26",
  CSS:        "#563d7c",
  Jupyter:    "#da5b0b",
  Shell:      "#89e051",
  Rust:       "#dea584",
};

function esc(s) {
  const d = document.createElement("div");
  d.textContent = s;
  return d.innerHTML;
}

async function loadRepos() {
  const container = document.getElementById("repoContainer");
  try {
    const res  = await fetch("https://api.github.com/users/Hari-1410/repos?sort=updated&per_page=20");
    if (!res.ok) throw new Error();
    const data = await res.json();

    const repos = data.filter(r => !r.fork).slice(0, 6);

    container.innerHTML = "";

    if (!repos.length) {
      container.innerHTML = `<p style="color:var(--muted);font-size:.82rem;grid-column:1/-1">No public repos found.</p>`;
      return;
    }

    repos.forEach(repo => {
      const langColor = LANG_COLORS[repo.language] || "var(--accent)";
      const card = document.createElement("a");
      card.className = "repo-card reveal";
      card.href      = repo.html_url;
      card.target    = "_blank";
      card.rel       = "noopener noreferrer";
      card.innerHTML = `
        <div class="repo-name-row">
          <svg class="repo-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M3 3h18v18H3z" rx="2"/><path d="M3 9h18M9 21V9"/>
          </svg>
          <span class="repo-name-text">${esc(repo.name)}</span>
          ${repo.fork ? '<span class="repo-fork">fork</span>' : ''}
        </div>
        <div class="repo-desc">${esc(repo.description || "No description available.")}</div>
        <div class="repo-meta">
          ${repo.language ? `
            <span class="repo-lang">
              <span class="lang-dot" style="background:${langColor}"></span>
              ${esc(repo.language)}
            </span>` : ""}
          <span class="repo-stars">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/>
            </svg>
            ${repo.stargazers_count}
          </span>
        </div>
      `;
      container.appendChild(card);

      // Observe newly added cards for reveal
      revealObs.observe(card);
    });

  } catch {
    document.getElementById("repoContainer").innerHTML = `
      <p style="color:var(--muted);font-size:.82rem;grid-column:1/-1">
        Could not load repos —
        <a href="https://github.com/Hari-1410" target="_blank" style="color:var(--accent)">view on GitHub →</a>
      </p>`;
  }
}

loadRepos();

/* ───────────────────────────────────────────
   BACK TO TOP
─────────────────────────────────────────── */
const btt = document.getElementById("backToTop");
window.addEventListener("scroll", () => {
  btt.classList.toggle("show", window.scrollY > 500);
});
btt.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

/* ───────────────────────────────────────────
   ACTIVE NAV HIGHLIGHT
─────────────────────────────────────────── */
const sections = document.querySelectorAll("section[id]");
const navAs    = document.querySelectorAll(".nav-links a[href^='#']");

const secObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navAs.forEach(a => {
        const isActive = a.getAttribute("href") === "#" + e.target.id;
        a.style.color = isActive ? "var(--accent)" : "";
      });
    }
  });
}, { rootMargin: "-35% 0px -60% 0px" });

sections.forEach(s => secObs.observe(s));
