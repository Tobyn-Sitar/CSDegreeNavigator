"use client";

import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

export default function CourseBox({ course }) {
  const hasInfo = !!course.tooltipInfo;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className="course-box"
          data-course-id={course.id}
          draggable="true"
          title={!hasInfo ? course.id : undefined}
        >
          {course.id} {hasInfo && <span className="animate-pulse">✳️</span>}
        </div>
      </TooltipTrigger>
      {hasInfo && (
        <TooltipContent className="max-w-xs text-left p-2 space-y-2">
          <div className="flex flex-col space-y-1">
            <strong className="font-semibold">{course.tooltipInfo.title}</strong>
          </div>
          {course.tooltipInfo.offerings.map((offering, idx) => (
            <div key={idx} className="flex flex-col space-y-1 border-t border-gray-300 pt-2">
              <div className="font-semibold">{offering.term}</div>
              <div><span className="font-semibold">Instructor(s):</span> {offering.instructors}</div>
              <div><span className="font-semibold">Campus:</span> {offering.campus}</div>
              <div><span className="font-semibold">Building/Room:</span> {offering.building} {offering.room}</div>
              <div><span className="font-semibold">Days:</span> {offering.days}</div>
              <div><span className="font-semibold">Time:</span> {offering.times}</div>
            </div>
          ))}
        </TooltipContent>
      )}
    </Tooltip>
  );
}
