import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import mongoose from "mongoose";  // Import mongoose to access db

export async function POST(request) {

    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
        return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    // Connect to MongoDB
    console.log("Connecting to MongoDB...");
    await connectMongoDB();

    try {
        
        const { greenNodes } = await request.json();

    
        if (!greenNodes || greenNodes.length === 0) {
            return NextResponse.json({ error: "No courses selected" }, { status: 400 });
        }

        // Define the initial structure
        const initialTaken = {
            fye: { "FYE100": false },
            core: {
                "CSC141": false,
                "CSC142": false,
                "CSC220": false,
                "CSC231": false,
                "CSC240": false,
                "CSC241": false,
                "CSC301": false,
                "CSC345": false,
                "CSC402": false,
            },
            communication: {
                "ENG368": false,
                "ENG371": false,
                "SPK208": false,
                "SPK230": false,
                "SPK199": false,
            },
            mathematics: {
                "MAT121": false,
                "MAT151": false,
                "MAT161": false,
                "MAT162": false,
                "STA200": false,
            },
            science: {
                "BIO110": false,
                "CHE103": false,
                "CRL103": false,
                "ESS101": false,
                "PHY130": false,
                "PHY170": false,
            },
            large_scale: {
                "CSC416": false,
                "CSC417": false,
                "CSC418": false,
                "CSC466": false,
                "CSC467": false,
                "CSC468": false,
                "CSC476": false,
                "CSC496": false,
            },
        };

        // Mapping for topics to course groupings
        const courseGroupMapping = {
            fye: ["FYE100"],
            core: [
                "CSC141",
                "CSC142",
                "CSC220",
                "CSC231",
                "CSC240",
                "CSC241",
                "CSC301",
                "CSC345",
                "CSC402",
            ],
            communication: [
                "ENG368",
                "ENG371",
                "SPK208",
                "SPK230",
                "SPK199",
            ],
            mathematics: [
                "MAT121",
                "MAT151",
                "MAT161",
                "MAT162",
                "STA200",
            ],
            science: [
                "BIO110",
                "CHE103",
                "CRL103",
                "ESS101",
                "PHY130",
                "PHY170",
            ],
            large_scale: [
                "CSC416",
                "CSC417",
                "CSC418",
                "CSC466",
                "CSC467",
                "CSC468",
                "CSC476",
                "CSC496",
            ],
        };


        const updatedTaken = { ...initialTaken };

        greenNodes.forEach((node) => {
            // Find the corresponding course category (e.g., "core", "math") for each node
            for (const [category, courses] of Object.entries(courseGroupMapping)) {
                if (courses.includes(node)) {
                    updatedTaken[category][node] = true; // Mark the course as taken
                    break;
                }
            }
        });

       
        const db = mongoose.connection.db;

        // Find the user in the "users" collection using their email
        const user = await db.collection('users').findOne({ email: session.user.email });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Update the user document with the new "taken" structure
        await db.collection('users').updateOne(
            { email: session.user.email },
            { $set: { taken: updatedTaken } }  
        );

        return NextResponse.json({ message: "Courses successfully updated!" });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to store the selected courses" }, { status: 500 });
    }
}
