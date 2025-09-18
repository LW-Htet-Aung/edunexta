"use client";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { DndContext, rectIntersection } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import React from "react";

type Props = {};

const CourseStructure = (props: Props) => {
  return (
    <DndContext collisionDetection={rectIntersection}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b boder-border">
          <CardTitle>Chapters</CardTitle>
        </CardHeader>
      </Card>
      {/* <SortableContext items={items}>...</SortableContext> */}
    </DndContext>
  );
};

export default CourseStructure;
