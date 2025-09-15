import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, ShieldX } from "lucide-react";
import Link from "next/link";
import React from "react";

const NotAdminPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="max-w-md w-full space-y-2 ">
        <CardHeader className="text-center space-y-2">
          <div className="bg-destructive/10 rounded-full p-4 w-fit mx-auto">
            <ShieldX className="size-16 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Access Restriced</CardTitle>
          <CardDescription className="max-w-xs mx-auto">
            You are not an admin, which mean you can&apos;t create any course
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href="/"
            className={buttonVariants({
              className: "w-full",
            })}
          >
            <ArrowLeft className="mr-1 size-4" />
            Back To Home
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotAdminPage;
