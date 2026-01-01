"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  const handleLogout = async () => {
    // This clears the cookie and session data automatically
    await signOut({ 
      callbackUrl: "/login" // Where to send the user after logging out
    });
  };

  return (
    <button 
      onClick={handleLogout}
      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
    >
      Logout
    </button>
  );
}