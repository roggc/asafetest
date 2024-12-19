"use client";

import FormCard from "@/app/signin/card";
import { useState } from "react";

export default function SignInPage() {
  const [error, setError] = useState(false);

  return (
    <div className="flex flex-1 flex-col items-center justify-center h-full">
      <FormCard setError={setError} />
      {error && <p className="text-red-500 mt-2">Invalid credentials</p>}
    </div>
  );
}
