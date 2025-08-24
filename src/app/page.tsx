"use client";
import ThemeToggle from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Home() {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  const handleLogin = () => router.push("/login");

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
          toast.success("Sign out successfully");
        },
      },
    });
  };

  return (
    <div className="">
      <ThemeToggle />
      {session ? (
        <div>
          <p>signed in as {session.user.email}</p>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      ) : (
        <Button onClick={handleLogin}>Login</Button>
      )}
    </div>
  );
}
