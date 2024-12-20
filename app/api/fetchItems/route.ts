// app/api/fetchItems/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PER_PAGE } from "@/app/constants/api";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    "x-cg-demo-api-key": process.env.COINGECKO_API_KEY ?? "",
  },
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || "1";
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${PER_PAGE}&page=${page}&sparkline=false`;

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error("Error fetching data from Coingecko API");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
