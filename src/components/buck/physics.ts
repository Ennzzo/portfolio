// Unidades: px e segundos, em coordenadas do documento. `y` é a altura das patas.

export const G = 2600; // gravidade (px/s²)
export const V_TERM = 1900; // velocidade terminal de queda
export const WALK_V = 95;
export const THROW_VMAX = 2600;
export const THROW_VY_MIN = -2200;
export const THROW_VY_MAX = 1200;
export const DRAG_K = 0.9; // resistência do ar no eixo x
export const E_WALL = 0.55; // energia que sobra ao bater na parede
export const E_FLOOR = 0.26; // energia que sobra no quique do chão
export const HARD_LAND_VY = 430;
export const HEAVY_LAND_VY = 1150;

export const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);

export type Platform = { x1: number; x2: number; y: number; el?: Element };

export type Body = {
  x: number; // canto esquerdo
  y: number; // patas
  vx: number;
  vy: number;
  bounced: boolean;
};

export type AirResult = { landed: Platform; impactVy: number; bounce: boolean } | null;

export function stepAir(b: Body, dt: number, platforms: Platform[], width: number, viewportW: number): AirResult {
  b.vy = Math.min(V_TERM, b.vy + G * dt);
  b.vx *= Math.exp(-DRAG_K * dt);
  const prevY = b.y;
  b.y += b.vy * dt;
  b.x += b.vx * dt;

  const maxX = Math.max(4, viewportW - width - 4);
  if (b.x <= 4 || b.x >= maxX) {
    b.x = clamp(b.x, 4, maxX);
    b.vx = -b.vx * E_WALL;
  }

  if (b.vy <= 0) return null;
  const cx = b.x + width / 2;
  let land: Platform | null = null;
  for (const p of platforms) {
    if (cx > p.x1 - 8 && cx < p.x2 + 8 && prevY <= p.y + 1 && b.y >= p.y) {
      if (!land || p.y < land.y) land = p;
    }
  }
  if (!land) return null;

  const impactVy = b.vy;
  b.y = land.y;
  if (impactVy > HEAVY_LAND_VY && !b.bounced) {
    b.bounced = true;
    b.vy = -impactVy * E_FLOOR;
    b.vx *= 0.7;
    return { landed: land, impactVy, bounce: true };
  }
  b.vy = 0;
  return { landed: land, impactVy, bounce: false };
}

export const squashFor = (impactVy: number) => clamp(1 - impactVy / 3800, 0.5, 0.9);

export function stepSquash(s: { squash: number; squashV: number }, dt: number) {
  s.squashV += ((1 - s.squash) * 140 - s.squashV * 14) * dt;
  s.squash = clamp(s.squash + s.squashV * dt, 0.45, 1.12);
}

export type PointerSample = { x: number; y: number; t: number };

/** Velocidade do ponteiro (px/s) olhando `msBack` ms para trás. */
export function pointerVelocity(samples: PointerSample[], msBack = 80): [number, number] {
  if (samples.length < 2) return [0, 0];
  const a = samples[samples.length - 1];
  let b = samples[samples.length - 2];
  for (let i = samples.length - 2; i >= 0; i--) {
    b = samples[i];
    if (a.t - b.t >= msBack) break;
  }
  const d = a.t - b.t;
  if (d < 1) return [0, 0];
  return [((a.x - b.x) / d) * 1000, ((a.y - b.y) / d) * 1000];
}

export function throwVelocity([vx, vy]: [number, number]): [number, number] {
  const speed = Math.hypot(vx, vy);
  if (speed < 120) return [0, 0]; // soltou parado: só cai
  const k = speed > THROW_VMAX ? THROW_VMAX / speed : 1;
  return [vx * k, clamp(vy * k, THROW_VY_MIN, THROW_VY_MAX)];
}

export function platformUnder(cx: number, y: number, platforms: Platform[]): Platform | null {
  for (const p of platforms) if (Math.abs(p.y - y) < 2 && cx >= p.x1 && cx <= p.x2) return p;
  return null;
}
