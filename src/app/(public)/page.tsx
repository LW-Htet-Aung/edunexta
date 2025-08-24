import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { features } from "@/constants/data";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <section className="py-20 relative">
        <div className="flex flex-col items-center text-center space-y-8">
          <Badge variant="outline">Learning of online education</Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Elevate your learning experiences
          </h1>
          <p className="max-w-[700px] text-muted-foreground m:text-xl">
            Discover a new way to learn with our modern, interactive larning
            management system. Access high-quality courses anytime, anywhere
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link
              className={buttonVariants({
                size: "lg",
              })}
              href="/explore"
            >
              Explore Courses
            </Link>
            <Link
              className={buttonVariants({
                size: "lg",
                variant: "outline",
              })}
              href="/login"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>
      <section className="py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
        {features.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex items-center gap-2">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{feature.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </section>
    </>
  );
}
