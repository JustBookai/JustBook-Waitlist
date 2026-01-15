"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, User, Mail } from "lucide-react";
import { toast } from "sonner";
import { joinWaitlist, unsubscribeWaitlist } from "@/app/actions";

export function WaitlistForm({ onSuccess }: { onSuccess?: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const handleUnsubscribe = async (unsubEmail: string) => {
    startTransition(async () => {
      const result = await unsubscribeWaitlist(unsubEmail);
      if (result.success) {
        toast.success("You have been removed from the waitlist.");
        setEmail("");
        setName("");
        onSuccess?.();
      } else {
        toast.error(result.error || "Failed to unsubscribe.");
      }
    });
  };

  const handleSubmit = async (formData: FormData) => {
    const emailValue = formData.get("email") as string;
    startTransition(async () => {
      const result = await joinWaitlist(formData);
      if (result.success) {
        toast.success(`Welcome, ${name}! Check your email for confirmation.`);
        setEmail("");
        setName("");
        onSuccess?.();
      } else if (result.error === 'ALREADY_REGISTERED') {
        toast.info("You are already on the waitlist!", {
          description: "Would you like to opt out instead?",
          action: {
            label: "Opt Out",
            onClick: () => handleUnsubscribe(emailValue),
          },
        });
      } else {
        toast.error(result.message || result.error || "Something went wrong.");
      }
    });
  };

  return (
    <form action={handleSubmit} className="w-full space-y-4 mb-8">
      <div className="space-y-3">
        {/* Name Input */}
        <div className="flex overflow-hidden rounded-xl bg-white/5 p-1 ring-1 gap-1 ring-black/10 dark:ring-white/20 focus-within:ring-2 focus-within:ring-[#12A19A]!">
          <div className="flex items-center pl-3 pr-1 text-muted-foreground">
            <User size={18} />
          </div>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Your Full Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border-0 rounded-lg bg-transparent placeholder:text-muted-foreground focus:ring-0 focus:border-transparent focus-visible:border-transparent focus:outline-none active:ring-0 active:outline-none focus-visible:ring-0 focus-visible:outline-none active:border-transparent focus-visible:ring-offset-0"
          />
        </div>

        {/* Email Input + Submit Button */}
        <div className="flex overflow-hidden rounded-xl bg-white/5 p-1 ring-1 gap-1 ring-black/10 dark:ring-white/20 focus-within:ring-2 focus-within:ring-[#12A19A]!">
          <div className="flex items-center pl-3 pr-1 text-muted-foreground">
            <Mail size={18} />
          </div>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Email Address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-0 rounded-lg bg-transparent placeholder:text-muted-foreground focus:ring-0 focus:border-transparent focus-visible:border-transparent focus:outline-none active:ring-0 active:outline-none focus-visible:ring-0 focus-visible:outline-none active:border-transparent focus-visible:ring-offset-0"
          />
          <Button type="submit" className="rounded-lg px-6" disabled={isPending}>
            {isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Get Notified"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
