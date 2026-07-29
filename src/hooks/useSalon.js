import { useState, useEffect, useCallback } from 'react';
import * as salonService from '../services/salonService';

export function useSalon(salonId) {
  const [salon, setSalon] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(salonId));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!salonId) return;
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    salonService
      .getSalonById(salonId)
      .then((data) => {
        if (isMounted) setSalon(data);
      })
      .catch((err) => {
        if (isMounted) setError(err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [salonId]);

  return { salon, isLoading, error };
}

export function useSalonList() {
  const [salons, setSalons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSalons = useCallback(() => {
    setIsLoading(true);
    setError(null);
    return salonService
      .getSalons()
      .then(setSalons)
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    fetchSalons();
  }, [fetchSalons]);

  const search = useCallback((query) => {
    setIsLoading(true);
    return salonService
      .searchSalons(query)
      .then(setSalons)
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, []);

  return { salons, isLoading, error, refetch: fetchSalons, search };
}
