import { connectMongoDB } from "@/lib/mongodb"; // MongoDB connection utility
import Course from "@/models/courses"; // Course model

export async function GET(req) {
  try {
    // Connect to MongoDB
    console.log("Connecting to MongoDB...");
    await connectMongoDB();

    // Extract the courseNumber query parameter from the URL using nextUrl
    const courseNumber = req.nextUrl.searchParams.get('courseNumber');

    // Log the courseNumber to confirm it's being passed correctly
    console.log("Course Number:", courseNumber);

    // If the courseNumber is not provided, return an error
    if (!courseNumber) {
      return new Response("Course number is required", { status: 400 });
    }

    // Fetch courses based on the courseNumber
    const courses = await Course.find({ courseNumber: courseNumber })
      .select('courseNumber courseTitle actualEnrollment startOn endOn instructors.instructorFirstName');

    // Log the result of the query
    console.log("Courses found:", courses);

    if (courses.length === 0) {
      return new Response("No courses found with that course number", { status: 404 });
    }

    // Return courses data as a JSON response
    return new Response(JSON.stringify(courses), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return new Response("Server Error: " + error.message, { status: 500 });
  }
}
