import { useState } from 'react';

export interface ApiHandlerReturnType<T> {
  error: string | null;
  data: T | null;
  loading: boolean;
}

export function useApiHandler<T>(
  apiCall: any
): [(...data: any[]) => Promise<T>, ApiHandlerReturnType<T>] {
  const [reqState, setReqState] = useState<ApiHandlerReturnType<T>>({
    error: null,
    data: null,
    loading: false,
  });

  const handler = async (...data: any[]) => {
    setReqState({ error: null, data: null, loading: true });
    try {
      const json = await apiCall(...data);
      setReqState({ error: null, data: json.data, loading: false });
      return json.json();
    } catch (e: any) {
      const message =
        (e.response && e.response.data) || 'Ooops, something went wrong...';
      setReqState({ error: message, data: null, loading: false });
      return Promise.reject(message);
    }
  };

  return [handler, { ...reqState }];
}
