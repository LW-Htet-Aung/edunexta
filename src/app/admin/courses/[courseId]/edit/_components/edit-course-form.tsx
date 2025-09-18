"use client";
import { Button } from "@/components/ui/button";
import { courseSchema, CourseSchemaType } from "@/schemas/zodSchemas";
import { PlusIcon, Sparkle } from "lucide-react";
import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import slugify from "slugify";
import { Textarea } from "@/components/ui/textarea";
import { courseCategories, courseLevels, courseStatus } from "@/constants/data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RichTextEditor from "@/components/rich-text-editor/editor";
import Uploader from "@/components/file-uploader/uploader";
import { tryCatch } from "@/lib/try-catch";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { EditCourse } from "../actions";
import { AdminCourseSingularType } from "@/app/data/admin/admin-get-course";

type Props = {};

const EditCourseForm = ({ data }: { data: AdminCourseSingularType }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<CourseSchemaType>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: data.title,
      description: data.description,
      fileKey: data.fileKey,
      duration: data.duration,
      price: data.price,
      level: data.level,
      category: data.category as CourseSchemaType["category"],
      smallDescription: data.smallDescription,
      slug: data.slug,
      status: data.status,
    },
  });

  const onSubmit = async (values: CourseSchemaType) => {
    console.log(values);
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        EditCourse(values, data.id)
      );

      if (error) {
        toast.error("An unexpected error occured. Please try again later.");
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        form.reset();
        router.push("/admin/courses");
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter course title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-4 items-end">
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="Enter course slug" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            type="button"
            className="w-fit"
            onClick={() => {
              const titleValue = form.getValues("title");
              const slug = slugify(titleValue);
              form.setValue("slug", slug, { shouldValidate: true });
            }}
          >
            Generate a Slug <Sparkle className="ml-1" size={16} />
          </Button>
        </div>
        <FormField
          control={form.control}
          name="smallDescription"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Small Description</FormLabel>
              <FormControl>
                <Textarea
                  className="min-h-[120px]"
                  placeholder="Enter small  description"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <RichTextEditor field={field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fileKey"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Thumbnail Image</FormLabel>
              <FormControl>
                <Uploader onChange={field.onChange} value={field.value} />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {courseCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Level</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {courseLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Duration (hours)</FormLabel>
                <FormControl>
                  <Input placeholder="0" type="number" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Price ($)</FormLabel>
                <FormControl>
                  <Input placeholder="Price" type="number" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {courseStatus.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <Button
          disabled={isPending}
          isLoading={isPending}
          className="flex ml-auto"
          type="submit"
          onClick={form.handleSubmit(onSubmit)}
        >
          Update Course <PlusIcon className="ml-1" size={16} />
        </Button>
      </form>
    </Form>
  );
};

export default EditCourseForm;
