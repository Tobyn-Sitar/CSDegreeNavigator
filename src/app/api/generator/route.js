import { connectMongoDB } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import mongoose from "mongoose";

function toMinutes(str) {
  const hour = parseInt(str.slice(0, 2), 10);
  const minute = parseInt(str.slice(2), 10);
  return hour * 60 + minute;
}

function checkOverlap(aStart, aEnd, bStart, bEnd) {
  return Math.max(aStart, bStart) < Math.min(aEnd, bEnd);
}

function isConflict(meetings, blocks) {
  return meetings?.some(m =>
    ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].some(day => {
      const dayMap = {
        Monday: m.meetingMondayIndicator,
        Tuesday: m.meetingTuesdayIndicator,
        Wednesday: m.meetingWednesdayIndicator,
        Thursday: m.meetingThursdayIndicator,
        Friday: m.meetingFridayIndicator
      };
      if (dayMap[day]) {
        return blocks.some(b =>
          b.day === day &&
          checkOverlap(
            toMinutes(m.meetingBeginTime),
            toMinutes(m.meetingEndTime),
            toMinutes(b.startTime),
            toMinutes(b.endTime)
          )
        );
      }
    })
  );
}

function getMeetingString(m) {
  const days = [];
  if (m.meetingMondayIndicator) days.push("Mon");
  if (m.meetingTuesdayIndicator) days.push("Tue");
  if (m.meetingWednesdayIndicator) days.push("Wed");
  if (m.meetingThursdayIndicator) days.push("Thu");
  if (m.meetingFridayIndicator) days.push("Fri");

  if (!m.meetingBeginTime || !m.meetingEndTime) {
    return `@ Asynchronous - ${m.meetingBuildingCode}`;
  }

  return `${days.join("/")} @ ${m.meetingBeginTime} - ${m.meetingEndTime} in ${m.meetingBuildingCode} ${m.meetingRoomCode}`;
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  await connectMongoDB();
  const db = mongoose.connection.db;
  const user = await db.collection("users").findOne({ email: session.user.email });
  const courses = await db.collection("course_data").find({}).toArray();

  if (!user) return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });

  const completed = [];
  const categories = ["fye", "core", "communication", "mathematics", "science", "large_scale"];
  categories.forEach(cat => {
    const group = user.taken?.[cat];
    if (group) {
      for (const [course, taken] of Object.entries(group)) {
        if (taken) completed.push(course);
      }
    }
  });

  const creditMap = {
    MAT121: 3, MAT151: 3, MAT161: 4, MAT162: 4, STA200: 3,
    CSC141: 3, CSC142: 3, CSC220: 3, CSC231: 3, CSC240: 3, CSC241: 3,
    CSC301: 3, CSC345: 3, CSC402: 3,
    FYE100: 3,
    ENG368: 3, ENG371: 3, SPK208: 3, SPK230: 3, SPK199: 3,
    BIO110: 4, CHE103: 3, CRL103: 1, ESS101: 3, PHY130: 4, PHY170: 4,
    CSC400: 6, CSC416: 3, CSC417: 3, CSC466: 3, CSC467: 3, CSC468: 3, CSC476: 3, CSC496: 3
  };

  let completedCredits = 0;
  completed.forEach(c => {
    if (creditMap[c]) completedCredits += creditMap[c];
  });

  const busyBlocks = user.timeRestrictions || [];

  const seen = new Set();
  const recommended = [];

  function prerequisitesSatisfied(courseCode) {
    switch (courseCode) {
      case "CSC141":
        return true;
      case "CSC142":
        return completed.includes("CSC141");
      case "CSC220":
        return completed.includes("MAT151") && completed.includes("MAT161");
      case "CSC231":
        return completed.includes("CSC142") && completed.includes("MAT151");
      case "CSC240":
        return completed.includes("CSC142");
      case "CSC241":
        return completed.includes("CSC240") && completed.includes("MAT151") && completed.includes("MAT161");
      case "CSC301": {
        const cscCourses = completed.filter(c => c.startsWith("CSC"));
        return cscCourses.length >= 3;
      }
      case "CSC345":
        return completed.includes("CSC240") && completed.includes("CSC241");
      default:
        return !(courseCode.startsWith("CSC4") || courseCode.startsWith("CSC3")) || completed.includes("CSC241");
    }
  }

  courses.forEach(course => {
    const courseCode = `${course.subjectCode}${course.courseNumber}`;
    if (
      !completed.includes(courseCode) &&
      !seen.has(courseCode) &&
      !isConflict(course.meetingTimes, busyBlocks) &&
      prerequisitesSatisfied(courseCode)
    ) {
      seen.add(courseCode);
      recommended.push({
        courseNumber: courseCode,
        courseTitle: course.courseTitle,
        crn: course.crn,
        creditHours: course.creditHours,
        meetingStrings: course.meetingTimes?.map(getMeetingString)
      });
    }
  });

  return new Response(JSON.stringify({ completedCredits, recommended }), { status: 200 });
}
