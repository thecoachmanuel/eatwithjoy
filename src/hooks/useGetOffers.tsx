'use client';

import axios from 'axios';
import {useState, useEffect} from 'react';

import {URLS} from '@/config';
import {NIGERIAN_OFFERS} from '@/data/nigerianDishes';

export const useGetOffers = () => {
  const [offers, setOffers] = useState<any[]>(NIGERIAN_OFFERS);
  const [loading, setLoading] = useState(false);

  const getOffers = async () => {
    try {
      const response = await axios.get(URLS.GET_OFFERS);
      if (response.data) {
        const data = response.data.offers || response.data || [];
        if (data.length > 0) {
          setOffers(data);
        }
      }
    } catch (error) {
      console.warn('Using local Nigerian offers fallback:', error);
      setOffers(NIGERIAN_OFFERS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOffers();
  }, []);

  return {offers, loading};
};

