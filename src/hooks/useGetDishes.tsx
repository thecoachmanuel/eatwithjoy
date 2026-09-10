'use client';

import axios from 'axios';
import {useState, useEffect} from 'react';

import {URLS} from '@/config';
import {NIGERIAN_DISHES} from '@/data/nigerianDishes';

export const useGetDishes = () => {
  const [dishes, setDishes] = useState<any[]>(NIGERIAN_DISHES);
  const [loading, setLoading] = useState(false);

  const getDishes = async () => {
    try {
      const response = await axios.get(URLS.GET_DISHES);
      if (response.data) {
        const data = response.data.dishes || response.data || [];
        if (data.length > 0) {
          setDishes(data);
        }
      }
    } catch (error) {
      console.warn('Using local Nigerian dishes data:', error);
      setDishes(NIGERIAN_DISHES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDishes();
  }, []);

  return {dishes, loading};
};

