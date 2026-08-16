"use client";

import { useActionState, useState } from "react";
import { Loader2, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { submitContactRequest, type ContactFormState } from "@/lib/actions/contact";

type ServiceOption = {
  id: number;
  name: string;
};

const initialState: ContactFormState = { ok: false };

export function ContactForm({ services }: { services: ServiceOption[] }) {
  const [state, formAction, pending] = useActionState(
    submitContactRequest,
    initialState,
  );
  const [serviceId, setServiceId] = useState("");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Parlons de votre projet</CardTitle>
        <CardDescription>
          Décrivez votre besoin, nous revenons vers vous rapidement avec une
          solution adaptée.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {state.ok ? (
          <div className="space-y-2 rounded-lg border border-border p-4">
            <p className="font-medium">Votre demande a bien été envoyée</p>
            <p className="text-sm text-muted-foreground">
              Nous vous recontactons sous 24h ouvrées pour cadrer votre projet.
            </p>
          </div>
        ) : (
          <form action={formAction} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input id="name" name="name" placeholder="Jean Dupont" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="jean@exemple.fr"
                  required
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="06 12 34 56 78"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="service">Service concerné</Label>
                <Select
                  value={serviceId}
                  onValueChange={(v) => setServiceId(v ?? "")}
                  name="serviceId"
                >
                  <SelectTrigger id="service">
                    <SelectValue placeholder="Sélectionnez un service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((s) => (
                      <SelectItem key={s.id} value={String(s.id)}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Votre message</Label>
              <Textarea
                id="message"
                name="message"
                rows={4}
                placeholder="Décrivez votre projet : objectifs, délais, besoins..."
              />
            </div>
            {state.error ? (
              <p className="text-sm text-destructive">{state.error}</p>
            ) : null}
            <Button type="submit" disabled={pending} className="w-full sm:w-auto">
              {pending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Send />
              )}
              Envoyer ma demande
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
