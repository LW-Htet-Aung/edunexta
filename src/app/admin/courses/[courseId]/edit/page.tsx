import { adminGetCourse } from "@/app/data/admin/admin-get-course";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import EditCourseForm from "./_components/edit-course-form";
import CourseStructure from "./_components/course-structure";

type ParamsProps = Promise<{ courseId: string }>;

const EditCoursePage = async ({ params }: { params: ParamsProps }) => {
  const { courseId } = await params;
  const course = await adminGetCourse(courseId);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        Edit Course:{" "}
        <span className="text-primary underline">{course.title}</span>
      </h1>
      <Tabs defaultValue="basic-info" className="w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
          <TabsTrigger value="course-structure">Course Structure</TabsTrigger>
        </TabsList>
        <TabsContent value="basic-info">
          <Card>
            <CardHeader>
              <CardTitle>Basic Info</CardTitle>
              <CardDescription>
                Provide basic information about the course
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EditCourseForm data={course} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="course-structure">
          <Card>
            <CardHeader>
              <CardTitle>Course Structure</CardTitle>
              <CardDescription>
                Here you can update your Course Structure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CourseStructure />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EditCoursePage;
