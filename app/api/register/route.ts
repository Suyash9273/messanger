import bcrypt from "bcrypt"
import db from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {email, name, password} = body;

        if(!email || !password) {
            return NextResponse.json({error: "Missing Data..."}, {status: 404});
        }

        const userExists = await db.user.findUnique({
            where: {email}
        });

        if(userExists) {
            return NextResponse.json({error: "User already exists"}, {status: 400})
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await db.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
            }
        });

        return NextResponse.json(user);

    } catch (error) {
        console.log("Registration Error: =>", error);
        return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
}