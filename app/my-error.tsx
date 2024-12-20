"use client";

export default function MyError({
  errorMessage,
}: Readonly<{ errorMessage: string }>) {
  return (
    <div>
      <h2>Error</h2>
      <p>{errorMessage}</p>
    </div>
  );
}
