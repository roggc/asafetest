// app/api/fetchItems/route.ts
import { NextRequest, NextResponse } from "next/server";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    "x-cg-demo-api-key": process.env.COINGECKO_API_KEY ?? "",
  },
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cryptoId = searchParams.get("cryptoId") ?? "";
  const url = `https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart?vs_currency=usd&days=30&interval=daily`;

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
