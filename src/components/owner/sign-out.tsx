"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth-client";

export function OwnerSignOut() {
  const router = useRouter();
  return (
    <Button variant="ghost" size="icon" className="h-8 w-8"
      onClick={async () => { await signOut(); router.push("/login"); }}>
      <LogOut size={14} />
    </Button>
  );
}
