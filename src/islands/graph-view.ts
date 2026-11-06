import {
  type SimulationLinkDatum,
  type SimulationNodeDatum,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
} from 'd3-force';

export interface GraphNodeData {
  id: string;
  title: string;
  url: string;
  links: number;
}

export interface GraphLinkData {
  source: string;
  target: string;
}

export interface GraphData {
  nodes: GraphNodeData[];
  links: GraphLinkData[];
}

export interface GraphView {
  /** Returns to the automatic framing, after the user has panned or zoomed. */
  fit(): void;
  /** Highlights a node without a pointer, for keyboard users. */
  highlight(id: string | null): void;
  destroy(): void;
}

export interface Point {
  x: number;
  y: number;
}

/** Screen position of the world origin, plus the zoom. */
export interface Transform extends Point {
  k: number;
}

export const MIN_ZOOM = 0.15;
export const MAX_ZOOM = 4;
/** The automatic framing stops here, so a small graph isn't blown up to fill the frame. */
export const FIT_MAX_ZOOM = 1.2;

const FIT_PADDING = 90;
const VIEW_EASE_MS = 90;
const HIGHLIGHT_EASE_MS = 110;
const SETTLED = 0.002;
const DRAG_ENERGY = 0.25;
const CLICK_TRAVEL = 5;
const MOUSE_REACH = 6;
const TOUCH_REACH = 16;
const FADED_OPACITY = 0.16;

const clamp = (value: number, low: number, high: number) => Math.min(high, Math.max(low, value));

export function toWorld(view: Transform, point: Point): Point {
  return { x: (point.x - view.x) / view.k, y: (point.y - view.y) / view.k };
}

/** Zooms while keeping the world point under `anchor` exactly where it is. */
export function zoomAt(view: Transform, anchor: Point, factor: number): Transform {
  const k = clamp(view.k * factor, MIN_ZOOM, MAX_ZOOM);
  const ratio = k / view.k;
  return {
    k,
    x: anchor.x - (anchor.x - view.x) * ratio,
    y: anchor.y - (anchor.y - view.y) * ratio,
  };
}

/** The transform that centres `points` in the frame, with `padding` around them. */
export function fitView(
  points: Point[],
  width: number,
  height: number,
  padding: number,
): Transform {
  if (points.length === 0) return { x: width / 2, y: height / 2, k: 1 };

  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const left = Math.min(...xs);
  const right = Math.max(...xs);
  const top = Math.min(...ys);
  const bottom = Math.max(...ys);
  const k = clamp(
    Math.min(
      (width - padding * 2) / Math.max(right - left, 1),
      (height - padding * 2) / Math.max(bottom - top, 1),
    ),
    MIN_ZOOM,
    FIT_MAX_ZOOM,
  );

  return { k, x: width / 2 - ((left + right) / 2) * k, y: height / 2 - ((top + bottom) / 2) * k };
}

/** Exponential easing. Based on elapsed time, so it feels the same at 60Hz and 120Hz. */
export function easeTowards(current: number, target: number, elapsed: number, ms: number): number {
  if (ms <= 0) return target;
  return target + (current - target) * Math.exp(-elapsed / ms);
}

/** Two notes that link to each other should be drawn as one line. */
export function undirectedLinks(links: GraphLinkData[]): GraphLinkData[] {
  const seen = new Set<string>();
  return links.filter(({ source, target }) => {
    const key = [source, target].sort().join('\n');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

interface ViewNode extends GraphNodeData, SimulationNodeDatum {
  /** Eased from 0 to 1 while this node is hovered or next to the hovered node. */
  lit: number;
}

interface ViewLink extends SimulationLinkDatum<ViewNode> {
  lit: number;
}

const nodeRadius = (node: GraphNodeData) => 4.5 + Math.sqrt(node.links) * 2.4;

export interface GraphViewOptions {
  /** Off where the graph sits in a scrolling page, so it can't trap the wheel. */
  wheelZoom?: boolean;
}

export function createGraphView(
  canvas: HTMLCanvasElement,
  data: GraphData,
  { wheelZoom = true }: GraphViewOptions = {},
): GraphView {
  const context = canvas.getContext('2d');
  if (!context) throw new Error('This browser has no 2D canvas');

  const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const viewEase = calm ? 0 : VIEW_EASE_MS;
  const highlightEase = calm ? 0 : HIGHLIGHT_EASE_MS;

  const nodes: ViewNode[] = data.nodes.map((node) => ({ ...node, lit: 0 }));
  const links: ViewLink[] = data.links.map((link) => ({ ...link, lit: 0 }));
  const byId = new Map(nodes.map((node) => [node.id, node]));
  const neighbours = new Map<string, Set<string>>(nodes.map((node) => [node.id, new Set()]));
  for (const { source, target } of data.links) {
    neighbours.get(source)?.add(target);
    neighbours.get(target)?.add(source);
  }

  // Ticked from the draw loop rather than d3's own timer, so physics and paint stay in step.
  const simulation = forceSimulation<ViewNode>(nodes)
    .alphaDecay(0.016)
    .velocityDecay(0.3)
    .force('link', forceLink<ViewNode, ViewLink>(links).id((node) => node.id).distance(95))
    .force('charge', forceManyBody().strength(-340).distanceMax(700))
    .force('x', forceX(0).strength(0.045))
    .force('y', forceY(0).strength(0.045))
    .force('collide', forceCollide<ViewNode>((node) => nodeRadius(node) + 14))
    .stop();

  if (calm) {
    simulation.tick(300);
    simulation.alpha(0);
  }

  let box = { width: 0, height: 0, ratio: 1 };
  let view: Transform = { x: 0, y: 0, k: 1 };
  let goal: Transform = view;
  /** Set once the user pans or zooms, which stops the automatic framing. */
  let framedByUser = false;
  let fade = 0;
  let hovered: ViewNode | undefined;
  let pinned: ViewNode | undefined;
  let grabbed: ViewNode | undefined;
  let panning = false;
  let travelled = 0;
  let frame = 0;
  let lastFrame = 0;
  let pinch: { distance: number; centre: Point } | undefined;
  const pointers = new Map<number, Point>();
  let palette = { ink: '', muted: '', rule: '', accent: '', surface: '', font: '' };

  const readPalette = () => {
    const styles = getComputedStyle(canvas);
    const token = (name: string) => styles.getPropertyValue(name).trim();
    palette = {
      ink: token('--ink'),
      muted: token('--muted'),
      rule: token('--rule'),
      accent: token('--accent'),
      surface: token('--surface'),
      font: `12.5px ${token('--mono')}`,
    };
  };

  const toScreen = (node: ViewNode): Point => ({
    x: (node.x ?? 0) * view.k + view.x,
    y: (node.y ?? 0) * view.k + view.y,
  });

  // Grows slower than the zoom, so nodes stay in proportion when zoomed far in or out.
  const screenRadius = (node: ViewNode) =>
    nodeRadius(node) * Math.sqrt(view.k) * (1 + 0.3 * (node === hovered ? fade : 0));

  const opacity = (lit: number) => 1 - fade * (1 - lit) * (1 - FADED_OPACITY);

  const easeHighlight = (elapsed: number): boolean => {
    const active = hovered ?? pinned;
    const friends = active ? neighbours.get(active.id) : undefined;
    const isLit = (node: ViewNode) => node === active || friends?.has(node.id) === true;
    let moving = false;

    const step = (current: number, target: number) => {
      const next = easeTowards(current, target, elapsed, highlightEase);
      if (Math.abs(next - target) > SETTLED) moving = true;
      return Math.abs(next - target) > SETTLED ? next : target;
    };

    fade = step(fade, active ? 1 : 0);
    for (const node of nodes) node.lit = step(node.lit, isLit(node) ? 1 : 0);
    for (const link of links) {
      const touches = link.source === active || link.target === active;
      link.lit = step(link.lit, touches ? 1 : 0);
    }
    return moving;
  };

  const easeView = (elapsed: number): boolean => {
    if (!framedByUser) {
      goal = fitView(
        nodes.map((node) => ({ x: node.x ?? 0, y: node.y ?? 0 })),
        box.width,
        box.height,
        // Full padding would squeeze the graph into the middle of a phone screen.
        Math.min(FIT_PADDING, box.width * 0.12),
      );
    }

    // x, y and k share one easing factor, which keeps a zoom's anchor perfectly still.
    view = {
      x: easeTowards(view.x, goal.x, elapsed, viewEase),
      y: easeTowards(view.y, goal.y, elapsed, viewEase),
      k: easeTowards(view.k, goal.k, elapsed, viewEase),
    };

    const moving =
      Math.abs(view.x - goal.x) > 0.05 ||
      Math.abs(view.y - goal.y) > 0.05 ||
      Math.abs(view.k - goal.k) > 0.0005;
    if (!moving) view = goal;
    return moving;
  };

  const drawLinks = () => {
    context.lineCap = 'round';
    for (const link of links) {
      const from = toScreen(link.source as ViewNode);
      const to = toScreen(link.target as ViewNode);
      const glow = link.lit * fade;

      const path = () => {
        context.beginPath();
        context.moveTo(from.x, from.y);
        context.lineTo(to.x, to.y);
        context.stroke();
      };

      context.globalAlpha = opacity(link.lit);
      context.strokeStyle = palette.muted;
      context.lineWidth = 1;
      context.globalAlpha *= 0.45;
      path();

      if (glow > 0) {
        context.globalAlpha = glow;
        context.strokeStyle = palette.accent;
        context.lineWidth = 1.5;
        path();
      }
    }
  };

  const drawNodes = () => {
    for (const node of nodes) {
      const { x, y } = toScreen(node);
      const radius = screenRadius(node);
      const glow = node.lit * fade;

      const dot = () => {
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fill();
      };

      // An opaque base stops links showing through a faded node.
      context.globalAlpha = 1;
      context.fillStyle = palette.surface;
      dot();

      context.globalAlpha = opacity(node.lit);
      context.fillStyle = palette.muted;
      dot();

      if (glow > 0) {
        context.globalAlpha = glow;
        context.fillStyle = palette.accent;
        dot();
      }
    }
  };

  const drawLabels = () => {
    // Labels fade in with the zoom, so a dense graph doesn't turn into a wall of text.
    const zoomed = clamp((view.k - 0.7) / 0.3, 0, 1);

    context.font = palette.font;
    context.textAlign = 'center';
    context.textBaseline = 'top';
    context.lineJoin = 'round';
    context.lineWidth = 4;
    context.strokeStyle = palette.surface;
    context.fillStyle = palette.ink;

    for (const node of nodes) {
      const alpha = Math.max(zoomed, node.lit * fade) * opacity(node.lit);
      if (alpha <= 0.01) continue;

      const { x, y } = toScreen(node);
      const top = y + screenRadius(node) + 6;
      context.globalAlpha = alpha;
      context.strokeText(node.title, x, top);
      context.fillText(node.title, x, top);
    }
  };

  const draw = () => {
    context.setTransform(box.ratio, 0, 0, box.ratio, 0, 0);
    context.clearRect(0, 0, box.width, box.height);
    drawLinks();
    drawNodes();
    drawLabels();
    context.globalAlpha = 1;
  };

  const loop = (now: number) => {
    frame = 0;
    const elapsed = Math.min(now - lastFrame, 50);
    lastFrame = now;

    const physics = simulation.alpha() > simulation.alphaMin();
    if (physics) simulation.tick();
    const lighting = easeHighlight(elapsed);
    const camera = easeView(elapsed);
    draw();

    // Stops asking for frames once everything is still, so an idle graph costs nothing.
    if (physics || lighting || camera) frame = requestAnimationFrame(loop);
  };

  const wake = () => {
    if (frame) return;
    lastFrame = performance.now();
    frame = requestAnimationFrame(loop);
  };

  const pointFrom = (event: MouseEvent): Point => {
    const rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const nodeAt = (point: Point, reach: number): ViewNode | undefined => {
    for (let index = nodes.length - 1; index >= 0; index--) {
      const node = nodes[index] as ViewNode;
      const { x, y } = toScreen(node);
      if (Math.hypot(point.x - x, point.y - y) <= screenRadius(node) + reach) return node;
    }
    return undefined;
  };

  const updateCursor = () => {
    if (grabbed || panning) canvas.style.cursor = 'grabbing';
    else canvas.style.cursor = hovered ? 'pointer' : 'grab';
  };

  const setHovered = (node: ViewNode | undefined) => {
    if (node === hovered) return;
    hovered = node;
    updateCursor();
    wake();
  };

  const release = () => {
    if (!grabbed) return;
    grabbed.fx = null;
    grabbed.fy = null;
    grabbed = undefined;
    simulation.alphaTarget(0);
  };

  const measurePinch = () => {
    const [a, b] = [...pointers.values()] as [Point, Point];
    return {
      distance: Math.hypot(a.x - b.x, a.y - b.y),
      centre: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
    };
  };

  const onPointerDown = (event: PointerEvent) => {
    canvas.setPointerCapture(event.pointerId);
    const point = pointFrom(event);
    pointers.set(event.pointerId, point);

    if (pointers.size === 2) {
      release();
      panning = false;
      pinch = measurePinch();
      return;
    }

    travelled = 0;
    grabbed = nodeAt(point, event.pointerType === 'touch' ? TOUCH_REACH : MOUSE_REACH);
    if (grabbed) {
      grabbed.fx = grabbed.x;
      grabbed.fy = grabbed.y;
      // Raise the energy straight away, so the network responds on the first frame of a drag.
      simulation.alphaTarget(DRAG_ENERGY).alpha(Math.max(simulation.alpha(), DRAG_ENERGY));
    } else {
      panning = true;
    }
    updateCursor();
    wake();
  };

  const onPointerMove = (event: PointerEvent) => {
    const point = pointFrom(event);
    const previous = pointers.get(event.pointerId);
    if (previous) pointers.set(event.pointerId, point);

    if (pinch && pointers.size === 2) {
      const next = measurePinch();
      framedByUser = true;
      goal = zoomAt(goal, next.centre, next.distance / pinch.distance);
      goal = {
        ...goal,
        x: goal.x + next.centre.x - pinch.centre.x,
        y: goal.y + next.centre.y - pinch.centre.y,
      };
      pinch = next;
      wake();
    } else if (grabbed && previous) {
      travelled += Math.hypot(point.x - previous.x, point.y - previous.y);
      const world = toWorld(view, point);
      grabbed.fx = world.x;
      grabbed.fy = world.y;
      wake();
    } else if (panning && previous) {
      travelled += Math.hypot(point.x - previous.x, point.y - previous.y);
      framedByUser = true;
      // Moving the goal, not the view, gives panning the same soft follow as zooming.
      goal = { ...goal, x: goal.x + point.x - previous.x, y: goal.y + point.y - previous.y };
      wake();
    } else if (!previous) {
      setHovered(nodeAt(point, MOUSE_REACH));
    }
  };

  const onPointerUp = (event: PointerEvent) => {
    const clicked = grabbed && travelled < CLICK_TRAVEL ? grabbed : undefined;

    pointers.delete(event.pointerId);
    if (pointers.size < 2) pinch = undefined;
    if (pointers.size === 0) {
      release();
      panning = false;
    }
    updateCursor();
    wake();

    if (clicked) {
      if (event.metaKey || event.ctrlKey) window.open(clicked.url, '_blank');
      else window.location.assign(clicked.url);
    }
  };

  const onPointerCancel = (event: PointerEvent) => {
    pointers.delete(event.pointerId);
    pinch = undefined;
    panning = false;
    release();
    updateCursor();
  };

  const onPointerLeave = () => {
    if (pointers.size === 0) setHovered(undefined);
  };

  const onWheel = (event: WheelEvent) => {
    // Trackpad pinches still zoom, because they can't be mistaken for scrolling.
    if (!wheelZoom && !event.ctrlKey) return;
    event.preventDefault();
    framedByUser = true;
    const pixels = event.deltaY * (event.deltaMode === WheelEvent.DOM_DELTA_LINE ? 16 : 1);
    // Trackpad pinches arrive as small wheel deltas with `ctrlKey` set.
    const speed = event.ctrlKey ? 0.01 : 0.0022;
    goal = zoomAt(goal, pointFrom(event), Math.exp(-pixels * speed));
    wake();
  };

  const onDoubleClick = (event: MouseEvent) => {
    if (!nodeAt(pointFrom(event), MOUSE_REACH)) {
      framedByUser = false;
      wake();
    }
  };

  const onResize = () => {
    const rect = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    const first = box.width === 0;

    box = { width: rect.width, height: rect.height, ratio };
    canvas.width = Math.round(rect.width * ratio);
    canvas.height = Math.round(rect.height * ratio);

    if (first) {
      view = { x: rect.width / 2, y: rect.height / 2, k: 1 };
      goal = view;
    }
    draw();
    wake();
  };

  const onSchemeChange = () => {
    readPalette();
    wake();
  };

  const scheme = window.matchMedia('(prefers-color-scheme: dark)');
  const resizeObserver = new ResizeObserver(onResize);

  readPalette();
  resizeObserver.observe(canvas);
  scheme.addEventListener('change', onSchemeChange);
  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointercancel', onPointerCancel);
  canvas.addEventListener('pointerleave', onPointerLeave);
  canvas.addEventListener('dblclick', onDoubleClick);
  // Not passive, because zooming has to stop the page from scrolling.
  canvas.addEventListener('wheel', onWheel, { passive: false });
  // The canvas can't reflow text, so redraw once the real font has arrived.
  void document.fonts.ready.then(wake);
  updateCursor();

  return {
    fit() {
      framedByUser = false;
      wake();
    },
    highlight(id) {
      pinned = id === null ? undefined : byId.get(id);
      wake();
    },
    destroy() {
      cancelAnimationFrame(frame);
      simulation.stop();
      resizeObserver.disconnect();
      scheme.removeEventListener('change', onSchemeChange);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerCancel);
      canvas.removeEventListener('pointerleave', onPointerLeave);
      canvas.removeEventListener('dblclick', onDoubleClick);
      canvas.removeEventListener('wheel', onWheel);
    },
  };
}
