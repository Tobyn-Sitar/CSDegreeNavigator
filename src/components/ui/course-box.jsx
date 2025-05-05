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
        >
          {course.id}
        </div>
      </TooltipTrigger>

      {hasInfo && (
        <TooltipContent className="max-w-sm p-4 bg-white text-black rounded-md shadow-lg overflow-y-auto max-h-80 space-y-4">
          <div className="font-bold text-center mb-2">{course.tooltipInfo.title}</div>
          {course.tooltipInfo.offerings.map((offering, idx) => (
            <div key={idx} className="border-t border-gray-300 pt-2">
              <div className="text-sm"><span className="font-semibold">Term:</span> {offering.term}</div>
              <div className="text-sm"><span className="font-semibold">Campus:</span> {offering.campus}</div>
              <div className="text-sm"><span className="font-semibold">Instructor(s):</span> {offering.instructors}</div>
              <div className="text-sm"><span className="font-semibold">Days:</span> {offering.meetingDays}</div>
              <div className="text-sm"><span className="font-semibold">Time:</span> {offering.meetingStartTime} - {offering.meetingEndTime}</div>
            </div>
          ))}
        </TooltipContent>
      )}
    </Tooltip>
  );
}