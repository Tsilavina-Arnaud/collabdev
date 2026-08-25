import fs from "node:fs";
import path from "node:path";
import {
  Document,
  Image,
  Page,
  Text,
  View,
  renderToBuffer,
} from "@react-pdf/renderer";

import { formatCurrency, formatDate } from "@/lib/format";

function formatPdfCurrency(amount: number): string {
  return formatCurrency(amount).replace(/[\u202F\u00A0]/g, " ");
}

export type InvoicePdfClient = {
  name: string;
  company?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
};

export type InvoicePdfItem = {
  label: string;
  quantity: number;
  unitPrice: number;
  total: number;
  free: boolean;
};

export type InvoicePdfPayment = {
  method: string;
  plan: string;
  currentNumber: number;
  totalInstallments: number;
  amountPaid: number;
  remaining: number;
  paymentDate?: Date | string | null;
};

export type InvoicePdfCompany = {
  name: string;
  legalName: string;
  representative: string;
  representativeRole: string;
  legalStatus?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  taxId?: string | null;
  iban?: string | null;
  bic?: string | null;
};

export type InvoicePdfData = {
  reference: string;
  type: string;
  status: string;
  date: Date | string;
  dueDate?: Date | string | null;
  client: InvoicePdfClient;
  items: InvoicePdfItem[];
  payments: InvoicePdfPayment[];
  totalAmount: number;
  note?: string | null;
  company: InvoicePdfCompany;
  paid: boolean;
};

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

function getLogoDataUri(): string | null {
  const file = path.join(process.cwd(), "public", "images", "logo-pdf.png");
  try {
    const buffer = fs.readFileSync(file);
    return `data:image/png;base64,${buffer.toString("base64")}`;
  } catch {
    return null;
  }
}

function InvoiceDocument({ data }: { data: InvoicePdfData }) {
  const {
    reference,
    type,
    status,
    date,
    dueDate,
    client,
    items,
    payments,
    totalAmount,
    note,
    company,
    paid,
  } = data;

  const logo = getLogoDataUri();
  const title =
    type === "PROFORMA"
      ? "FACTURE PROFORMA"
      : paid
        ? "FACTURE ACQUITTÉE"
        : "FACTURE";

  const statusLabel =
    status === "PAYEE" ? "PAYÉE" : status === "ANNULEE" ? "ANNULÉE" : "EN ATTENTE";
  const statusNote =
    status === "PAYEE"
      ? payments[0]?.paymentDate
        ? `Paiement reçu le ${formatDate(payments[0].paymentDate)}`
        : "Paiement reçu."
      : status === "ANNULEE"
        ? "Facture annulée."
        : "Paiement en attente";

  const legalNote =
    type === "PROFORMA"
      ? "Cette facture proforma est émise avant confirmation du paiement."
      : paid
        ? "Cette facture atteste que le paiement a été reçu selon les informations indiquées ci-dessus."
        : "Cette facture atteste la prestation réalisée et les montants dus.";

  const totalPaid = payments.reduce((sum, p) => sum + p.amountPaid, 0);
  const remaining = Math.max(totalAmount - totalPaid, 0);

  const issuer = company.representative || company.legalName || company.name;
  const contactLine = company.email;

  const sectionTitle = {
    fontSize: 8,
    fontWeight: "bold",
    color: "#6b7280",
    marginBottom: 5,
    letterSpacing: 1,
  } as const;

  const metaRow = {
    fontSize: 9,
    color: "#374151",
    marginBottom: 2,
  } as const;

  const blockRow = {
    fontSize: 9,
    color: "#374151",
    marginBottom: 2,
  } as const;

  const row = {
    flexDirection: "row",
    paddingVertical: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e5e7eb",
  } as const;

  return (
    <Document>
      <Page size="A4" style={{ paddingHorizontal: 36, paddingTop: 36, fontFamily: "Helvetica" }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 24,
          }}
        >
          {logo ? (
            // eslint-disable-next-line jsx-a11y/alt-text
            <Image src={logo} style={{ width: 78 }} />
          ) : (
            <Text style={{ fontSize: 13, fontWeight: "bold" }}>{company.name}</Text>
          )}
          <View style={{ alignItems: "flex-end" }}>
            <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 6 }}>
              {title}
            </Text>
            <Text style={{ fontSize: 9, fontWeight: "bold", color: "#374151" }}>
              N° {reference}
            </Text>
            <Text style={metaRow}>Émise le {formatDate(date)}</Text>
            {dueDate ? <Text style={metaRow}>Échéance {formatDate(dueDate)}</Text> : null}
          </View>
        </View>

        <View style={{ flexDirection: "row", gap: 20, marginBottom: 24 }}>
          <View style={{ flex: 1 }}>
            <Text style={sectionTitle}>ÉMISE PAR</Text>
            <Text style={{ fontSize: 10, fontWeight: "bold" }}>{issuer}</Text>
            {company.name ? (
              <Text style={blockRow}>Au nom du collectif {company.name}</Text>
            ) : null}
            {company.representativeRole ? (
              <Text style={blockRow}>{company.representativeRole}</Text>
            ) : null}
            {contactLine ? <Text style={blockRow}>{contactLine}</Text> : null}
            {company.address ? <Text style={blockRow}>{company.address}</Text> : null}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={sectionTitle}>FACTURÉE À</Text>
            <Text style={{ fontSize: 10, fontWeight: "bold" }}>{client.name}</Text>
            {client.company ? (
              <Text style={blockRow}>{client.company}</Text>
            ) : null}
            {client.address ? (
              <Text style={blockRow}>{client.address}</Text>
            ) : null}
            {client.email ? <Text style={blockRow}>{client.email}</Text> : null}
            {client.phone ? <Text style={blockRow}>{client.phone}</Text> : null}
          </View>
        </View>

        <View style={{ borderTopWidth: 1, borderTopColor: "#d1d5db", marginBottom: 12 }}>
          <View
            style={{
              flexDirection: "row",
              paddingVertical: 6,
              borderBottomWidth: 1,
              borderBottomColor: "#d1d5db",
            }}
          >
            <Text style={[headerCell, { flex: 3 }]}>DESCRIPTION</Text>
            <Text style={[headerCell, { width: 40, textAlign: "right" }]}>QTÉ</Text>
            <Text style={[headerCell, { width: 85, textAlign: "right" }]}>PRIX UNITAIRE</Text>
            <Text style={[headerCell, { width: 85, textAlign: "right" }]}>TOTAL</Text>
          </View>

          {items.map((item, i) => (
            <View key={i} style={row}>
              <Text style={{ fontSize: 9, paddingRight: 8, flex: 3 }}>{item.label}</Text>
              <Text style={[cell, { width: 40 }]}>{item.quantity}</Text>
              <Text style={[cell, { width: 85 }]}>
                {item.free ? "Offert" : formatPdfCurrency(item.unitPrice)}
              </Text>
              <Text style={[cell, { width: 85, fontWeight: item.free ? "normal" : "bold" }]}>
                {item.free ? "Offert" : formatPdfCurrency(item.total)}
              </Text>
            </View>
          ))}

          <View style={[row, { borderBottomWidth: 0 }]}>
            <Text style={totalRowLabel}>Sous-total</Text>
            <Text style={{ width: 40 }} />
            <Text style={{ width: 85 }} />
            <Text style={[cell, { width: 85, fontWeight: "bold" }]}>
              {formatPdfCurrency(totalAmount)}
            </Text>
          </View>
          <View style={[row, { borderBottomWidth: 0, borderTopWidth: 0.5, borderTopColor: "#d1d5db" }]}>
            <Text style={[totalRowLabel, { fontWeight: "bold" }]}>
              {paid ? "Total acquitté" : "Total dû"}
            </Text>
            <Text style={{ width: 40 }} />
            <Text style={{ width: 85 }} />
            <Text style={[cell, { width: 85, fontWeight: "bold" }]}>
              {formatPdfCurrency(totalAmount)}
            </Text>
          </View>
        </View>

        <View style={{ marginBottom: 12 }}>
          <Text style={sectionTitle}>RÈGLEMENT</Text>
          <Text style={{ fontSize: 9, color: "#374151", marginBottom: 2 }}>
            Virement bancaire, à réception
          </Text>
          <Text style={{ fontSize: 9, color: "#374151", marginBottom: 2 }}>
            IBAN {company.iban || "MG46 0000 8000 2105 0013 9861 793"}
          </Text>
          <Text style={{ fontSize: 9, color: "#374151", marginBottom: 2 }}>
            BIC {company.bic || "BFAVMGMGXXX"}
          </Text>
        </View>

        {payments.length > 0 ? (
          <View style={{ marginBottom: 12 }}>
            <Text style={sectionTitle}>PAIEMENTS</Text>
            {payments.map((p, i) => (
              <View
                key={i}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 4,
                  borderBottomWidth: 0.5,
                  borderBottomColor: "#e5e7eb",
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 9, fontWeight: "bold" }}>
                    {formatPdfCurrency(p.amountPaid)}
                  </Text>
                  <Text style={{ fontSize: 8, color: "#6b7280" }}>
                    {p.paymentDate
                      ? `${formatDate(p.paymentDate)} · `
                      : ""}
                    {methodLabel[p.method] ?? p.method} · {planLabel[p.plan] ?? p.plan}
                    {p.totalInstallments > 1
                      ? ` (paiement ${p.currentNumber}/${p.totalInstallments})`
                      : ""}
                  </Text>
                </View>
                <Text style={{ fontSize: 8, color: "#6b7280", textAlign: "right" }}>
                  {p.remaining > 0 ? `Reste : ${formatPdfCurrency(p.remaining)}` : "Soldé"}
                </Text>
              </View>
            ))}
            {remaining > 0 ? (
              <Text style={{ fontSize: 9, fontWeight: "bold", marginTop: 5 }}>
                Reste à payer : {formatPdfCurrency(remaining)}
              </Text>
            ) : null}
          </View>
        ) : null}

        <View style={{ flexDirection: "row", gap: 20, marginBottom: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 9, fontWeight: "bold" }}>STATUT : {statusLabel}</Text>
            <Text style={{ fontSize: 8, color: "#6b7280" }}>{statusNote}</Text>
          </View>
        </View>

        {note ? (
          <View style={{ marginBottom: 12, padding: 8, borderWidth: 0.5, borderColor: "#d1d5db" }}>
            <Text style={{ fontSize: 8, fontWeight: "bold", color: "#6b7280", marginBottom: 2 }}>
              NOTE
            </Text>
            <Text style={{ fontSize: 9 }}>{note}</Text>
          </View>
        ) : null}

        <View
          style={{
            position: "absolute",
            bottom: 36,
            left: 36,
            right: 36,
            borderTopWidth: 1,
            borderTopColor: "#e5e7eb",
            paddingTop: 8,
          }}
        >
          <View style={{ flexDirection: "row", gap: 12 }}>
            {company.email ? <Text style={footerText}>{company.email}</Text> : null}
            {company.phone ? <Text style={footerText}>{company.phone}</Text> : null}
            {company.website ? <Text style={footerText}>{company.website}</Text> : null}
          </View>
          <Text style={{ fontSize: 8, color: "#6b7280", marginTop: 4 }}>{legalNote}</Text>
          <Text style={{ fontSize: 9, fontWeight: "bold", marginTop: 4 }}>
            Merci pour votre confiance. {company.name}
          </Text>
        </View>
      </Page>
    </Document>
  );
}

const headerCell = {
  fontSize: 8,
  fontWeight: "bold",
  color: "#374151",
} as const;

const cell = {
  fontSize: 9,
  textAlign: "right",
} as const;

const totalRowLabel = {
  flex: 3,
  fontSize: 10,
  textAlign: "right",
  paddingRight: 8,
} as const;

const footerText = {
  fontSize: 8,
  color: "#374151",
} as const;

export async function renderInvoicePdf(data: InvoicePdfData): Promise<Buffer> {
  return renderToBuffer(<InvoiceDocument data={data} />);
}
