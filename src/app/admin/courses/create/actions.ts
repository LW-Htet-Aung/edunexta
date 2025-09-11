"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { courseSchema, CourseSchemaType } from "@/schemas/zodSchemas";
import { ApiResponse } from "@/types/action-types";
import { headers } from "next/headers";

export const CreateCourse = async (
  data: CourseSchemaType
): Promise<ApiResponse> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
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
