"use client";

import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bitcoin, EclipseIcon as Ethereum, CreditCard } from "lucide-react";
import { fetchCryptoData } from "@/app/utils/data";
import { formatDate } from "@/app/utils/date";

const cryptos = [
  { id: "bitcoin", name: "Bitcoin", icon: Bitcoin },
  { id: "ethereum", name: "Ethereum", icon: Ethereum },
  { id: "cardano", name: "Cardano", icon: CreditCard },
];

export default function Dashboard() {
  const [selectedCrypto, setSelectedCrypto] = useState(cryptos[0]);
  const [chartData, setChartData] = useState([]);

  const handleCryptoChange = async (value: string) => {
    const selected =
      cryptos.find((crypto) => crypto.id === value) || cryptos[0];
    setSelectedCrypto(selected);
    const data = await fetchCryptoData(selected.id);
    setChartData(data);
  };

  return (
    <div className="flex bg-gray-100 w-full h-full">
      <aside className="w-64 bg-white p-6">
        <h2 className="text-2xl font-bold mb-6">Crypto Dashboard</h2>
        <nav>
          {cryptos.map((crypto) => (
            <button
              key={crypto.id}
              className={`flex items-center w-full p-2 rounded ${
                selectedCrypto.id === crypto.id
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-600"
              }`}
              onClick={() => handleCryptoChange(crypto.id)}
            >
              <crypto.icon className="mr-2" />
              {crypto.name}
            </button>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-6">
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
      </main>
    </div>
  );
}
