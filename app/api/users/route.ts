import { NextResponse } from "next/server";
import db from "@/lib/db"
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        //Get current session to know who is logged in 
        const session = await getServerSession(authOptions);
        
        if(!session?.user?.email) {
            return NextResponse.json({users: []}, {status: 401});
        }

        //2. Fetch all users except the current logged in user
        // We don't want the user to start a 1 on 1 chat with themselves:

        const users = await db.user.findMany({
            where: {
                NOT: {
                    email: session.user.email
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                name: true,
                email: true,
            }
        });
        return NextResponse.json(users, {status: 200});
    } catch (error) {
        console.log("Error occured: /api/users: ", error);
        return NextResponse.json({users: []}, {status: 500});
    }
}