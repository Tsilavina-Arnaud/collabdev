import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { renderInvoicePdf } from "@/lib/invoice-pdf";
import { buildInvoicePdfData } from "@/lib/invoice-data";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ reference: string }> },
) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "Jeton requis" }, { status: 401 });
  }

  const { reference } = await params;
  const invoice = await prisma.invoice.findUnique({
    where: { reference },
    include: {
      client: true,
      items: true,
      payments: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!invoice || !invoice.downloadToken || invoice.downloadToken !== token) {
    return NextResponse.json({ error: "Facture introuvable" }, { status: 404 });
  }

  const company = await prisma.companyInfo.findFirst();

  const buffer = await renderInvoicePdf(
    buildInvoicePdfData(invoice, company),
  );

  const filename = `facture_${invoice.reference}.pdf`;

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": String(buffer.length),
    },
  });
}
