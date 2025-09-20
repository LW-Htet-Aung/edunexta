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
export const EditCourse = async (
  data: CourseSchemaType,
  courseId: string
): Promise<ApiResponse> => {
  const user = await requireAdmin();

  try {
    const req = await request();
    const decision = await aj.protect(req, {
      fingerprint: user.user.id,
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

    const result = courseSchema.safeParse(data);

    if (!result.success) {
      return {
        status: "error",
        message: "Invalid Form Data",
      };
    }
    await prisma.course.updateMany({
      where: {
        id: courseId,
        userId: user?.user.id,
      },
      data: {
        ...result.data,
      },
    });
    return { status: "success", message: "Course edited successfully" };
  } catch {
    return { status: "error", message: "Failed to update course" };
  }
};
