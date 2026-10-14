import { describe, expect, it } from "vitest";
import {
  E_FLOOR,
  E_WALL,
  HEAVY_LAND_VY,
  THROW_VMAX,
  THROW_VY_MIN,
  pointerVelocity,
  squashFor,
  stepAir,
  throwVelocity,
  type Body,
} from "@/components/buck/physics";

const W = 110;
const floor = { x1: 0, x2: 1000, y: 500 };
const body = (b: Partial<Body>): Body => ({ x: 400, y: 0, vx: 0, vy: 0, bounced: false, ...b });

describe("stepAir", () => {
  it("cai pela gravidade e pousa na plataforma", () => {
    const b = body({ y: 400 });
    let res = null;
    for (let i = 0; i < 120 && !res; i++) res = stepAir(b, 1 / 60, [floor], W, 1440);
    expect(res?.landed).toBe(floor);
    expect(b.y).toBe(500);
    expect(b.vy).toBe(0);
  });

  it("não colide subindo (atravessa a plataforma de baixo para cima)", () => {
    const b = body({ y: 520, vy: -1500 });
    expect(stepAir(b, 1 / 60, [floor], W, 1440)).toBeNull();
    expect(b.y).toBeLessThan(520);
  });

  it("quica uma vez em queda forte e depois assenta", () => {
    const b = body({ y: 495, vy: HEAVY_LAND_VY + 500 });
    const first = stepAir(b, 1 / 60, [floor], W, 1440);
    expect(first?.bounce).toBe(true);
    expect(b.vy).toBeCloseTo(-first!.impactVy * E_FLOOR);
    b.y = 495;
    b.vy = HEAVY_LAND_VY + 500;
    expect(stepAir(b, 1 / 60, [floor], W, 1440)?.bounce).toBe(false);
  });

  it("rebate na parede perdendo energia", () => {
    const b = body({ x: 5, vx: -1000, y: 100 });
    stepAir(b, 1 / 60, [], W, 1440);
    expect(b.x).toBe(4);
    expect(b.vx).toBeGreaterThan(0);
    expect(b.vx).toBeLessThan(1000 * E_WALL);
  });
});

describe("arremesso", () => {
  it("mede a velocidade do ponteiro nos últimos ~80ms", () => {
    const samples = [
      { x: 0, y: 0, t: 0 },
      { x: 50, y: -20, t: 50 },
      { x: 100, y: -40, t: 100 },
    ];
    const [vx, vy] = pointerVelocity(samples, 80);
    expect(vx).toBeCloseTo(1000);
    expect(vy).toBeCloseTo(-400);
  });

  it("soltar parado só deixa cair", () => {
    expect(throwVelocity([50, 50])).toEqual([0, 0]);
  });

  it("limita a velocidade máxima e o impulso para cima", () => {
    const [vx, vy] = throwVelocity([0, -9000]);
    expect(Math.abs(vx)).toBe(0);
    expect(vy).toBe(THROW_VY_MIN);
    const [fx] = throwVelocity([9000, 0]);
    expect(fx).toBeCloseTo(THROW_VMAX);
  });

  it("amassa mais quanto mais forte o pouso", () => {
    expect(squashFor(400)).toBeGreaterThan(squashFor(2000));
    expect(squashFor(10000)).toBe(0.5);
  });
});
