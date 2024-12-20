"use client";

import { useState, useRef, useEffect } from "react";
import Action from "@/app/action";
import { getPaginatedList } from "@/app/actions/getPaginatedList";
// import { List } from "../ui/list";

export default function Home() {
  const [page, setPage] = useState(1);
  const loaderRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, []);

  return (
    <div>
      <ul>
        <Action action={getPaginatedList} page={page} />
      </ul>
      <div ref={loaderRef}>Loading more elements...</div>
    </div>
  );
}
