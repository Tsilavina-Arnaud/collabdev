"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { updateInvoiceStatusAction } from "@/lib/actions/invoices";

export function InvoiceStatusToggle({
  id,
  status,
}: {
  id: number;
  status: string;
}) {
  const [pending, setPending] = useState(false);
  const router = useRouter();

  if (status === "ANNULEE") {
    return (
      <Button
        variant="outline"
        disabled={pending}
        onClick={async () => {
          setPending(true);
          await updateInvoiceStatusAction(id, "EN_ATTENTE");
          router.refresh();
          setPending(false);
        }}
      >
        {pending ? <Loader2 className="animate-spin" /> : <RotateCcw />}
        Rétablir
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      disabled={pending}
      onClick={async () => {
        setPending(true);
        await updateInvoiceStatusAction(id, status === "PAYEE" ? "EN_ATTENTE" : "PAYEE");
        router.refresh();
        setPending(false);
      }}
    >
      {pending ? <Loader2 className="animate-spin" /> : null}
      {status === "PAYEE" ? "Marquer en attente" : "Marquer payée"}
    </Button>
  );
}
