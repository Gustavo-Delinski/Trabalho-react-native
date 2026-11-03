import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { getErrorMessage } from '../utils/errors';

// Hook genérico com os três estados explícitos (RF09): loading / error / data.
// Cancela a requisição no cleanup e ignora respostas após desmontar (sem setState em tela desmontada).
export default function useFetch(fetcher, deps = []) {
  const [state, setState] = useState({ status: 'loading', data: null, error: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    // O estado de carregamento acompanha uma nova requisição, não um valor derivado de props.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState((prev) => ({ ...prev, status: 'loading', error: null }));

    fetcher(controller.signal)
      .then((data) => {
        if (active) setState({ status: 'data', data, error: null });
      })
      .catch((err) => {
        if (!active || axios.isCancel(err)) return;
        setState({ status: 'error', data: null, error: getErrorMessage(err) });
      });

    return () => {
      active = false;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  return { ...state, retry };
}
