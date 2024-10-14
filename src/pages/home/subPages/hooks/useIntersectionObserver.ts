import { useEffect, RefObject } from 'react';

const useIntersectionObserver = (
  ref: RefObject<HTMLDivElement>,
  fetchNextPage: () => void
) => {
  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(ref.current);

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, fetchNextPage]);
};

export default useIntersectionObserver;
