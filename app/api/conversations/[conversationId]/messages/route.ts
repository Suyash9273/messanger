import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db"
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ conversationId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if(!session?.user?.email) {
            return NextResponse.json({messages: []}, {status: 401});
        }

        //fetch message for this specefic convo:
        const messages = await db.message.findMany({
            where: {conversationId: (await params).conversationId},
            include: {sender: true},
            orderBy: {createdAt: "asc"}
        });

        return NextResponse.json(messages);
    } catch (error) {
        console.log("Error occured in api/convo/[convoId]/route.ts: ", error);
        return NextResponse.json({messages: []}, {status: 500});
    }
}