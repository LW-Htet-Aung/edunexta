"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const useSignOut = () => {
  const router = useRouter();
  const handleSignout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
          toast.success("Sign out successfully");
        },
        onError: () => {
          toast.error("Failed to sign out");
        },
      },
    });
  };
  return handleSignout;
};

export default useSignOut;
