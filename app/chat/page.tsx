"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import LogoutButton from "../../components/logout"

export default function ChatPage() {
    const {data: session, status} = useSession();
    const router = useRouter();

    useEffect(() => {
        if(status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    if(status === "loading") return <p>Loading...</p>

    return (
        <div>
            <div className="p-10">
      <h1 className="text-2xl font-bold">Chat Room</h1>
      <p>Welcome back, <span className="text-blue-600">{session?.user?.email}</span></p>
      
      {/* Visual proof that you have a "Strong Foundation" session */}
      <div className="mt-4 p-4 bg-gray-100 rounded">
        My Session ID: {session?.user?.id}
      </div>
    </div>
        
        <div>
            <LogoutButton />
        </div>
        </div>
    )
}