"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  rectIntersection,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import React, { useState } from "react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import SortableItem from "./sortable-item";
import { AdminCourseSingularType } from "@/app/data/admin/admin-get-course";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Delete,
  FileText,
  GripVertical,
  Trash2,
} from "lucide-react";
import Link from "next/link";
interface CourseStructureProps {
  course: AdminCourseSingularType;
}

const CourseStructure = ({ course }: CourseStructureProps) => {
  const initialItem =
    course.chapter.map((chapter) => ({
      id: chapter.id,
      title: chapter.title,
      order: chapter.position,
      isOpen: true, //default chapter to be open
      lessons: chapter.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        order: lesson.position,
      })),
    })) || [];
  const [items, setItems] = useState(initialItem);

  // function SortableItem(props) {
  //   const { attributes, listeners, setNodeRef, transform, transition } =
  //     useSortable({ id: props.id });

  //   const style = {
  //     transform: CSS.Transform.toString(transform),
  //     transition,
  //   };

  //   return (
  //     <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
  //       {/* ... */}
  //     </div>
  //   );
  // }
  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const toggleChapter = (chapterId: string) => {
    setItems(
      items.map((chapter) =>
        chapter.id === chapterId
          ? { ...chapter, isOpen: !chapter.isOpen }
          : chapter
      )
    );
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragEnd={handleDragEnd}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b boder-border">
          <CardTitle>Chapters</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Start of  Chapter */}
          <SortableContext strategy={verticalListSortingStrategy} items={items}>
            {items.map((chapter) => (
              <SortableItem
                key={chapter.id}
                id={chapter.id}
                data={{ type: "chapter" }}
              >
                {(listeners) => (
                  <Card>
                    <Collapsible
                      open={chapter.isOpen}
                      onOpenChange={() => toggleChapter(chapter.id)}
                    >
                      <div className="flex items-center justify-between p-3 border-b border-border">
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            type="button"
                            {...listeners}
                          >
                            <GripVertical className="size-4" />
                          </Button>
                          <CollapsibleTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              type="button"
                              className="flex items-center"
                            >
                              {chapter.isOpen ? (
                                <ChevronDown className="size-4" />
                              ) : (
                                <ChevronRight className="size-4" />
                              )}
                            </Button>
                          </CollapsibleTrigger>
                          <p className="cursor-pointer hover:text-primary pl-2">
                            {chapter.title}
                          </p>
                        </div>
                        <Button size="icon" variant="outline">
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                      {/* Start of  lesson */}
                      <CollapsibleContent>
                        <div className="p-1">
                          <SortableContext
                            items={chapter.lessons.map((lesson) => lesson.id)}
                            strategy={verticalListSortingStrategy}
                          >
                            {chapter.lessons.map((lesson) => (
                              <SortableItem
                                key={lesson.id}
                                id={lesson.id}
                                data={{ type: "lesson", chapterId: chapter.id }}
                              >
                                {(lessonListeners) => (
                                  <div className="flex items-center justify-between p-2 hover:bg-accent rounded-sm">
                                    <div className="flex items-center gap-2">
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        type="button"
                                        {...lessonListeners}
                                      >
                                        <GripVertical className="size-4" />
                                      </Button>
                                      <FileText className="size-4" />
                                      <Link
                                        href={`/admin/courses/${course.id}/${chapter.id}/${lesson.id}/edit`}
                                      >
                                        {lesson.title}
                                      </Link>
                                    </div>
                                    <Button
                                      type="button"
                                      size="icon"
                                      variant="outline"
                                    >
                                      <Trash2 className="size-4" />
                                    </Button>
                                  </div>
                                )}
                              </SortableItem>
                            ))}
                          </SortableContext>
                          <div className="p-2 ">
                            <Button
                              variant="outline"
                              type="button"
                              className="w-full"
                            >
                              Create Lesson
                            </Button>
                          </div>
                        </div>
                      </CollapsibleContent>
                      {/* End of  Chapter */}
                    </Collapsible>
                  </Card>
                )}
              </SortableItem>
            ))}
          </SortableContext>
          {/* End of  Chapter */}
        </CardContent>
      </Card>
    </DndContext>
  );
};

export default CourseStructure;
