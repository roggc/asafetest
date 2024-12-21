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
import { CryptoSelect } from "@/app/ui/crypto-select";
import { fetchCryptoData, fetchCryptoList } from "@/app/utils/data";
import { formatDate } from "@/app/utils/date";

export default function Dashboard() {
  const [selectedCrypto, setSelectedCrypto] = useState({
    id: "bitcoin",
    name: "Bitcoin",
  });
  const [chartData, setChartData] = useState([]);
  const [cryptoList, setCryptoList] = useState<{ id: string; name: string }[]>(
    []
  );

  useEffect(() => {
    fetchCryptoList().then(setCryptoList);
  }, []);

  useEffect(() => {
    if (selectedCrypto) {
      fetchCryptoData(selectedCrypto.id).then(setChartData);
    }
  }, [selectedCrypto]);

  const handleCryptoChange = (value: string) => {
    const selected = cryptoList.find((crypto) => crypto.id === value);
    if (selected) {
      setSelectedCrypto(selected);
    }
  };

  return (
    <div className="flex flex-col bg-gray-100 p-6 w-full h-full">
      <h1 className="text-3xl font-bold mb-6">Crypto Dashboard</h1>
      <div className="w-full max-w-xs mb-6">
        <CryptoSelect
          cryptoList={cryptoList}
          selectedCrypto={selectedCrypto}
          onSelectCrypto={handleCryptoChange}
          onLoadMore={(page) =>
            fetchCryptoList(page).then((newCryptos) =>
              setCryptoList((prev) => [...prev, ...newCryptos])
            )
          }
        />
      </div>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Precio de {selectedCrypto.name}</CardTitle>
          <CardDescription>Últimos 30 días</CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  );
}
