"use client";

import { useFormState, useFormStatus } from "react-dom";
import { KeyRound, Loader2 } from "lucide-react";
import { login, type LoginState } from "@/app/admin/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
    >
      {pending && <Loader2 className="size-4 animate-spin" />}
      Sign in
    </button>
  );
}

export function LoginForm({ from }: { from: string }) {
  const [state, formAction] = useFormState<LoginState, FormData>(login, {});

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="from" value={from} />
      <div className="relative">
        <KeyRound className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="password"
          name="secret"
          required
          autoFocus
          placeholder="Admin secret"
          className="h-11 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      <SubmitButton />
    </form>
  );
}
