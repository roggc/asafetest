"use client";

import React, { useState, useRef, useCallback } from "react";
import { useIntersectionObserver } from "./use-intersection-observer";
import { Crypto } from "@/app/types/crypto";
import { CryptoCard } from "@/app/ui/crypto-card";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function InfiniteScroll() {
  const [items, setItems] = useState<Crypto[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const loader = useRef(null);
  const { status } = useSession();

  const loadMoreItems = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await fetch(
        `/api/fetchCrypto?page=${page}&perPage=5&action=list`
      );
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

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    redirect("/");
  }

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
