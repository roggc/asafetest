// "use client";

import ThemeSwitcher from "@/app/ui/theme-switcher";
import HandleSession from "@/app/ui/handle-session";
import Link from "next/link";
import { Bitcoin } from "lucide-react";
// import { useEffect, useRef } from "react";
// import { useSetAtom } from "@/app/atoms";

export default function MyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const mainRef = useRef<HTMLDivElement | null>(null);
  // const setMain = useSetAtom("main");

  // useEffect(() => {
  //   if (mainRef.current) {
  //     console.log("setting main");
  //     setMain(mainRef.current);
  //   }
  // }, []);

  return (
    <div className="flex flex-col flex-1 h-screen">
      <header className="h-12 flex items-center justify-between px-4 bg-[hsl(var(--sidebar-background))] text-[hsl(var(--sidebar-foreground))] border-b border-[hsl(var(--sidebar-border))] fixed top-0 left-0 right-0 z-10">
        <Link
          href="/"
          className="flex items-center space-x-2 p-2 hover:bg-gray-300 rounded"
        >
          <Bitcoin />
          <span>CryptoTracker Pro</span>
        </Link>
        <div className="flex items-center space-x-4">
          <HandleSession />
          <ThemeSwitcher />
        </div>
      </header>
      <div className="flex flex-1  p-4 overflow-auto mt-12">{children}</div>
    </div>
  );
}
