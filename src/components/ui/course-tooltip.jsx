"use client";

import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

export default function CourseTooltip({ course, children }) {
  if (!course.tooltipInfo) return children; // no tooltip if no extra info

  const {
    title, instructors, startOn, endOn
  } = course.tooltipInfo;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent className="max-w-xs text-left">
        <div className="flex flex-col space-y-1">
          <strong className="font-semibold">{title}</strong>
          <div><span className="font-semibold">Instructors:</span> {instructors}</div>
          <div><span className="font-semibold">Start:</span> {startOn}</div>
          <div><span className="font-semibold">End:</span> {endOn}</div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
