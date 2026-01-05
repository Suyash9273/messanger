"use client"
import { useEffect, useState } from "react"
import { pusherClient } from "@/lib/pusher";
import UserItem from "./UserItem"

export default function Sidebar() {
    const [users, setUsers] = useState([]);
    const [activeUserIds, setActiveUserIds] = useState<string[]>([]);// tracking online users
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch("/api/users");
                const data = await response.json();

                setUsers(data);
            } catch (error) {
                console.log("Failed to fetchUsers: sidebar.tsx: ", error);
            } finally {
                setLoading(false);
            }
        }

        fetchUsers();
    }, [])

    useEffect(() => {
      //1. Subscribe to the presence channel
      const channel = pusherClient.subscribe('presence-messenger');

      //2. Initial Load: Get everyone already online
      channel.bind('pusher:subscription_succeeded', (members: any) => {
        const initialIds: string[] = [];
        members.each((member: any) => initialIds.push(member.id));
        setActiveUserIds(initialIds);
      });

      //3. Member Joins: Add their ids to array
      channel.bind('pusher:member_added', (member: any) => {
        setActiveUserIds((prev) => [...prev, member.id])
      })

      // 4. Member Leaves: Remove their id from the array
      channel.bind('pusher:member_removed', (member: any) => {
        setActiveUserIds((prev) => prev.filter((id) => id !== member.id))
      });

      return () => {
        pusherClient.unsubscribe('presence-messenger');
      }

    }, []);

    return (
    <aside className="w-80 border-r border-gray-200 h-screen flex flex-col bg-white">
      <div className="px-5 py-4 border-b">
        <h2 className="text-2xl font-bold text-gray-800">Messages</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        { loading ? (
          <p className="p-4 text-gray-500">Loading users...</p>
        ) : (
          users.map((user: any) => (
            <UserItem 
            key={user.id}
            user={user}
            isOnline={activeUserIds.includes(user.id)} />
          ))
        )}
      </div>
    </aside>
  );
}
