"use client"
import { useEffect, useState } from "react"
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

    console.log("RENDER users:", users, Array.isArray(users));

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
            <UserItem key={user.id} user={user} />
          ))
        )}
      </div>
    </aside>
  );
}
