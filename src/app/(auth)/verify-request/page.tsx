"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { authClient } from "@/lib/auth-client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useState, useTransition } from "react";
import { toast } from "sonner";

type Props = {};

const VerifyRequestPage = (props: Props) => {
  const params = useSearchParams();
  const router = useRouter();
  const email = params.get("email") as string;

  const [otp, setOtp] = useState("");
  const [emailPending, startEmailTransition] = useTransition();
  const isOtpCompleted = otp.length === 6;
  const verifyOtp = () => {
    startEmailTransition(async () => {
      await authClient.signIn.emailOtp({
        email,
        otp,
        fetchOptions: {
          onSuccess: () => {
            toast.success("Email verified, you will be redirected");
            router.push("/");
          },
          onError: () => {
            toast.error("Error verifying Email/OTP");
          },
        },
      });
    });
  };
  return (
    <Card className="w-full mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Please Check your email</CardTitle>
        <CardDescription>
          We have sent verification email code to your email address. Please
          open the email and enter the code to verify your email address
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center spze-y-2">
          <InputOTP
            value={otp}
            onChange={(value) => setOtp(value)}
            maxLength={6}
            className="gap-2"
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <p className="text-sm mt-2  text-muted-foreground">
            Enter the 6-digit code sent to your email
          </p>
        </div>
        <Button
          onClick={verifyOtp}
          isLoading={emailPending}
          disabled={emailPending || !isOtpCompleted}
          className="w-full"
        >
          Verify Account
        </Button>
      </CardContent>
    </Card>
  );
};

export default VerifyRequestPage;
