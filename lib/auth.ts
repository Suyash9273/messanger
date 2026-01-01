import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import  db  from "./db";
import bcrypt from "bcrypt";
import { UserRole } from "@prisma/client";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                name: {label: "Name", type: "text"},
                email: {label: "Email", type: "text"},
                password: {label: "Password", type: "password"}
            },
            async authorize(credentials) {
                if(!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid credentials");
                }

                try {
                    //Find user in our docker db
                    const user = await db.user.findUnique({
                        where: {email: credentials.email}
                    });

                    if(!user) {
                        throw new Error("User does not exist");
                    }

                    if(!user.password) {
                        throw new Error("Invalid credentials");
                    }

                    const isCorrectPassword = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );

                    if(!isCorrectPassword) {
                        throw new Error("Invalid credentials");
                    }
                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role
                    }

                } catch (error) {
                    throw new Error(`Something went wrong ${error}`);
                }
            }
            
        })
    ],
    callbacks: {
        async jwt({token, user}) {
            if(user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({session, token}) {
            session.user.id = token.id as string;
            session.user.role = token.role as UserRole;
            return session;
        }
    },
    session: {
        strategy: 'jwt',
        maxAge: 30*24*60*60
    },
    secret: process.env.NEXTAUTH_SECRET
}