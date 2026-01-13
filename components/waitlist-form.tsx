"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { joinWaitlist } from "@/app/actions";

export function WaitlistForm() {
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      const result = await joinWaitlist(formData);
      if (result.success) {
        toast.success("Welcome! Check your email for confirmation.");
        setEmail("");
      } else {
        toast.error(result.error || "Something went wrong.");
      }
    });
  };

  return (
    <form action={handleSubmit} className="w-full space-y-4 mb-8">
      <div className="flex overflow-hidden rounded-xl bg-white/5 p-1 ring-1 gap-1 ring-black/10 dark:ring-white/20 focus-within:ring-2 focus-within:ring-[#12A19A]!">
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border-0 rounded-lg bg-transparent placeholder:text-muted-foreground focus:ring-0 focus:border-transparent focus-visible:border-transparent focus:outline-none active:ring-0 active:outline-none focus-visible:ring-0 focus-visible:outline-none active:border-transparent focus-visible:ring-offset-0"
        />
        <Button type="submit" className="rounded-lg" disabled={isPending}>
          {isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Get Notified"
          )}
        </Button>
      </div>
    </form>
  );
}
