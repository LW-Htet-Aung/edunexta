import { CourseLevel, CourseStatus } from "@/generated/prisma";
import { FeatureProps, NavigationItemsProps } from "@/types/constant";

export const features: FeatureProps[] = [
  {
    icon: "📚",
    title: "Comprehensive Courses",
    description:
      "Access a wide range of carefully curated courses designed by industry experts.",
  },
  {
    icon: "🎮",
    title: "Interactive Learning",
    description:
      "Engage with interactive content, quizzes, and assignments to enhance your learning experience.",
  },
  {
    icon: "📊",
    title: "Progress Tracking",
    description:
      "Monitor your progress and achievements with detailed analytics and personalized dashboards.",
  },
  {
    icon: "👥",
    title: "Community Support",
    description:
      "Join a vibrant community of learners and instructors to collaborate and share knowledge",
  },
];

export const navigationItems: NavigationItemsProps[] = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Courses",
    href: "/courses",
  },
  {
    name: "Dashboard",
    href: "/admin",
  },
];

export const courseLevels: CourseLevel[] = [
  "Beginner",
  "Intermediate",
  "Advanced",
] as const;

export const courseStatus: CourseStatus[] = [
  "Draft",
  "Published",
  "Archived",
] as const;

export const courseCategories = [
  "Development",
  "Business",
  "Finance",
  "IT & Software",
  "Office Productivity",
  "Personal Development",
  "Design",
  "Marketing",
  "Health & Fitness",
  "Music",
  "Teaching & Academics",
] as const;
