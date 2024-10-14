import { useEffect, RefObject } from 'react';

interface UseIntersectionObserverProps {
  callback: (entries: IntersectionObserverEntry[]) => void;
  options?: IntersectionObserverInit;
}

const useIntersectionObserver = (
  ref: RefObject<HTMLDivElement>,
  { callback, options }: UseIntersectionObserverProps
) => {
  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const observer = new IntersectionObserver(callback, options);

    observer.observe(ref.current);

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, callback, options]);
};

export default useIntersectionObserver;
