"use client";

import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function HandleSession() {
  const { status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return (
      <Link href={"/signin"} className={buttonVariants({ variant: "outline" })}>
        Sign in
      </Link>
    );
  }

  return (
    <Button variant="outline" onClick={() => signOut({ callbackUrl: "/" })}>
      Log out
    </Button>
  );
}
