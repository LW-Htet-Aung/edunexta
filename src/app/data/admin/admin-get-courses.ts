import React from "react";
import { requireAdmin } from "./require-admin";
import { prisma } from "@/lib/db";

const adminGetCourses = async () => {
  await requireAdmin();

  const data = await prisma.course.findMany({
    select: {
      id: true,
      title: true,
      smallDescription: true,
      level: true,
      status: true,
      price: true,
      fileKey: true,
      slug: true,
      duration: true,
    },
    orderBy: {
      createAt: "desc",
    },
  });

  return data;
};
export type AdminCourseType = Awaited<ReturnType<typeof adminGetCourses>>[0];

export default adminGetCourses;
