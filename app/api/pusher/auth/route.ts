import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        //1. Verify Authentication
        if(!session?.user.email) {
            return NextResponse.json({message: "Unauthorized"}, {status: 401});
        }

        //2. Parse the request body (Pusher sends socked-id and channel name)
        const body = await request.formData();
        console.log("This is body: (pusher/auth): ", body);

        const socketId = body.get("socket_id") as string;
        const channel = body.get("channel_name") as string;

        //3. User Data for presence
        // This data is sent to other users in the channel (Online Status)...
        const presenceData = {
            user_id: session.user.id,
            userInfo: {
                name: session.user.name,
                email: session.user.email,
            }
        };

        //4. Authorize the channel
        const authResponse = pusherServer.authorizeChannel(socketId, channel, presenceData);
        console.log("Auth Response: ", authResponse);

        return NextResponse.json(authResponse, {status: 200});
    } catch (error) {
        console.log("Internal Server Error:-> ", error);
        return NextResponse.json({message: "Internal Server Error"}, {status: 500});
    }
}