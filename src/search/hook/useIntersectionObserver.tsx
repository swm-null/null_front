import { useInView } from 'react-intersection-observer';

export const useIntersectionObserver = (onInView: () => void) => {
  const { ref } = useInView({
    onChange: (inView) => {
      if (inView) {
        onInView();
      }
    },
  });

  return ref;
};
