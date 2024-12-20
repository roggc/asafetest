"use client";

import React, { useState, useRef, useCallback } from "react";
import { useIntersectionObserver } from "./use-intersection-observer";
import { Crypto } from "../types/crypto";
import { CryptoCard } from "../ui/crypto-card";

export default function InfiniteScroll() {
  const [items, setItems] = useState<Crypto[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const loader = useRef(null);

  const loadMoreItems = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/fetchItems?page=${page}`);
      if (!response.ok) {
        throw new Error("Error fetching data from Coingecko API");
      }
      const newItems: Crypto[] = await response.json();
      setItems((prevItems) => [...prevItems, ...newItems]);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [items.length, loading]);

  useIntersectionObserver({
    target: loader,
    onIntersect: loadMoreItems,
    enabled: !loading,
  });

  return (
    <div className="container mx-auto">
      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item.id} className="flex justify-center">
            <CryptoCard
              name={item.name}
              image={item.image}
              symbol={item.symbol}
              currentPrice={item.current_price}
            />
          </li>
        ))}
      </ul>
      <div ref={loader} className="h-10 flex items-center justify-center">
        {loading && <p>Loading more elements...</p>}
      </div>
    </div>
  );
}