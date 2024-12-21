"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CryptoSelect } from "@/app/ui/crypto-select-2";
import { fetchCryptoData, fetchCryptoList } from "@/app/utils/data";
import { formatDate } from "@/app/utils/date";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Dashboard() {
  const [selectedCrypto, setSelectedCrypto] = useState({
    id: "bitcoin",
    name: "Bitcoin",
  });
  const [chartData, setChartData] = useState([]);
  const [cryptoList, setCryptoList] = useState<{ id: string; name: string }[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { status } = useSession();

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        const [initialCryptoList, initialChartData] = await Promise.all([
          fetchCryptoList(),
          fetchCryptoData("bitcoin"),
        ]);
        setCryptoList(initialCryptoList);
        // console.log(initialCryptoList);
        setChartData(initialChartData);
      } catch (err) {
        setError("Failed to load initial data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const handleCryptoChange = async (value: string) => {
    const selected = cryptoList.find((crypto) => crypto.id === value);
    if (selected) {
      setSelectedCrypto(selected);
      try {
        setIsLoading(true);
        const data = await fetchCryptoData(selected.id);
        setChartData(data);
      } catch (err) {
        setError(`Failed to load data for ${selected.name}. Please try again.`);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleLoadMore = async (page: number) => {
    try {
      const newCryptos = await fetchCryptoList(page);
      //   console.log(newCryptos);
      if (!Array.isArray(newCryptos)) {
        throw new Error("La lista de nuevas criptomonedas no es un array.");
      }
      setCryptoList((prev) => [...prev, ...newCryptos]);
    } catch (err) {
      console.error("Failed to load more cryptocurrencies:", err);
    }
  };

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">{error}</div>
    );
  }

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    redirect("/");
  }

  return (
    <div className="flex flex-col w-full h-full bg-gray-100 p-6 rounded-lg">
      <div className="w-full max-w-xs mb-6">
        <CryptoSelect
          cryptoList={cryptoList}
          selectedCrypto={selectedCrypto}
          onSelectCrypto={handleCryptoChange}
          onLoadMore={handleLoadMore}
        />
      </div>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Price of {selectedCrypto.name}</CardTitle>
          <CardDescription>Last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-[400px] flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => formatDate(value)}
                  />
                  <YAxis />
                  <Tooltip labelFormatter={(value) => formatDate(value)} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
