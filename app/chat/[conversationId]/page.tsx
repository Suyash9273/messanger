"use client"
import { useEffect, useState } from "react"
import { pusherClient } from "@/lib/pusher"
import { useParams } from "next/navigation";

export default function ChatWindow(
) {
    const { conversationId } = useParams<{ conversationId: string }>();
    const [messages, setMessages] = useState<any[]>([]);
    const [inputValue, setInputValue] = useState("");

    //1. Initial Load: Fetch Existing Messages
    useEffect(() => {
        const fetchMessages = async () => {
            const response = await fetch(`/api/conversations/${conversationId}/messages`);
            const data = await response.json();
            setMessages(data);
        }

        fetchMessages();
    }, [conversationId]);

    // 2. Real-Time: Subscribe To pusher channel
    useEffect(() => {
        //Join the "room" (channel) named after the conversation id
        pusherClient.subscribe(conversationId);

        //Listen for the "new-message" event we defined in our POST route earlier
        pusherClient.bind("new-message", (newMessage: any) => {
            setMessages((prev) => [...prev, newMessage]);
        });

        return () => {
            pusherClient.unsubscribe(conversationId);
            pusherClient.unbind("new-message");
        }
    }, [conversationId]);

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue) return;

        await fetch("/api/messages", {
            method: "POST",
            body: JSON.stringify({
                content: inputValue,
                conversationId: conversationId
            }),
            headers: { "Content-type": "application/json" }
        });

        setInputValue("");
    }

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* Message List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <div key={msg.id} className="flex flex-col">
                        <span className="text-xs text-gray-500">{msg.sender.name || msg.sender.email}</span>
                        <div className="bg-white p-2 rounded shadow-sm w-fit max-w-md text-black">
                            {msg.content}
                        </div>
                    </div>
                ))}
            </div>

            {/* Input Field */}
            <form onSubmit={sendMessage} className="p-4 bg-white border-t flex gap-2">
                <input
                    className="flex-1 p-2 border rounded text-black"
                    placeholder="Type a message..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded">Send</button>
            </form>
        </div>
    );
}