import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db"

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const body = await request.json();
        const { userId } = body;// the ID of the user you want to chat with

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        //Get the currently logged in user's id: 
        const currentUser = await db.user.findUnique({
            where: { email: session.user.email }
        });

        if (!currentUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        //1. Check if a 1 on 1 convo already exists 
        const existingConversations = await db.conversation.findMany({
            where: {
                isGroup: false,
                AND: [
                    { participants: { some: { userId: currentUser.id } } },
                    { participants: { some: { userId: userId } } }
                ]
            },
            include: {
                participants: {
                    include: {
                        user: true // Helpful for showing names/avatars later
                    }
                }
            }
        });

        // 2. If no convo exists create a new one
        const newConversation = await db.conversation.create({
            data: {
                participants: {
                    create: [
                        { userId: currentUser.id },
                        { userId: userId }
                    ]
                }
            }
        });

        return NextResponse.json(newConversation, { status: 404 });

    } catch (error) {
        console.log("Error in api/conversations:(POST) -> ", error);
        return NextResponse.json({message: "Internal Server Error"}, {status: 500});
    }
}