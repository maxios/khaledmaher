import { useEffect, useRef } from 'react';
import { type GraphData, type GraphView, createGraphView } from './graph-view';
import './graph.css';

interface GraphProps extends GraphData {
  /** The small version on the home page, which leaves the mouse wheel to the page. */
  compact?: boolean;
}

export default function Graph({ nodes, links, compact = false }: GraphProps) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const view = useRef<GraphView | null>(null);

  useEffect(() => {
    if (!canvas.current) return;

    const created = createGraphView(canvas.current, { nodes, links }, { wheelZoom: !compact });
    view.current = created;
    return () => created.destroy();
  }, [nodes, links, compact]);

  return (
    <div className={compact ? 'graph graph-compact' : 'graph'}>
      <canvas ref={canvas} aria-hidden="true" />
      {compact ? (
        <div className="graph-caption">
          <p>The graph</p>
          <p>Live. Drag a node.</p>
        </div>
      ) : (
        <>
          <p className="graph-hint">Drag a node. Pinch or scroll to zoom.</p>
          <button type="button" className="graph-fit" onClick={() => view.current?.fit()}>
            Fit
          </button>
        </>
      )}
      {/* A canvas can't be tabbed through, so keyboard users move along this list instead. */}
      <ul className="graph-list" aria-label="Posts in the graph">
        {nodes.map((node) => (
          <li key={node.id}>
            <a
              href={node.url}
              onFocus={() => view.current?.highlight(node.id)}
              onBlur={() => view.current?.highlight(null)}
            >
              {node.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
