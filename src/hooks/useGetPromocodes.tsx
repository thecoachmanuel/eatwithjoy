'use client';

import axios from 'axios';
import {useState, useEffect} from 'react';

import {URLS} from '@/config';
import {NIGERIAN_PROMOCODES} from '@/data/nigerianDishes';

export const useGetPromocodes = () => {
  const [promocodes, setPromocodes] = useState<any[]>(NIGERIAN_PROMOCODES);
  const [loading, setLoading] = useState(false);

  const getPromocodes = async () => {
    try {
      const response = await axios.get(URLS.GET_PROMOCODES);
      if (response.data) {
        const data = response.data.promocodes || response.data || [];
        if (data.length > 0) {
          setPromocodes(data);
        }
      }
    } catch (error) {
      console.warn('Using local Nigerian promocodes fallback:', error);
      setPromocodes(NIGERIAN_PROMOCODES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPromocodes();
  }, []);

  return {promocodes, loading};
};

