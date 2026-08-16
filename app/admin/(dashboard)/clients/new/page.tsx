import Link from "next/link";

import { ClientForm } from "@/components/admin/client-form";
import { createClientAction } from "@/lib/actions/clients";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Nouveau client" };

export default function NewClientPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium tracking-tight">Nouveau client</h1>
          <p className="text-sm text-muted-foreground">
            Ajoutez un client à votre carnet d'adresses.
          </p>
        </div>
        <Button
              nativeButton={false} render={<Link href="/admin/clients" />} variant="outline">
          Retour
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations client</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientForm action={createClientAction} submitLabel="Créer le client" />
        </CardContent>
      </Card>
    </div>
  );
}
