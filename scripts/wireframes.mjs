// Gera os wireframes (SVG) a partir do layout real do site.
// Uso: node scripts/wireframes.mjs [url] [pasta]
//   url padrão: http://localhost:3000/pt   pasta padrão: docs/wireframes
// Precisa do Playwright: npx playwright install chromium
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";

const url = process.argv[2] ?? "http://localhost:3000/pt";
const outDir = process.argv[3] ?? "docs/wireframes";
const sections = ["home", "about", "projects", "github", "experience", "design", "contact"];
const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];

mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });

for (const vp of viewports) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
  await page.addInitScript(() => sessionStorage.setItem("portfolio:intro-seen", "1"));
  await page.goto(url, { waitUntil: "networkidle" });

  // Rola a página toda para disparar as animações de entrada e depois congela tudo.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 300) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 40));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1200);
  await page.addStyleTag({
    content: `*{animation:none!important;transition:none!important}
      [aria-label^="Buck,"], .intro, nextjs-portal {display:none!important}
      .fixed.inset-0.-z-10 {display:none!important}`,
  });

  for (const id of sections) {
    const shapes = await page.evaluate(collect, id);
    if (!shapes) continue;
    writeFileSync(`${outDir}/${vp.name}-${id}.svg`, toSvg(shapes));
    console.log(`${vp.name}-${id}.svg`);
  }
  await page.close();
}
await browser.close();

// Roda dentro da página: transforma o layout de uma seção em formas simples.
function collect(id) {
  const root = id === "home" ? document.getElementById("home") : document.getElementById(id);
  if (!root) return null;
  const header = document.querySelector("header");
  const base = root.getBoundingClientRect();
  const top = base.top + scrollY;
  const width = document.documentElement.clientWidth;
  const shapes = { width, height: Math.ceil(base.height) + (id === "home" ? 64 : 0), items: [] };
  const offY = id === "home" ? 64 : 0;
  const rel = (r) => ({ x: r.left, y: r.top + scrollY - top + offY, w: r.width, h: r.height });
  const done = new Set();
  // Agrupa as palavras do título pela linha em que aparecem.
  const headingLines = (h) => {
    const walker = document.createTreeWalker(h, NodeFilter.SHOW_TEXT);
    const lines = [];
    let node;
    while ((node = walker.nextNode())) {
      for (const m of node.textContent.matchAll(/\S+/g)) {
        const range = document.createRange();
        range.setStart(node, m.index);
        range.setEnd(node, m.index + m[0].length);
        const r = range.getBoundingClientRect();
        if (!r.width) continue;
        let line = lines.find((l) => Math.abs(l.rect.top - r.top) < r.height / 2);
        if (!line) lines.push((line = { rect: { left: r.left, top: r.top, width: r.width, height: r.height }, parts: [] }));
        const right = Math.max(line.rect.left + line.rect.width, r.right);
        line.rect.left = Math.min(line.rect.left, r.left);
        line.rect.width = right - line.rect.left;
        line.parts.push({ x: r.left, right: r.right, text: m[0] });
      }
    }
    // Letras do título animado são nós separados: junta letras coladas e separa palavras.
    return lines.map((l) => {
      l.parts.sort((a, b) => a.x - b.x);
      let text = "";
      let lastRight = null;
      for (const p of l.parts) {
        text += lastRight !== null && p.x - lastRight > 4 ? ` ${p.text}` : p.text;
        lastRight = p.right;
      }
      return { rect: l.rect, text };
    });
  };
  const visible = (el) => {
    const s = getComputedStyle(el);
    return s.display !== "none" && s.visibility !== "hidden" && Number(s.opacity) > 0.05;
  };

  if (id === "home" && header) {
    const h = header.getBoundingClientRect();
    shapes.items.push({ type: "bar", x: 0, y: 0, w: width, h: h.height, fill: "#f4f4f2" });
    header.querySelectorAll("a, button").forEach((el) => {
      if (!visible(el)) return;
      const r = el.getBoundingClientRect();
      if (r.width && r.top < h.bottom) shapes.items.push({ type: "text", ...rel(r), y: r.top, text: el.textContent.trim().slice(0, 18), size: 13 });
    });
  }

  for (const el of root.querySelectorAll("*")) {
    if (!visible(el)) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) continue;
    const s = getComputedStyle(el);
    const tag = el.tagName.toLowerCase();
    const box = rel(r);

    if (tag === "img" || (tag === "svg" && r.width > 40)) {
      shapes.items.push({ type: "image", ...box });
      continue;
    }
    const side = (n) => parseFloat(s[`border${n}Width`]) > 0 && s[`border${n}Style`] !== "none";
    const bordered = side("Top") && side("Right") && side("Bottom") && side("Left");
    if (!bordered && side("Top")) shapes.items.push({ type: "rule", ...box, h: 0 });
    if (!bordered && side("Bottom")) shapes.items.push({ type: "rule", ...box, y: box.y + box.h, h: 0 });
    if (!bordered && side("Left")) shapes.items.push({ type: "rule", ...box, w: 0 });
    const filled = s.backgroundColor !== "rgba(0, 0, 0, 0)" && s.backgroundColor !== "transparent";
    if (tag === "input" || tag === "textarea") {
      shapes.items.push({ type: "field", ...box, radius: parseFloat(s.borderRadius) || 0 });
      continue;
    }
    if (bordered || filled) {
      shapes.items.push({ type: "box", ...box, radius: Math.min(parseFloat(s.borderRadius) || 0, 32), filled });
    }

    // Texto: títulos com o texto real, o resto vira barras (uma por linha).
    for (const node of el.childNodes) {
      if (node.nodeType !== 3 || !node.textContent.trim()) continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      const heading = /^h[1-3]$/.test(tag) || el.closest("h1, h2, h3");
      const size = parseFloat(s.fontSize);
      if (heading) {
        const h = el.closest("h1, h2, h3") ?? el;
        if (!done.has(h)) {
          done.add(h);
          for (const line of headingLines(h)) shapes.items.push({ type: "heading", ...rel(line.rect), text: line.text, size: Math.min(size, 64) });
        }
      } else {
        for (const line of range.getClientRects()) {
          if (line.width < 2) continue;
          shapes.items.push({ type: "line", ...rel(line), size });
        }
      }
    }
  }

  return shapes;
}

function toSvg({ width, height, items }) {
  const esc = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const out = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" font-family="Inter, Helvetica, Arial, sans-serif">`,
    `<rect width="100%" height="100%" fill="#ffffff"/>`,
  ];
  for (const i of items) {
    const x = i.x.toFixed(1), y = i.y.toFixed(1), w = i.w.toFixed(1), h = i.h.toFixed(1);
    if (i.type === "bar") out.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${i.fill}" stroke="#d4d4d0"/>`);
    else if (i.type === "box")
      out.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${i.radius}" fill="${i.filled ? "#f6f6f4" : "none"}" stroke="#c9c9c4"/>`);
    else if (i.type === "rule")
      out.push(`<line x1="${x}" y1="${y}" x2="${(i.x + i.w).toFixed(1)}" y2="${(i.y + i.h).toFixed(1)}" stroke="#d4d4d0"/>`);
    else if (i.type === "field")
      out.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${i.radius}" fill="#ffffff" stroke="#9a9a94" stroke-dasharray="4 3"/>`);
    else if (i.type === "image")
      out.push(
        `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#ecece9" stroke="#b9b9b4"/>`,
        `<path d="M${x} ${y} L${(i.x + i.w).toFixed(1)} ${(i.y + i.h).toFixed(1)} M${(i.x + i.w).toFixed(1)} ${y} L${x} ${(i.y + i.h).toFixed(1)}" stroke="#c9c9c4"/></g>`,
      );
    else if (i.type === "line") {
      const bh = Math.max(4, Math.min(i.h * 0.45, 14));
      out.push(`<rect x="${x}" y="${(i.y + (i.h - bh) / 2).toFixed(1)}" width="${w}" height="${bh.toFixed(1)}" rx="${(bh / 2).toFixed(1)}" fill="#d9d9d5"/>`);
    } else if (i.type === "heading")
      out.push(`<text x="${x}" y="${(i.y + i.size).toFixed(1)}" font-size="${i.size}" font-weight="600" fill="#3a3a3a">${esc(i.text)}</text>`);
    else if (i.type === "text")
      out.push(`<text x="${x}" y="${(i.y + i.h / 2 + 4).toFixed(1)}" font-size="${i.size}" fill="#555">${esc(i.text)}</text>`);
  }
  out.push("</svg>");
  return out.join("\n");
}
