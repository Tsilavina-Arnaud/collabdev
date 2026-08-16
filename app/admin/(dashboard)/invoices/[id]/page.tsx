import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Banknote,
  CheckCircle2,
  CircleDollarSign,
  FileDown,
} from "lucide-react";

import { DeleteButton } from "@/components/admin/delete-button";
import { InvoiceDownloadLink } from "@/components/admin/invoice-download-link";
import { PaymentForm } from "@/components/admin/payment-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/format";
import {
  deleteInvoiceAction,
  updateInvoiceStatusAction,
} from "@/lib/actions/invoices";
import { InvoiceStatusToggle } from "@/components/admin/invoice-status-toggle";

const methodLabel: Record<string, string> = {
  CARTE_BANCAIRE: "Carte bancaire",
  VIREMENT: "Virement",
  ESPECES: "Espèces",
};

const planLabel: Record<string, string> = {
  PAIEMENT_COMPLET: "Paiement complet",
  PAIEMENT_2_FOIS: "Paiement en 2 fois",
  PAIEMENT_3_FOIS: "Paiement en 3 fois",
};

export const metadata = { title: "Facture" };

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const invoice = await prisma.invoice.findUnique({
    where: { id: Number(id) },
    include: {
      client: true,
      items: { include: { service: true } },
      payments: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!invoice) notFound();

  const company = await prisma.companyInfo.findFirst();

  const typeLabel =
    invoice.type === "PROFORMA" ? "FACTURE PROFORMA" : "FACTURE ACQUITTÉE";
  const paid = invoice.status === "PAYEE";
  const totalPaid = invoice.payments.reduce(
    (sum, p) => sum + Number(p.amountPaid),
    0,
  );
  const remaining = Math.max(Number(invoice.totalAmount) - totalPaid, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button
              nativeButton={false} render={<Link href="/admin/invoices" />} variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
          <div>
            <h1 className="text-2xl font-medium tracking-tight">
              {invoice.reference}
            </h1>
            <p className="text-sm text-muted-foreground">
              {typeLabel} du {formatDate(invoice.date)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href={`/admin/invoices/${invoice.id}/pdf`} />}
          >
            <FileDown />
            Télécharger PDF
          </Button>
          <InvoiceStatusToggle
            id={invoice.id}
            status={invoice.status}
          />
          <DeleteButton
            description={`Supprimer la facture ${invoice.reference} ?`}
            action={async () => {
              "use server";
              await deleteInvoiceAction(invoice.id);
            }}
            redirectTo="/admin/invoices"
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="space-y-6 py-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">
                  Émise par
                </p>
                <p className="font-medium">
                  {(company?.representative || company?.name) ?? "collab·dev"}
                </p>
                {company?.name ? (
                  <p className="text-sm text-muted-foreground">
                    Au nom du collectif {company.name}
                  </p>
                ) : null}
                {company?.representativeRole ? (
                  <p className="text-sm text-muted-foreground">
                    {company.representativeRole}
                  </p>
                ) : null}
                {company?.email ? (
                  <p className="text-sm text-muted-foreground">{company.email}</p>
                ) : null}
                {company?.address ? (
                  <p className="whitespace-pre-line text-sm text-muted-foreground">
                    {company.address}
                  </p>
                ) : null}
                {company?.iban ? (
                  <p className="text-sm text-muted-foreground">IBAN {company.iban}</p>
                ) : null}
                {company?.bic ? (
                  <p className="text-sm text-muted-foreground">BIC {company.bic}</p>
                ) : null}
              </div>
              <div>
                <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">
                  Facturée à
                </p>
                <p className="font-medium">{invoice.client.name}</p>
                {invoice.client.company ? (
                  <p className="text-sm text-muted-foreground">
                    {invoice.client.company}
                  </p>
                ) : null}
                <p className="text-sm text-muted-foreground">
                  {invoice.client.email}
                </p>
                <p className="text-sm text-muted-foreground">
                  {invoice.client.phone}
                </p>
                {invoice.client.address ? (
                  <p className="whitespace-pre-line text-sm text-muted-foreground">
                    {invoice.client.address}
                  </p>
                ) : null}
              </div>
            </div>

            <div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead className="text-right">Quantité</TableHead>
                    <TableHead className="text-right">Prix unitaire</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoice.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        {item.label}
                        {item.free ? (
                          <Badge variant="outline" className="ml-2">
                            Offert
                          </Badge>
                        ) : null}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.free ? "Offert" : formatCurrency(item.unitPrice)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {item.free ? "Offert" : formatCurrency(item.total)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-medium">
                      {paid ? "TOTAL PAYÉ" : "TOTAL À PAYER"} :
                    </TableCell>
                    <TableCell className="text-right text-lg font-semibold">
                      {formatCurrency(invoice.totalAmount)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">STATUT :</p>
              <Badge variant={paid ? "default" : "secondary"}>
                {paid ? "PAYÉE" : invoice.status === "ANNULEE" ? "ANNULÉE" : "EN ATTENTE"}
              </Badge>
            </div>

            {invoice.note ? (
              <div className="rounded-lg border border-border p-3 text-sm">
                <p className="mb-1 text-xs font-medium text-muted-foreground">
                  Note
                </p>
                <p className="whitespace-pre-wrap">{invoice.note}</p>
              </div>
            ) : null}

            <div className="border-t border-border pt-4 text-sm text-muted-foreground">
              <p>{company?.email}</p>
              <p>{company?.phone}</p>
              <p>{company?.website}</p>
              <p className="mt-2 font-medium text-foreground">
                Merci pour votre confiance. {company?.name ?? "collab·dev"}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Lien client</CardTitle>
              <CardDescription>
                Téléchargement de la facture accessible au client sans compte.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InvoiceDownloadLink
                invoiceId={invoice.id}
                reference={invoice.reference}
                token={invoice.downloadToken}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Paiements</CardTitle>
              <CardDescription>
                Paiements enregistrés sur cette facture.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg border border-border p-3">
                  <p className="text-muted-foreground">Payé</p>
                  <p className="text-lg font-medium">
                    {formatCurrency(totalPaid)}
                  </p>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <p className="text-muted-foreground">Reste</p>
                  <p className="text-lg font-medium">
                    {formatCurrency(remaining)}
                  </p>
                </div>
              </div>

              {invoice.payments.length > 0 ? (
                <div className="space-y-2">
                  {invoice.payments.map((p) => (
                    <div
                      key={p.id}
                      className="rounded-lg border border-border p-3 text-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">
                          {formatCurrency(p.amountPaid)}
                        </span>
                        <Badge variant="outline">{methodLabel[p.method]}</Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {planLabel[p.plan]} - paiement {p.currentNumber}/
                        {p.totalInstallments}
                      </p>
                      {p.paymentDate ? (
                        <p className="text-xs text-muted-foreground">
                          Reçu le {formatDate(p.paymentDate)}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="flex items-center gap-2 rounded-lg border border-dashed border-border p-3 text-sm text-muted-foreground">
                  <CircleDollarSign className="size-4" />
                  Aucun paiement enregistré.
                </p>
              )}

              {!paid && invoice.status !== "ANNULEE" ? (
                <PaymentForm invoiceId={invoice.id} remaining={remaining} total={Number(invoice.totalAmount)} />
              ) : null}
            </CardContent>
          </Card>

          {!paid && invoice.status !== "ANNULEE" ? (
            <Card>
              <CardHeader>
                <CardTitle>Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <form
                  action={async () => {
                    "use server";
                    await updateInvoiceStatusAction(invoice.id, "PAYEE");
                  }}
                >
                  <Button type="submit" variant="outline" className="w-full">
                    <CheckCircle2 />
                    Marquer comme payée
                  </Button>
                </form>
                <form
                  action={async () => {
                    "use server";
                    await updateInvoiceStatusAction(invoice.id, "ANNULEE");
                  }}
                >
                  <Button type="submit" variant="outline" className="w-full">
                    <Banknote />
                    Annuler la facture
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}
