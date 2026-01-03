import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";
import { pusherServer } from "@/lib/pusher";

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const body = await request.json();
        const {content, conversationId} = body;

        if(!session?.user?.email) {
            return NextResponse.json({message: "Unauthorized"}, {status: 401});
        }

        const currentUser = await db.user.findUnique({
            where: {email: session.user.email}
        });
        
        if(!currentUser) {
            return NextResponse.json({message: "User does not exist"}, {status: 404})
        }

        // Save our message to db(docker postgresql)
        const newMessage = await db.message.create({
            data: {
                content,
                conversationId,
                senderId: currentUser.id
            },
            include: {
                sender: true
            }
        });

        //Now trigger the pusher(real time broadcast)
        //Channel: Our conversation Id
        //Event: "new-message"

        await pusherServer.trigger(conversationId, "new-message", newMessage);

        return NextResponse.json(newMessage);
    } catch (error) {
        console.log("Message Post err: /api/messages/route.ts: ", error);
        return NextResponse.json({message: "Internal server error"}, {status: 500})
    }
}