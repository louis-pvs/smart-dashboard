"use client";

import { useRouter } from "next/navigation";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardDescription,
  CardTitle,
} from "@repo/ui/components/card";
import { Heading } from "@repo/ui/components/heading";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  return (
    <section className="flex flex-1 items-center justify-center flex-col gap-4">
      <Card className="p-6 border-non w-full max-w-md">
        <CardTitle>
          <Heading>Something wen&apos;t wrong on our end</Heading>
        </CardTitle>
        <CardDescription>{error.message}</CardDescription>
      </Card>
      <Button onClick={reset}>
        Try Again
      </Button>
      <Button variant="outline" onClick={() => router.back()}>
        Back to previous page
      </Button>
    </section>
  );
}
