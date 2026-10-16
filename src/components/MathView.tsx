import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    katex?: {
      render: (tex: string, element: HTMLElement, options?: Record<string, unknown>) => void;
      renderToString: (tex: string, options?: Record<string, unknown>) => string;
    };
  }
}

interface MathViewProps {
  math: string;
  block?: boolean;
  className?: string;
}

export const MathView: React.FC<MathViewProps> = ({ math, block = false, className = '' }) => {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (typeof window !== 'undefined' && window.katex) {
      try {
        window.katex.render(math, containerRef.current, {
          displayMode: block,
          throwOnError: false,
        });
      } catch (err) {
        console.warn('KaTeX render error:', err);
        containerRef.current.textContent = math;
      }
    } else {
      // Fallback if KaTeX is not yet loaded
      containerRef.current.textContent = math;

      const checkTimer = setInterval(() => {
        if (window.katex && containerRef.current) {
          clearInterval(checkTimer);
          try {
            window.katex.render(math, containerRef.current, {
              displayMode: block,
              throwOnError: false,
            });
          } catch {
            // Keep fallback
          }
        }
      }, 200);

      return () => clearInterval(checkTimer);
    }
  }, [math, block]);

  return (
    <span
      ref={containerRef}
      className={`inline-block font-sans ${block ? 'my-2 text-center w-full overflow-x-auto py-1' : ''} ${className}`}
    />
  );
};
