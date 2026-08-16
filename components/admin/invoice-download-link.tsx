"use client";

import { useState } from "react";
import { Check, Copy, FileDown, Link2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ensureInvoiceDownloadTokenAction } from "@/lib/actions/invoices";

export function InvoiceDownloadLink({
  invoiceId,
  reference,
  token,
}: {
  invoiceId: number;
  reference: string;
  token: string | null;
}) {
  const [pending, setPending] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!token) {
    return (
      <form
        action={async () => {
          setPending(true);
          await ensureInvoiceDownloadTokenAction(invoiceId);
          setPending(false);
        }}
      >
        <Button type="submit" variant="outline" size="sm" disabled={pending}>
          {pending ? <Loader2 className="animate-spin" /> : <Link2 />}
          Générer le lien client
        </Button>
      </form>
    );
  }

  const url = `${window.location.origin}/factures/${encodeURIComponent(reference)}?token=${encodeURIComponent(token)}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copier le lien :", url);
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Lien de téléchargement pour le client. À partager par e-mail, le client
        peut télécharger sa facture sans compte.
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <code className="max-w-full flex-1 truncate rounded-md bg-muted px-2 py-1 text-xs">
          {url}
        </code>
        <Button type="button" variant="outline" size="sm" onClick={copy}>
          {copied ? <Check /> : <Copy />}
          {copied ? "Copié" : "Copier"}
        </Button>
      </div>
      <Button
        nativeButton={false}
        render={<a href={url} target="_blank" rel="noreferrer" />}
        variant="default"
        size="sm"
      >
        <FileDown />
        Télécharger en tant que client
      </Button>
    </div>
  );
}
