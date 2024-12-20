// "use client";

import { CryptoList } from "@/app/types/crypto";

let accItems: CryptoList = [];

export const List = ({ items }: Readonly<{ items: CryptoList }>) => {
  accItems = [...accItems, ...items];
  return accItems.map((item) => <li key={item.id}>{item.name}</li>);
};
