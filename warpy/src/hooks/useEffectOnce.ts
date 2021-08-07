import {useRef, useEffect} from 'react';

export const useEffectOnce = (func: any) => {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) {
      return;
    }

    func();

    fired.current = true;
  }, [func]);
};
