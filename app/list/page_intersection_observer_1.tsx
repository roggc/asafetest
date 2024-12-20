"use client";

import { useState, useRef, useEffect } from "react";
import { Crypto } from "@/app/types/crypto";
import { useAtomValue } from "../atoms";

export default function Page() {
  const [items, setItems] = useState<Crypto[]>([]);
  const [page, setPage] = useState(1);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const main = useAtomValue("main");
  const count = useAtomValue("count");
  const containerRef = useRef<HTMLDivElement | null>(null);

  console.log("main", main, "count", count);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`/api/fetchItems?page=${page}`);
        if (!response.ok) {
          throw new Error("Error fetching data from Coingecko API");
        }
        const newItems: Crypto[] = await response.json();
        setItems((prevItems) => [...prevItems, ...newItems]);
      } catch (error) {
        console.error(error);
      }
    };

    fetchItems();
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      {
        threshold: 1.0,
        root: containerRef.current,
        rootMargin: "0px",
      }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, []);

  return (
    <div
      className="flex flex-col items-center flex-1 overflow-auto"
      ref={containerRef}
    >
      {items.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
      <div ref={loaderRef}>Loading more items...</div>
    </div>
  );
}
