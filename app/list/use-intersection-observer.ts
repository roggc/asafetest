import { useEffect, RefObject } from "react";

interface UseIntersectionObserverProps {
  target: RefObject<Element | null>;
  onIntersect: () => void;
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
  status: string;
}

export function useIntersectionObserver({
  target,
  onIntersect,
  threshold = 0.1,
  rootMargin = "0px",
  enabled = true,
  status,
}: UseIntersectionObserverProps) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onIntersect();
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    const element = target && target.current;
    if (!element) {
      return;
    }

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [target, onIntersect, threshold, rootMargin, enabled, status]);
}
