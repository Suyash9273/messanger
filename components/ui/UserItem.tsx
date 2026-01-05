"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

interface UserItemProps {
    user: any;
    isOnline?: boolean;
}

export default function UserItem({ user, isOnline }: UserItemProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async () => {
        setIsLoading(true);

        try {
            //1. Hit the API we made to find or make a convo 1to1
            const response = await fetch("/api/conversations", {
                method: "POST",
                body: JSON.stringify({userId: user.id}),
                headers: {"Content-Type": "application/json"}
            })

            const data = await response.json();
            router.push(`/chat/${data.id}`);
        } catch (error) {
            console.error("Failed to start convo, UserItem.tsx: ", error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div
            onClick={handleClick}
            className={`
        flex items-center gap-x-3 p-3 mb-1 mx-2 rounded-lg cursor-pointer transition 
        hover:bg-gray-100 ${isLoading ? "opacity-50 cursor-wait" : ""}
      `}>

            <div
                className="relative inline-block rounded-full overflow-hidden h-11 w-11 bg-blue-600 flex items-center justify-center text-white font-bold"
            >
                <div className="h-11 w-11 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
          {user.name?.[0] || user.email[0].toUpperCase()}
        </div>

        {/* The Status Dot */}
        <span 
          className={`
            absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white
            ${isOnline ? 'bg-green-500' : 'bg-gray-400'}
          `} 
        />
            </div>

            <div className="min-w-0 flex-1">
                <div className="focus:outline-none">
                    <p className="text-sm font-medium text-gray-900">
                        {user.name || user.email}
                    </p>

                    <p className="text-xs text-gray-500 truncate">
                        Click to start chatting
                    </p>
                </div>
            </div>

        </div>
    )
}