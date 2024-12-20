import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CryptoCardProps {
  name: string;
  image: string;
  symbol: string;
  currentPrice: number;
}

export function CryptoCard({
  name,
  image,
  symbol,
  currentPrice,
}: CryptoCardProps) {
  return (
    <Card className="w-[300px]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">{name}</CardTitle>
        <div className="rounded-full overflow-hidden">
          <Image src={image} alt={`${name} logo`} width={40} height={40} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="text-sm font-medium text-muted-foreground">
            {symbol.toUpperCase()}
          </div>
          <div className="text-2xl font-bold">
            $
            {currentPrice.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
