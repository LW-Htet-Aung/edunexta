import { buttonVariants } from "@/components/ui/button";
import { ChildrenProps } from "@/types";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Logo from "../../../public/logo.svg";
const AuthLayout = ({ children }: ChildrenProps) => {
  return (
    <div className="relative flex flex-col  min-h-svh justify-center items-center ">
      <Link
        className={buttonVariants({
          variant: "outline",
          className: "absolute left-4 top-4",
        })}
        href="/"
      >
        <ArrowLeft className="size-4" />
        Back
      </Link>
      <div className="flex flex-col w-full max-w-sm gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <Image alt="logo" src={Logo} className="size-10" />
          EduNexta
        </Link>
        {children}
        <div className="text-balance text-center text-xs text-muted-foreground">
          By clicking cotinue, you agree to our <br />
          <span className="hover:text-primary hover:underline transition duration-300 cursor-pointer">
            Terms of service
          </span>{" "}
          and{" "}
          <span className="hover:text-primary hover:underline transition duration-300 cursor-pointer">
            Privacy Policy
          </span>
        </div>
      </div>
    </div>
  );
};
export default AuthLayout;
