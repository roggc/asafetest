import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gauge, List, LogIn } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession(authOptions);
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            CryptoTracker Pro
          </CardTitle>
          <CardDescription className="text-center">
            Your cryptocurrency tracking platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-muted-foreground">
            Welcome to CryptoTracker Pro, the ultimate app to keep you
            up-to-date with the world of cryptocurrencies.
          </p>

          <div className="bg-muted p-4 rounded-lg">
            <h2 className="font-semibold mb-2">Access credentials:</h2>
            <p>
              <strong>User:</strong> john@example.com
            </p>
            <p>
              <strong>Password:</strong> password123
            </p>
          </div>

          <div>
            <h2 className="font-semibold mb-2">Main features:</h2>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Gauge className="mr-2 h-5 w-5 text-primary" />
                Dashboard with interactive charts
              </li>
              <li className="flex items-center">
                <List className="mr-2 h-5 w-5 text-primary" />
                Complete list of cryptocurrencies
              </li>
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          {session ? (
            <p className="text-center w-full">Welcome, {session.user?.name}!</p>
          ) : (
            <Link href={"/signin"} className={`${buttonVariants({})} w-full`}>
              <LogIn className="mr-2 h-5 w-5" /> Sign in
            </Link>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
