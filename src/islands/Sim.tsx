import { useEffect, useRef, useState } from 'react';
import './sim.css';

export interface SimProps {
  type?: 'loop' | 'wave';
  speed?: number;
  nodes?: number;
  labels?: string[];
  /** Index of a node to emphasise. Used when something else drives the sim. */
  active?: number;
  caption?: string;
}

const SIZE = 400;
const CENTRE = SIZE / 2;
const RING = 120;
const HOT_DISTANCE = 0.05;

// Rounded so the server's first frame matches the browser's exactly.
const round = (value: number) => Number(value.toFixed(2));

function onRing(fraction: number, radius = RING) {
  const angle = fraction * Math.PI * 2 - Math.PI / 2;
  return {
    x: round(CENTRE + radius * Math.cos(angle)),
    y: round(CENTRE + radius * Math.sin(angle)),
  };
}

function wavePath(phase: number): string {
  const points: string[] = [];
  for (let x = 0; x <= SIZE; x += 4) {
    const envelope = Math.sin((Math.PI * x) / SIZE);
    const wave = Math.sin((x / SIZE) * Math.PI * 6 + phase * Math.PI * 2);
    points.push(`${x},${round(CENTRE + wave * 90 * envelope)}`);
  }
  return `M${points.join('L')}`;
}

/** Side labels grow away from the ring, so a long word can't run into its node. */
function labelAnchor(x: number): 'start' | 'middle' | 'end' {
  if (Math.abs(x - CENTRE) < 1) return 'middle';
  return x > CENTRE ? 'start' : 'end';
}

function ringDistance(a: number, b: number): number {
  const distance = Math.abs(a - b);
  return Math.min(distance, 1 - distance);
}

export default function Sim({
  type = 'loop',
  speed = 1,
  nodes = 5,
  labels = [],
  active,
  caption,
}: SimProps) {
  const [playing, setPlaying] = useState(true);
  const [rate, setRate] = useState(speed);
  const phase = useRef(0);
  const pulse = useRef<SVGCircleElement>(null);
  const stations = useRef<Array<SVGCircleElement | null>>([]);
  const wave = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setPlaying(false);
  }, []);

  useEffect(() => {
    if (!playing) return;

    let frame = 0;
    let last = performance.now();

    const tick = (now: number) => {
      phase.current = (phase.current + ((now - last) / 1000) * rate * 0.2) % 1;
      last = now;

      if (type === 'wave') {
        wave.current?.setAttribute('d', wavePath(phase.current));
      } else {
        const { x, y } = onRing(phase.current);
        pulse.current?.setAttribute('cx', String(x));
        pulse.current?.setAttribute('cy', String(y));
        stations.current.forEach((station, index) => {
          const hot = ringDistance(phase.current, index / nodes) < HOT_DISTANCE;
          station?.classList.toggle('sim-hot', hot);
        });
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, rate, type, nodes]);

  const start = onRing(0);

  return (
    <figure className="sim">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label={caption ?? `${type} simulation`}>
        {type === 'wave' ? (
          <>
            <line className="sim-axis" x1={0} y1={CENTRE} x2={SIZE} y2={CENTRE} />
            <path ref={wave} className="sim-wave" d={wavePath(0)} />
          </>
        ) : (
          <>
            <circle className="sim-ring" cx={CENTRE} cy={CENTRE} r={RING} />
            {Array.from({ length: nodes }, (_, index) => {
              const { x, y } = onRing(index / nodes);
              const label = labels[index];
              const anchor = onRing(index / nodes, RING + 26);
              return (
                <g key={index} className={index === active ? 'sim-active' : undefined}>
                  <circle
                    ref={(element) => {
                      stations.current[index] = element;
                    }}
                    className="sim-node"
                    cx={x}
                    cy={y}
                    r={11}
                  />
                  {label && (
                    <text
                      className="sim-label"
                      x={anchor.x}
                      y={anchor.y}
                      dy="0.35em"
                      textAnchor={labelAnchor(anchor.x)}
                    >
                      {label}
                    </text>
                  )}
                </g>
              );
            })}
            <circle ref={pulse} className="sim-pulse" cx={start.x} cy={start.y} r={6} />
          </>
        )}
      </svg>
      <div className="sim-controls">
        <button type="button" onClick={() => setPlaying((value) => !value)}>
          {playing ? 'Pause' : 'Play'}
        </button>
        <label>
          Speed
          <input
            type="range"
            min={0.1}
            max={5}
            step={0.1}
            value={rate}
            onChange={(event) => setRate(Number(event.target.value))}
          />
          <output>{rate.toFixed(1)}×</output>
        </label>
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
