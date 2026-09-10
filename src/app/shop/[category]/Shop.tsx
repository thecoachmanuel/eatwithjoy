'use client';

import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useParams} from 'next/navigation';

import {hooks} from '@/hooks';
import {items} from '@/items';
import {svg} from '@/assets/svg';
import {DishType} from '@/types';
import {constants} from '@/constants';
import {components} from '@/components';

export const Shop: React.FC = () => {
  const params = useParams();
  const category = params.category
    ? decodeURIComponent(params.category as string)
    : 'all';
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const {dishes: data, loading} = hooks.useGetDishes();

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () =>
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    setIsMobile(check());
  }, []);

  const marginTop = constants.sizes.headerHeight + 50 + 10;

  const filteredDishes = useMemo(() => {
    if (!data) return [];

    let filtered = data;

    if (category === 'popular') {
      filtered = data.filter((dish: DishType) => dish.isPopular);
    } else if (category === 'recommended') {
      filtered = data.filter((dish: DishType) => dish.isRecommended);
    } else if (category === 'all' || !category) {
      filtered = data;
    } else {
      filtered = data.filter(
        (dish: DishType) =>
          dish.category?.toLowerCase() === category.toString().toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      return filtered.filter(
        (dish: DishType) =>
          dish.name.toLowerCase().includes(q) ||
          dish.description?.toLowerCase().includes(q) ||
          dish.category?.toLowerCase().includes(q) ||
          dish.ingredients?.some((ing: string) => ing.toLowerCase().includes(q))
      );
    }

    return filtered;
  }, [data, searchQuery, category]);

  if (loading) return <components.Loader />;

  const renderHeader = () => {
    return (
      <components.Header showGoBack={true} showBasket={true} title="Shop" />
    );
  };

  const renderSearch = () => {
    return (
      <div
        style={{
          backgroundColor: constants.colors.whiteColor,
          width: '100%',
          borderRadius: 10,
          display: 'flex',
          alignItems: 'center',
          height: 50,
          paddingLeft: 16,
          paddingRight: 16,
          position: 'fixed',
          top: constants.sizes.headerHeight + 10,
          zIndex: 10000,
          left: '50%',
          transform: 'translateX(-50%)',
          maxWidth: isMobile
            ? 'calc(100% - 40px)'
            : constants.sizes.screenWidth - 40,
          boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)',
          border: '1px solid #ECECEC',
        }}
      >
        <div
          style={{
            marginRight: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <svg.SearchSvg color="#7D849A" />
        </div>
        <input
          ref={searchInputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search dishes by name or ingredients..."
          style={{
            border: 'none',
            outline: 'none',
            backgroundColor: 'transparent',
            width: '100%',
            height: '100%',
            fontSize: 14,
            fontFamily: 'Mulish, sans-serif',
            color: constants.colors.mainDarkColor,
          }}
        />
        {searchQuery && (
          <button
            type="button"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 6,
              marginLeft: 6,
              flexShrink: 0,
            }}
            onClick={() => {
              setSearchQuery('');
              searchInputRef.current?.focus();
            }}
            aria-label="Clear search"
          >
            <svg.CrossSvg />
          </button>
        )}
      </div>
    );
  };

  const renderDishes = () => {
    if (!filteredDishes || filteredDishes.length === 0) {
      return null;
    }
    return (
      <main
        style={{
          padding: 20,
          marginTop: marginTop,
          overflowY: 'auto',
          height: '100%',
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 15,
          }}
        >
          {filteredDishes.map((dish: DishType) => {
            return <items.ShopItem key={dish.id} dish={dish} />;
          })}
        </div>
      </main>
    );
  };

  const renderIfEmpty = () => {
    if (filteredDishes.length > 0) {
      return null;
    }
    return (
      <main
        style={{
          marginTop: marginTop,
          width: '100%',
          height: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
          textAlign: 'center',
        }}
      >
        <div style={{marginBottom: 16}}>
          <svg.SearchSvg color="#C0C5D2" />
        </div>
        <h4 style={{...constants.typography.h4, marginBottom: 8}}>
          No dishes found
        </h4>
        <p
          style={{
            fontSize: 14,
            color: constants.colors.textColor,
            maxWidth: 280,
            lineHeight: 1.5,
          }}
        >
          {searchQuery.trim()
            ? `We couldn't find any dishes matching "${searchQuery}". Try searching with another ingredient or keyword.`
            : 'No dishes are available in this category at the moment.'}
        </p>
      </main>
    );
  };

  return (
    <components.MotionWrapper>
      <components.SafeAreaView>
        {renderHeader()}
        {renderSearch()}

        {renderDishes()}
        {renderIfEmpty()}
      </components.SafeAreaView>
    </components.MotionWrapper>
  );
};
