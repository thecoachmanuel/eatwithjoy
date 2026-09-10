'use client';

import axios from 'axios';
import {useState, useEffect} from 'react';

import {URLS} from '@/config';
import {DishType} from '@/types';
import {NIGERIAN_DISHES} from '@/data/nigerianDishes';

export const useGetDish = (id: number) => {
  const initialDish =
    NIGERIAN_DISHES.find((d: DishType) => d.id === id) || null;
  const [dish, setDish] = useState<DishType | null>(initialDish);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getDish = async () => {
    try {
      const response = await axios.get(URLS.GET_DISHES);
      if (response.data) {
        const dishes: DishType[] = response.data.dishes ?? response.data;
        const foundDish = dishes.find((d: DishType) => d.id === id);
        if (foundDish) {
          setDish(foundDish);
          return foundDish;
        }
      }
    } catch (error) {
      console.warn('Using local dish fallback:', error);
      const fallbackDish =
        NIGERIAN_DISHES.find((d: DishType) => d.id === id) || null;
      setDish(fallbackDish);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getDish();
  }, [id]);

  return {
    dish,
    isLoading,
  };
};

