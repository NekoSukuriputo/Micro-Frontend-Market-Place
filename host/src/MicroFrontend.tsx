import React, { useEffect, useRef } from "react";

interface MicroFrontendProps {
  mountFunction: Promise<{ mount: (el: HTMLElement) => () => void }>;
}

export const MicroFrontend: React.FC<MicroFrontendProps> = ({ mountFunction }) => {
  const ref = useRef<HTMLDivElement>(null);
  const unmountRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    let unmounted = false;

    mountFunction.then((module) => {
      if (!unmounted && ref.current) {
        unmountRef.current = module.mount(ref.current);
      }
    }).catch((err) => {
      console.error("Failed to load micro frontend:", err);
      if (ref.current) {
        ref.current.innerHTML = `<div class="text-red-500 p-4 border border-red-300 rounded bg-red-50">Error loading module. Is it running?</div>`;
      }
    });

    return () => {
      unmounted = true;
      if (unmountRef.current) {
        unmountRef.current();
        unmountRef.current = null;
      }
    };
  }, [mountFunction]);

  return <div ref={ref} className="w-full h-full" />;
};
