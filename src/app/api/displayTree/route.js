import { connectMongoDB } from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import mongoose from "mongoose";  

export async function GET(request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
        return new Response(JSON.stringify({ error: "User not authenticated" }), { status: 401 });
    }

    // Connect to MongoDB
    console.log("Connecting to MongoDB...");
    await connectMongoDB();

    try {
        const db = mongoose.connection.db;

        const user = await db.collection('users').findOne({ email: session.user.email });

        if (!user) {
            return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
        }

        const locked = [];
        const incomplete = [];
        const completed = [];
        const requirement_satisfied = [];

        const resultCSC142 = await db.collection('users').findOne({
            $and: [
                { email: session.user.email },
                { "taken.core.CSC141": true }
            ]
        });

        if (!resultCSC142) {
            locked.push("CSC142");
        }

        const resultCSC220 = await db.collection('users').findOne({
            $and: [
                { email: session.user.email },
                { $or: [
                    { "taken.mathematics.MAT151": true },
                    { "taken.mathematics.MAT161": true }
                ]}
            ]
        });

        if (!resultCSC220) {
            locked.push("CSC220");
        }

        const resultCSC231 = await db.collection('users').findOne({
            $and: [
                { email: session.user.email },
                { "taken.core.CSC142": true },
                { "taken.mathematics.MAT151": true }
            ]
        });

        if (!resultCSC231) {
            locked.push("CSC231");
        }

        const resultCSC240 = await db.collection('users').findOne({
            $and: [
                { email: session.user.email },
                { "taken.core.CSC142": true }
            ]
        });

        if (!resultCSC240) {
            locked.push("CSC240");
        }

        const resultCSC241 = await db.collection('users').findOne({
            $and: [
                { email: session.user.email },
                { "taken.core.CSC240": true },
                { "taken.mathematics.MAT151": true },
                { "taken.mathematics.MAT161": true }
            ]
        });

        if (resultCSC241) {
            completed.push("You have completed the prerequisites for CSC241");
        } else {
            incomplete.push("You can't take CSC241 because you haven't completed CSC240, MAT151, or MAT161");
            locked.push("CSC241");
        }

        const resultCSC345 = await db.collection('users').findOne({
            $and: [
                { email: session.user.email },
                { "taken.core.CSC220": true },
                { "taken.core.CSC241": true }
            ]
        });

        if (!resultCSC345) {
            locked.push("CSC345");
        }

        const resultCSC402 = await db.collection('users').findOne({
            $and: [
                { email: session.user.email },
                { "taken.core.CSC241": true }
            ]
        });

        if (!resultCSC402) {
            locked.push("CSC402");
        }

        const resultCSC417 = await db.collection('users').findOne({
            $and: [
                { email: session.user.email },
                { "taken.core.CSC241": true }
            ]
        });

        if (!resultCSC417) {
            locked.push("CSC417");
        }

        const resultCSC418 = await db.collection('users').findOne({
            $and: [
                { email: session.user.email },
                { "taken.core.CSC240": true }
            ]
        });

        if (!resultCSC418) {
            locked.push("CSC418");
        }

        const resultCSC466 = await db.collection('users').findOne({
            $and: [
                { email: session.user.email },
                { "taken.core.CSC241": true }
            ]
        });

        if (!resultCSC466) {
            locked.push("CSC466");
        }

        const resultCSC467 = await db.collection('users').findOne({
            $and: [
                { email: session.user.email },
                { "taken.core.CSC241": true }
            ]
        });

        if (!resultCSC467) {
            locked.push("CSC467");
        }

        const resultCSC468 = await db.collection('users').findOne({
            $and: [
                { email: session.user.email },
                { "taken.core.CSC231": true }
            ]
        });

        if (!resultCSC468) {
            locked.push("CSC468");
        }

        const resultCSC476 = await db.collection('users').findOne({
            $and: [
                { email: session.user.email },
                { "taken.core.CSC241": true }
            ]
        });

        if (!resultCSC476) {
            locked.push("CSC476");
        }

        const resultCSC416 = await db.collection('users').findOne({
            $and: [
                { email: session.user.email },
                { "taken.core.CSC220": true },
                { "taken.core.CSC240": true },
                { "taken.core.CSC241": true },
                { $or: [
                    { "taken.core.CSC231": true },
                    { "taken.core.CSC242": true }
                ]}
            ]
        });

        if (!resultCSC416) {
            locked.push("CSC416");
        }

        // --- Requirements ---
        const resultCoreReq = await db.collection('users').findOne({
            $and: [
                { email: session.user.email },
                { "taken.core.CSC141": true },
                { "taken.core.CSC142": true },
                { "taken.core.CSC220": true },
                { "taken.core.CSC231": true },
                { "taken.core.CSC240": true },
                { "taken.core.CSC241": true },
                { "taken.core.CSC301": true },
                { "taken.core.CSC345": true },
                { "taken.core.CSC402": true }
            ]
        });

        if (resultCoreReq) {
            requirement_satisfied.push("Core");
        }

        const resultLargeScaleReq = await db.collection('users').findOne({
            $and: [
                { email: session.user.email },
                { $or: [
                    { "taken.large_scale.CSC416": true },
                    { "taken.large_scale.CSC417": true },
                    { "taken.large_scale.CSC418": true },
                    { "taken.large_scale.CSC466": true },
                    { "taken.large_scale.CSC467": true },
                    { "taken.large_scale.CSC468": true },
                    { "taken.large_scale.CSC476": true },
                    { "taken.large_scale.CSC496": true }
                ]}
            ]
        });

        if (resultLargeScaleReq) {
            requirement_satisfied.push("Large Scale");
        }

        // Check Science Requirement
        const resultScienceReq = await db.collection('users').findOne({
            $and: [
                { email: session.user.email },
                { $or: [
                    // Check if the user has completed CHE103 and CRL103 together (one combined course)
                    { $and: [{ "taken.science.CHE103": true }, { "taken.science.CRL103": true }] },

                    // Check if the user has completed two other science courses
                    { $or: [
                        { "taken.science.BIO110": true },
                        { "taken.science.ESS101": true },
                        { "taken.science.PHY130": true },
                        { "taken.science.PHY170": true }
                    ]}
                ]}
            ]
        });

        if (resultScienceReq) {
            requirement_satisfied.push("Science");
        } else {
            incomplete.push("You haven't completed the Science requirements (CHE103 with CRL103 or two other science courses)");
        }

        // --- Math Requirement ---
        const resultMathReq = await db.collection('users').findOne({
            $and: [
                { email: session.user.email },
                { "taken.mathematics.MAT121": true },
                { "taken.mathematics.MAT151": true },
                { "taken.mathematics.MAT161": true },
                { $or: [
                    { "taken.mathematics.MAT162": true },
                    { "taken.mathematics.STA200": true }
                ]}
            ]
        });

        if (resultMathReq) {
            requirement_satisfied.push("Math");
        } else {
            incomplete.push("You haven't completed the Math requirements (MAT121, MAT151, MAT161, and either MAT162 or STA200)");
        }

        // --- Collect Completed Courses ---
        const categories = ["fye", "core", "communication", "mathematics", "science", "large_scale"];

        categories.forEach(category => {
            if (user.taken && user.taken[category]) {
                Object.keys(user.taken[category]).forEach(course => {
                    // If the course is marked as false, add it to the incomplete array
                    if (user.taken[category][course] === false) {
                        incomplete.push(course);  // Add the course ID to incomplete
                    } else if (user.taken[category][course] === true) {
                        completed.push(course);  // Add the course ID to completed
                    }
                });
            }
        });

        // Log arrays for debugging
        console.log("Locked courses:", locked);
        console.log("Completed course:", completed);
        console.log("Requirements that satisfied:", requirement_satisfied);

        // Return the results (completed and unmet prerequisites)
        return new Response(JSON.stringify({
            completed,
            incomplete,
            locked,
            requirement_satisfied
        }), { status: 200 });

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
