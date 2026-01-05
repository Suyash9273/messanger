"use client"

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const {data: session, status} = useSession();
  const router = useRouter();

  useEffect(() => {
    if(status === "unauthenticated") {
      router.push("/login");
    }

    if(status === "authenticated") {
      router.push("/chat");
    }
  }, [status, router])

  if(status === "loading") return <p>Loading...</p>

  return (
    <div>

    </div>
  );
}

{/**
  To make this a "Top 1%" portfolio project, consider these additions:

1. Image & File Sharing
Don't store images in your PostgreSQL. Use Cloudinary or UploadThing.

Endpoint: POST /api/upload — Returns a URL of the hosted image to save in your Message content.

2. "Seen" Receipts (Read Status)
This is a classic feature.

Endpoint: PATCH /api/conversations/[conversationId]/seen — Updates the lastReadMessageId in your ConversationParticipant model.

Pusher Event: Trigger an event so the other user sees the "✓✓" turn blue in real-time.

3. Search Messages
Recruiters love seeing that you know how to query data efficiently.

Endpoint: GET /api/search?q=keyword — Uses Prisma's contains filter to find specific messages across all chats.

4. Group Chat Management
Since your schema already supports isGroup, add the UI to create them.

Endpoint: POST /api/groups — Create a conversation with more than 2 participants.

Endpoint: PATCH /api/groups/[id]/add — Let an ADMIN add new members.

Endpoint	Method	Purpose
/api/friends/add	POST	Creates a follow/friend relationship between two IDs.
/api/friends/list	GET	Fetches only people you are friends with for the Sidebar.
/api/messages/[messageId]	DELETE	Implements "Delete for Everyone" (updates deletedAt in DB).
/api/pusher/auth	POST	Crucial: Authorizes the browser to join Presence/Private channels.
  */}
