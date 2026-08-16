"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { updateFollowUpStatusAction } from "@/lib/actions/requests";

export function FollowUpStatusToggle({
  id,
  status,
  next,
  label,
}: {
  id: number;
  status: string;
  next: string;
  label: string;
}) {
  const [pending, setPending] = useState(false);
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      size="xs"
      disabled={pending}
      onClick={async () => {
        setPending(true);
        await updateFollowUpStatusAction(id, next);
        router.refresh();
        setPending(false);
      }}
    >
      {pending ? (
        <Loader2 className="animate-spin" />
      ) : status === "TERMINE" ? (
        <Check />
      ) : (
        <Check />
      )}
      {label}
    </Button>
  );
}
