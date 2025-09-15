"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { courseSchema, CourseSchemaType } from "@/schemas/zodSchemas";
import { ApiResponse } from "@/types/action-types";
import { detectBot, fixedWindow, request } from "@arcjet/next";
const aj = arcjet
  .withRule(
    detectBot({
      mode: "LIVE",
      allow: [],
    })
  )
  .withRule(
    fixedWindow({
      mode: "LIVE",
      window: "1m",
      max: 5,
    })
  );

export const CreateCourse = async (
  data: CourseSchemaType
): Promise<ApiResponse> => {
  const session = await requireAdmin();

  try {
    const req = await request();
    const decision = await aj.protect(req, {
      fingerprint: session?.user.id as string,
    });
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return {
          status: "error",
          message: "You have been blocked due to rate limiting",
        };
      } else {
        return {
          status: "error",
          message: "You are bot! if this is a mistake contact out support",
        };
      }
    }
    const validation = courseSchema.safeParse(data);

    if (!validation.success) {
      return { status: "error", message: "Invalid Form Data" };
    }

    const courseData = await prisma.course.create({
      data: {
        ...validation.data,
        userId: session?.user?.id as string,
      },
    });

    return { status: "success", message: "Course created successfully" };
  } catch {
    return { status: "error", message: "Failed to create course" };
  }
};
