import { courseCategories, courseLevels, courseStatus } from "@/constants/data";
import { z } from "zod";

export const courseSchema = z.object({
  title: z
    .string()
    .min(3, { error: "Title must be at least 3 characters long" })
    .max(100, { error: "Title must be at most 100 characters long" }),
  description: z.string().min(1, { error: "Description is required" }),
  fileKey: z.string().min(1, { error: "File is required" }),
  price: z.coerce
    .number<number>()
    .min(1, { error: "Price must be positive number" }),
  duration: z.coerce
    .number<number>()
    .min(1, { error: "Duration must be at least 1 hour" })
    .max(500, { error: "Duration must be at most 500 hour" }),
  level: z.enum(courseLevels, { error: "Level is required" }),
  category: z.enum(courseCategories, { error: "Category is required" }),
  smallDescription: z
    .string()
    .min(3, { error: "Small description must be at least 3 characters long" })
    .max(200, {
      error: "Small description must be at most 200 characters long",
    }),
  slug: z.string().min(3, { error: "Slug must be at least 3 characters long" }),
  status: z.enum(courseStatus, { error: "Status is required" }),
});

export type CourseSchemaType = z.infer<typeof courseSchema>;
