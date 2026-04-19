/* =========================================================
   EDGE ANIMATION — Vanilla JS
   - Builds an SVG flight scene
   - Animates a plane along a quadratic Bezier arc
   - Supports replay, adjustable speed, and webm recording
   ========================================================= */

(() => {
  "use strict";

  // ---------- DOM refs ----------
  const stage        = document.getElementById("stage");
  const fromInput    = document.getElementById("from");
  const toInput      = document.getElementById("to");
  const speedInput   = document.getElementById("speed");
  const speedValue   = document.getElementById("speedValue");
  const generateBtn  = document.getElementById("generateBtn");
  const replayBtn    = document.getElementById("replayBtn");
  const recordBtn    = document.getElementById("recordBtn");
  const progressBar  = document.getElementById("progressBar");
  const statusText   = document.getElementById("status");
  const yearEl       = document.getElementById("year");

  yearEl.textContent = new Date().getFullYear();

  // ---------- State ----------
  let dims = { w: 800, h: 460 };
  let rafId = null;
  let currentFrom = "";
  let currentTo   = "";
  let svgEl = null;
  let planeGroup = null;
  let trailPath  = null;
  let fromLabel  = null;
  let toLabel    = null;
  let geometry   = null; // { p0, p1, p2, arcPath }

  // ---------- Speed slider ----------
  speedInput.addEventListener("input", () => {
    speedValue.textContent = parseFloat(speedInput.value).toFixed(1).replace(/\.0$/, "");
  });

  // ---------- Bezier helpers ----------
  function pointOnArc(t, p0, p1, p2) {
    const x =
      (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x;
    const y =
      (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y;
    const dx = 2 * (1 - t) * (p1.x - p0.x) + 2 * t * (p2.x - p1.x);
    const dy = 2 * (1 - t) * (p1.y - p0.y) + 2 * t * (p2.y - p1.y);
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    return { x, y, angle };
  }

  // ---------- Build SVG scene ----------
  function buildScene() {
    const rect = stage.getBoundingClientRect();
    const w = Math.max(320, rect.width || 800);
    const h = Math.max(360, Math.min(560, w * 0.55));
    dims = { w, h };

    const padX = Math.max(80, w * 0.12);
    const p0 = { x: padX,         y: h * 0.7  };
    const p2 = { x: w - padX,     y: h * 0.45 };
    const p1 = { x: (p0.x + p2.x) / 2, y: Math.min(p0.y, p2.y) - h * 0.4 };
    const arcPath = `M ${p0.x} ${p0.y} Q ${p1.x} ${p1.y} ${p2.x} ${p2.y}`;
    geometry = { p0, p1, p2, arcPath };

    const svgNS = "http://www.w3.org/2000/svg";
    stage.innerHTML = "";

    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", String(h));
    svg.style.display = "block";
    svg.style.borderRadius = "18px";
    svg.style.background =
      "linear-gradient(160deg, #d8f3e1 0%, #f3fbff 50%, #cfe6f7 100%)";

    // defs
    const defs = document.createElementNS(svgNS, "defs");
    defs.innerHTML = `
      <radialGradient id="sun" cx="80%" cy="15%" r="35%">
        <stop offset="0%" stop-color="rgba(255, 226, 140, 0.9)"/>
        <stop offset="100%" stop-color="rgba(255, 226, 140, 0)"/>
      </radialGradient>
      <linearGradient id="ground" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%"  stop-color="rgba(120, 190, 140, 0)"/>
        <stop offset="100%" stop-color="rgba(80, 160, 110, 0.45)"/>
      </linearGradient>
      <filter id="planeShadow" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="rgba(20,50,80,0.4)"/>
      </filter>
    `;
    svg.appendChild(defs);

    // Sun glow
    const sun = document.createElementNS(svgNS, "rect");
    sun.setAttribute("width", String(w));
    sun.setAttribute("height", String(h));
    sun.setAttribute("fill", "url(#sun)");
    svg.appendChild(sun);

    // Clouds
    const clouds = document.createElementNS(svgNS, "g");
    clouds.setAttribute("opacity", "0.75");
    clouds.setAttribute("class", "animate-float-slow");
    clouds.innerHTML = `
      <ellipse cx="${w*0.20}" cy="${h*0.18}" rx="55" ry="14" fill="white"/>
      <ellipse cx="${w*0.25}" cy="${h*0.22}" rx="40" ry="10" fill="white"/>
      <ellipse cx="${w*0.70}" cy="${h*0.12}" rx="45" ry="12" fill="white" opacity="0.9"/>
      <ellipse cx="${w*0.78}" cy="${h*0.16}" rx="30" ry="8"  fill="white" opacity="0.8"/>
    `;
    svg.appendChild(clouds);

    // Ground silhouette
    const ground = document.createElementNS(svgNS, "path");
    ground.setAttribute(
      "d",
      `M 0 ${h} L 0 ${h*0.78} Q ${w*0.3} ${h*0.7} ${w*0.55} ${h*0.8} T ${w} ${h*0.76} L ${w} ${h} Z`
    );
    ground.setAttribute("fill", "url(#ground)");
    svg.appendChild(ground);

    // Static base path (faint)
    const basePath = document.createElementNS(svgNS, "path");
    basePath.setAttribute("d", arcPath);
    basePath.setAttribute("fill", "none");
    basePath.setAttribute("stroke", "rgba(60, 90, 130, 0.25)");
    basePath.setAttribute("stroke-width", "2");
    svg.appendChild(basePath);

    // Animated dashed flight path
    const dashed = document.createElementNS(svgNS, "path");
    dashed.setAttribute("d", arcPath);
    dashed.setAttribute("fill", "none");
    dashed.setAttribute("stroke", "rgba(40, 80, 140, 0.85)");
    dashed.setAttribute("stroke-width", "2.5");
    dashed.setAttribute("stroke-linecap", "round");
    dashed.setAttribute("class", "flight-path");
    svg.appendChild(dashed);

    // Trail (revealed under the plane)
    const trail = document.createElementNS(svgNS, "path");
    trail.setAttribute("d", arcPath);
    trail.setAttribute("fill", "none");
    trail.setAttribute("stroke", "#2aa6b8");
    trail.setAttribute("stroke-width", "3.5");
    trail.setAttribute("stroke-linecap", "round");
    svg.appendChild(trail);
    trailPath = trail;

    // Origin marker
    const originG = document.createElementNS(svgNS, "g");
    originG.setAttribute("transform", `translate(${p0.x} ${p0.y})`);
    originG.innerHTML = `
      <circle r="14" fill="rgba(42,166,184,0.2)"/>
      <circle r="7"  fill="#2aa6b8"/>
      <circle r="3"  fill="white"/>
      <text x="0" y="34" text-anchor="middle"
            font-family="Cinzel Decorative, serif" font-weight="700"
            font-size="16" fill="#1a3a52">${escapeXml(currentFrom || "FROM")}</text>
    `;
    svg.appendChild(originG);
    fromLabel = originG.querySelector("text");

    // Destination marker
    const destG = document.createElementNS(svgNS, "g");
    destG.setAttribute("transform", `translate(${p2.x} ${p2.y})`);
    destG.innerHTML = `
      <circle r="14" fill="rgba(220,90,80,0.25)"/>
      <circle r="7"  fill="#dc5a50"/>
      <circle r="3"  fill="white"/>
      <text x="0" y="-22" text-anchor="middle"
            font-family="Cinzel Decorative, serif" font-weight="700"
            font-size="16" fill="#1a3a52">${escapeXml(currentTo || "TO")}</text>
    `;
    svg.appendChild(destG);
    toLabel = destG.querySelector("text");

    // Plane
    const plane = document.createElementNS(svgNS, "g");
    plane.setAttribute("filter", "url(#planeShadow)");
    plane.innerHTML = `
      <g transform="translate(-14 -14) scale(1.1)">
        <path d="M2 14 L26 14 L22 10 L18 14 L14 6 L10 14 L6 10 L2 14 Z" fill="#1a3a52"/>
        <path d="M2 14 L26 14 L22 18 L18 14 L14 22 L10 14 L6 18 L2 14 Z" fill="#3a6585"/>
        <circle cx="20" cy="14" r="2" fill="#ffd766"/>
      </g>
    `;
    svg.appendChild(plane);
    planeGroup = plane;

    // Place plane at origin initially
    planeGroup.setAttribute("transform", `translate(${p0.x} ${p0.y}) rotate(0)`);

    stage.appendChild(svg);
    svgEl = svg;
  }

  function escapeXml(s) {
    return String(s).replace(/[<>&"']/g, c => ({
      "<":"&lt;", ">":"&gt;", "&":"&amp;", '"':"&quot;", "'":"&apos;"
    }[c]));
  }

  // ---------- Animation loop ----------
  function animateFlight({ onProgress, onDone } = {}) {
    if (!geometry) return;
    if (rafId) cancelAnimationFrame(rafId);

    const speed = parseFloat(speedInput.value) || 6;
    const duration = speed * 1000;
    const start = performance.now();
    const { p0, p1, p2 } = geometry;

    // prep trail length
    const trailLen = trailPath.getTotalLength();
    trailPath.style.strokeDasharray = String(trailLen);
    trailPath.style.strokeDashoffset = String(trailLen);

    function tick(now) {
      const elapsed = now - start;
      const raw = Math.min(1, elapsed / duration);
      // ease-in-out cubic
      const t = raw < 0.5 ? 4 * raw * raw * raw : 1 - Math.pow(-2 * raw + 2, 3) / 2;

      const { x, y, angle } = pointOnArc(t, p0, p1, p2);
      planeGroup.setAttribute("transform", `translate(${x} ${y}) rotate(${angle})`);
      trailPath.style.strokeDashoffset = String(trailLen * (1 - t));

      progressBar.style.width = `${(raw * 100).toFixed(1)}%`;
      onProgress && onProgress(raw);

      if (raw < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        onDone && onDone();
      }
    }
    rafId = requestAnimationFrame(tick);
  }

  // ---------- Generate flow ----------
  function setLoading(isLoading) {
    generateBtn.classList.toggle("is-loading", isLoading);
    generateBtn.disabled = isLoading;
  }

  function generate() {
    const from = fromInput.value.trim();
    const to   = toInput.value.trim();

    if (!from || !to) {
      statusText.textContent = "Please enter both a starting point and a destination.";
      return;
    }

    currentFrom = from.toUpperCase();
    currentTo   = to.toUpperCase();

    setLoading(true);
    statusText.textContent = "Preparing your cinematic flight…";

    // Small delay for nice UX feedback
    setTimeout(() => {
      buildScene();
      setLoading(false);
      replayBtn.disabled = false;
      recordBtn.disabled = !isRecordingSupported();
      statusText.textContent = `Flying ${currentFrom} → ${currentTo}…`;

      animateFlight({
        onDone: () => {
          statusText.textContent = `Arrived in ${currentTo}. ✈️ Replay or record to download.`;
        }
      });
    }, 250);
  }

  function replay() {
    if (!geometry) return;
    statusText.textContent = `Replaying ${currentFrom} → ${currentTo}…`;
    progressBar.style.width = "0%";
    animateFlight({
      onDone: () => {
        statusText.textContent = `Arrived in ${currentTo}. ✈️`;
      }
    });
  }

  // ---------- Recording (SVG → canvas → webm) ----------
  function isRecordingSupported() {
    return typeof window.MediaRecorder !== "undefined" &&
           !!HTMLCanvasElement.prototype.captureStream;
  }

  async function recordAnimation() {
    if (!geometry || !svgEl) return;
    if (!isRecordingSupported()) {
      statusText.textContent = "Recording is not supported in this browser.";
      return;
    }

    recordBtn.disabled = true;
    generateBtn.disabled = true;
    replayBtn.disabled = true;

    const { w, h } = dims;
    const canvas = document.createElement("canvas");
    canvas.width  = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");

    // Pick a supported mime type
    const mimeCandidates = [
      "video/webm;codecs=vp9",
      "video/webm;codecs=vp8",
      "video/webm"
    ];
    const mimeType = mimeCandidates.find(m => MediaRecorder.isTypeSupported(m)) || "video/webm";

    const stream = canvas.captureStream(30);
    const recorder = new MediaRecorder(stream, { mimeType });
    const chunks = [];
    recorder.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data); };

    const finished = new Promise((resolve) => {
      recorder.onstop = () => resolve(new Blob(chunks, { type: mimeType }));
    });

    recorder.start();

    // Frame pump: serialize SVG → image → draw to canvas
    let stopPump = false;
    async function pumpFrame() {
      if (stopPump) return;
      const svgString = new XMLSerializer().serializeToString(svgEl);
      const svg64 = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgString);
      const img = new Image();
      img.src = svg64;
      try {
        await img.decode();
        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
      } catch (_) { /* ignore frame errors */ }
      if (!stopPump) requestAnimationFrame(pumpFrame);
    }
    pumpFrame();

    // Restart animation from the beginning so the clip is complete
    progressBar.style.width = "0%";
    statusText.textContent = "Recording your flight…";
    await new Promise((resolve) => {
      animateFlight({
        onDone: () => resolve()
      });
    });

    // Tail buffer so the last frame is captured
    await new Promise(r => setTimeout(r, 250));
    stopPump = true;
    recorder.stop();

    const blob = await finished;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const safe = (s) => s.replace(/[^a-z0-9]+/gi, "-").toLowerCase().replace(/^-|-$/g, "");
    a.href = url;
    a.download = `edge-animation-${safe(currentFrom)}-to-${safe(currentTo)}.webm`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);

    statusText.textContent = "Recording downloaded! Share your reel ✨";
    recordBtn.disabled = false;
    generateBtn.disabled = false;
    replayBtn.disabled = false;
  }

  // ---------- Wire up ----------
  generateBtn.addEventListener("click", generate);
  replayBtn.addEventListener("click", replay);
  recordBtn.addEventListener("click", recordAnimation);

  // Submit on Enter inside inputs
  [fromInput, toInput].forEach(el => {
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter") { e.preventDefault(); generate(); }
    });
  });

  // Rebuild scene on resize (debounced) so layout adapts
  let resizeTimer = null;
  window.addEventListener("resize", () => {
    if (!geometry) return;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      buildScene();
      const { p0 } = geometry;
      planeGroup.setAttribute("transform", `translate(${p0.x} ${p0.y}) rotate(0)`);
      progressBar.style.width = "0%";
    }, 180);
  });

  // Initial empty scene placeholder
  stage.innerHTML = `
    <div style="
      display:flex;align-items:center;justify-content:center;
      min-height:380px;color:#4a6076;text-align:center;padding:24px;
      font-style:italic;">
      Your flight will appear here. Enter a route and press <strong>&nbsp;Generate Animation</strong>.
    </div>
  `;
})();
  
