// app/api/fetchItems/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PER_PAGE } from "@/app/constants/api";
import { options } from "@/app/utils/api";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || "1";
  const perPage = searchParams.get("perPage") || PER_PAGE;
  const cryptoId = searchParams.get("cryptoId") ?? "";
  const action = searchParams.get("action");
  const url =
    action === "list"
      ? `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=false`
      : action === "data"
      ? `https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart?vs_currency=usd&days=30&interval=daily`
      : "";

  try {
    if (!url) {
      throw new Error("Invalid action");
    }
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
