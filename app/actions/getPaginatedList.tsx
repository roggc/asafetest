"use server";

import { List } from "@/app/ui/list";
import MyError from "@/app/my-error";
import { Crypto } from "@/app/types/crypto";
import { PER_PAGE } from "@/app/constants/api";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    "x-cg-demo-api-key": process.env.COINGECKO_API_KEY ?? "",
  },
};

export async function getPaginatedList({ page }: { page: number }) {
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${PER_PAGE}&page=${page}&sparkline=false`;
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    console.log("hey", data[0].name);
    return (
      <List
        items={data.map(
          ({ id, symbol, name, image, current_price }: Crypto) => ({
            id,
            symbol,
            name,
            image,
            current_price,
          })
        )}
      />
    );
  } catch (error: any) {
    return <MyError errorMessage={error.message} />;
  }
}
