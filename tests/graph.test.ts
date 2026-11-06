import { describe, expect, test } from 'bun:test';
import {
  FIT_MAX_ZOOM,
  MAX_ZOOM,
  MIN_ZOOM,
  easeTowards,
  fitView,
  toWorld,
  undirectedLinks,
  zoomAt,
} from '../src/islands/graph-view';

describe('zoomAt', () => {
  const view = { x: 40, y: -20, k: 1.5 };
  const anchor = { x: 300, y: 200 };

  test('keeps the world point under the cursor in place', () => {
    const before = toWorld(view, anchor);
    const after = toWorld(zoomAt(view, anchor, 1.7), anchor);
    expect(after.x).toBeCloseTo(before.x);
    expect(after.y).toBeCloseTo(before.y);
  });

  test('stays anchored partway through the eased animation', () => {
    const goal = zoomAt(view, anchor, 2);
    const before = toWorld(view, anchor);
    const f = 0.37;
    const midway = {
      x: view.x + (goal.x - view.x) * f,
      y: view.y + (goal.y - view.y) * f,
      k: view.k + (goal.k - view.k) * f,
    };
    expect(toWorld(midway, anchor).x).toBeCloseTo(before.x);
    expect(toWorld(midway, anchor).y).toBeCloseTo(before.y);
  });

  test('respects the zoom limits', () => {
    expect(zoomAt(view, anchor, 100).k).toBe(MAX_ZOOM);
    expect(zoomAt(view, anchor, 0.001).k).toBe(MIN_ZOOM);
  });
});

describe('fitView', () => {
  const points = [
    { x: -500, y: -100 },
    { x: 700, y: 300 },
  ];

  test('puts every point inside the padded frame', () => {
    const view = fitView(points, 800, 600, 50);
    for (const point of points) {
      const x = point.x * view.k + view.x;
      const y = point.y * view.k + view.y;
      expect(x).toBeGreaterThanOrEqual(50 - 0.001);
      expect(x).toBeLessThanOrEqual(750 + 0.001);
      expect(y).toBeGreaterThanOrEqual(50 - 0.001);
      expect(y).toBeLessThanOrEqual(550 + 0.001);
    }
  });

  test('does not blow a small graph up to fill the frame', () => {
    const view = fitView([{ x: 0, y: 0 }, { x: 10, y: 10 }], 800, 600, 50);
    expect(view.k).toBe(FIT_MAX_ZOOM);
  });

  test('handles an empty graph', () => {
    expect(fitView([], 800, 600, 50)).toEqual({ x: 400, y: 300, k: 1 });
  });
});

describe('easeTowards', () => {
  test('is independent of frame rate', () => {
    const at60 = easeTowards(easeTowards(0, 1, 16, 90), 1, 16, 90);
    const at30 = easeTowards(0, 1, 32, 90);
    expect(at60).toBeCloseTo(at30);
  });

  test('jumps straight to the target when easing is off', () => {
    expect(easeTowards(0, 1, 0, 0)).toBe(1);
    expect(easeTowards(0, 1, 16, 0)).toBe(1);
  });
});

test('undirectedLinks draws a two-way link once', () => {
  const links = [
    { source: 'a', target: 'b' },
    { source: 'b', target: 'a' },
    { source: 'a', target: 'c' },
  ];
  expect(undirectedLinks(links)).toEqual([links[0], links[2]] as typeof links);
});
