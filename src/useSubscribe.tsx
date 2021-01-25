import { useEffect, useState } from 'react';
import { useFormContext } from '.';
import { FormProp } from './types';

export const useSubscribe = () => {
  const [state, setState] = useState<FormProp>({
    values: {},
    errors: {},
    previousErrors: {},
    previousValues: {},
  });
  const { subscribe } = useFormContext();
  useEffect(() => {
    subscribe((formProp) => setState(formProp));
  }, []);
  return state;
};
