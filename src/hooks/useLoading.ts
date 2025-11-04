import React, { useState, useCallback, useRef, useEffect } from 'react';

interface UseLoadingReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
}

export function useLoading<T = any>(
  asyncFunction: (...args: any[]) => Promise<{ success: boolean; data?: T; error?: string }>
): UseLoadingReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Usar useRef para manter referência estável da função
  const asyncFunctionRef = useRef(asyncFunction);
  
  // Atualizar ref sempre que a função mudar
  useEffect(() => {
    asyncFunctionRef.current = asyncFunction;
  }, [asyncFunction]);

  const execute = useCallback(async (...args: any[]): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await asyncFunctionRef.current(...args);
      
      if (result.success && result.data) {
        setData(result.data);
        return result.data;
      } else {
        setError(result.error || 'Erro desconhecido');
        return null;
      }
    } catch (err: any) {
      setError(err.message || 'Erro na execução');
      return null;
    } finally {
      setLoading(false);
    }
  }, []); // Sem dependência da função

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, execute, reset };
}