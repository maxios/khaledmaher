import { useEffect, useState } from 'react';
import Sim from './Sim';

interface LoopStageProps {
  labels: string[];
}

/** Highlights the loop node for whichever `[data-step]` section is mid-screen. */
export default function LoopStage({ labels }: LoopStageProps) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(Number((entry.target as HTMLElement).dataset.step));
          }
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );

    document.querySelectorAll('[data-step]').forEach((step) => observer.observe(step));
    return () => observer.disconnect();
  }, []);

  return <Sim type="loop" speed={0.8} nodes={labels.length} labels={labels} active={active} />;
}
