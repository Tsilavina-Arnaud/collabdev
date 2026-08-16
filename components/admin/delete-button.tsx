"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function DeleteButton({
  label,
  description,
  action,
  redirectTo,
  variant = "ghost",
  size = "icon",
}: {
  label?: string;
  description: string;
  action: () => Promise<void> | void;
  redirectTo?: string;
  variant?: "ghost" | "outline" | "destructive";
  size?: "icon" | "sm" | "default";
}) {
  const [pending, setPending] = useState(false);
  const router = useRouter();

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={<Button variant={variant} size={size} />}
      >
        <Trash2 />
        {label}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            disabled={pending}
            onClick={async (e) => {
              e.preventDefault();
              setPending(true);
              try {
                await action();
                if (redirectTo) {
                  router.push(redirectTo);
                } else {
                  router.refresh();
                }
              } finally {
                setPending(false);
              }
            }}
          >
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
