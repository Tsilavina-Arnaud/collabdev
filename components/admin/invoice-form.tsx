"use client";

import { useActionState, useState } from "react";
import { Check, Loader2, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createInvoiceAction, type InvoiceFormState } from "@/lib/actions/invoices";
import { formatCurrency } from "@/lib/format";

type ServiceOption = { id: number; name: string; price: number };
type ClientOption = { id: number; name: string; email: string | null };

type ItemRow = {
  label: string;
  quantity: number;
  unitPrice: number;
  free: boolean;
};

const initialState: InvoiceFormState = {};

export function InvoiceForm({
  services,
  clients,
  defaultClientId,
}: {
  services: ServiceOption[];
  clients: ClientOption[];
  defaultClientId?: number;
}) {
  const [state, formAction, pending] = useActionState(
    createInvoiceAction,
    initialState,
  );

  const [type, setType] = useState("FACTURE");
  const [mode, setMode] = useState<"existing" | "new">(
    defaultClientId ? "existing" : "existing",
  );
  const [clientId, setClientId] = useState(
    defaultClientId ? String(defaultClientId) : "",
  );
  const [items, setItems] = useState<ItemRow[]>([
    { label: "", quantity: 1, unitPrice: 0, free: false },
  ]);
  const [method, setMethod] = useState("CARTE_BANCAIRE");
  const [plan, setPlan] = useState("PAIEMENT_COMPLET");
  const [amountPaid, setAmountPaid] = useState("");

  const total = items.reduce(
    (sum, item) => sum + (item.free ? 0 : item.quantity * item.unitPrice),
    0,
  );

  function updateItem(index: number, patch: Partial<ItemRow>) {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    );
  }

  function selectService(index: number, serviceId: string) {
    const service = services.find((s) => s.id === Number(serviceId));
    if (!service) return;
    updateItem(index, {
      label: service.name,
      unitPrice: Number(service.price),
      free: false,
    });
  }

  function submit(fd: FormData) {
    fd.set("type", type);
    fd.set("clientId", mode === "existing" ? clientId : "0");
    fd.set("itemCount", String(items.length));
    fd.set("paymentMethod", method);
    fd.set("paymentPlan", plan);
    items.forEach((item, i) => {
      fd.set(`label_${i}`, item.label);
      fd.set(`quantity_${i}`, String(item.quantity));
      fd.set(`unitPrice_${i}`, String(item.unitPrice));
      fd.set(`free_${i}`, item.free ? "on" : "off");
    });
    return formAction(fd);
  }

  return (
    <form action={submit} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Type de facture</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={type === "FACTURE" ? "default" : "outline"}
                onClick={() => setType("FACTURE")}
              >
                {type === "FACTURE" ? <Check /> : null}
                Facture
              </Button>
              <Button
                type="button"
                variant={type === "PROFORMA" ? "default" : "outline"}
                onClick={() => setType("PROFORMA")}
              >
                {type === "PROFORMA" ? <Check /> : null}
                Proforma
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Client</Label>
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={mode === "existing" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMode("existing")}
                >
                  Client existant
                </Button>
                <Button
                  type="button"
                  variant={mode === "new" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMode("new")}
                >
                  Nouveau client
                </Button>
              </div>
              {mode === "existing" ? (
                <Select value={clientId} onValueChange={(v) => setClientId(v ?? "")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.name}
                        {c.email ? ` - ${c.email}` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="grid gap-2 sm:grid-cols-2">
                  <Input
                    name="newClientName"
                    placeholder="Nom complet"
                    required
                  />
                  <Input
                    name="newClientCompany"
                    placeholder="Société"
                  />
                  <Input
                    name="newClientEmail"
                    type="email"
                    placeholder="Email"
                  />
                  <Input name="newClientPhone" type="tel" placeholder="Téléphone" />
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date">Date de la facture</Label>
              <Input
                id="date"
                name="date"
                type="date"
                defaultValue={new Date().toISOString().slice(0, 10)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Échéance</Label>
              <Input id="dueDate" name="dueDate" type="date" />
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-lg border border-border p-4">
          <p className="font-medium">Paiement</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Mode de paiement</Label>
              <Select value={method} onValueChange={(v) => setMethod(v ?? "CARTE_BANCAIRE")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CARTE_BANCAIRE">Carte bancaire</SelectItem>
                  <SelectItem value="VIREMENT">Virement</SelectItem>
                  <SelectItem value="ESPECES">Espèces</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Plan de paiement</Label>
              <Select value={plan} onValueChange={(v) => setPlan(v ?? "PAIEMENT_COMPLET")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PAIEMENT_COMPLET">Paiement complet</SelectItem>
                  <SelectItem value="PAIEMENT_2_FOIS">Paiement en 2 fois</SelectItem>
                  <SelectItem value="PAIEMENT_3_FOIS">Paiement en 3 fois</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="amountPaid">Montant payé</Label>
              <Input
                id="amountPaid"
                name="amountPaid"
                type="number"
                step="0.01"
                min="0"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentDate">Date du paiement</Label>
              <Input
                id="paymentDate"
                name="paymentDate"
                type="date"
                defaultValue={new Date().toISOString().slice(0, 10)}
              />
            </div>
          </div>
          <div className="rounded-lg bg-muted p-3 text-sm">
            <span className="text-muted-foreground">Total : </span>
            <span className="font-semibold">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Prestations</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setItems((prev) => [
                ...prev,
                { label: "", quantity: 1, unitPrice: 0, free: false },
              ])
            }
          >
            <Plus />
            Ajouter une ligne
          </Button>
        </div>

        {items.map((item, index) => (
          <div
            key={index}
            className="grid gap-2 rounded-lg border border-border p-3 sm:grid-cols-[1fr_80px_110px_90px_36px] sm:items-center"
          >
            <div className="space-y-1">
              <Select
                value=""
                onValueChange={(v) => selectService(index, v ?? "")}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Service du catalogue (ou saisir ci-dessous)" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>
                      {s.name} - {formatCurrency(s.price)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                className="h-8"
                placeholder="Libellé de la prestation"
                value={item.label}
                onChange={(e) => updateItem(index, { label: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Qté</Label>
              <Input
                type="number"
                min={1}
                className="h-8"
                value={item.quantity}
                onChange={(e) =>
                  updateItem(index, { quantity: Number(e.target.value) || 1 })
                }
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Prix unitaire</Label>
              <Input
                type="number"
                min={0}
                step="0.01"
                className="h-8"
                value={item.unitPrice}
                disabled={item.free}
                onChange={(e) =>
                  updateItem(index, { unitPrice: Number(e.target.value) || 0 })
                }
              />
            </div>
            <div className="flex items-center gap-2 pt-4">
              <Checkbox
                id={`free_${index}`}
                checked={item.free}
                onCheckedChange={(checked) =>
                  updateItem(index, { free: checked === true })
                }
              />
              <Label htmlFor={`free_${index}`} className="text-xs">
                Offert
              </Label>
            </div>
            <div className="pt-4">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Supprimer la ligne"
                disabled={items.length === 1}
                onClick={() =>
                  setItems((prev) =>
                    prev.length === 1 ? prev : prev.filter((_, i) => i !== index),
                  )
                }
              >
                <Trash2 />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="note">Note</Label>
        <Textarea
          id="note"
          name="note"
          rows={2}
          placeholder="Conditions particulières, livrables..."
        />
      </div>

      {state.error ? (
        <p className="text-sm text-destructive">{state.error}</p>
      ) : null}

      <div className="flex items-center justify-end gap-3">
        <p className="text-sm text-muted-foreground">
          Total : <span className="font-semibold text-foreground">{formatCurrency(total)}</span>
        </p>
        <Button type="submit" disabled={pending}>
          {pending ? <Loader2 className="animate-spin" /> : null}
          Créer la facture
        </Button>
      </div>
    </form>
  );
}
