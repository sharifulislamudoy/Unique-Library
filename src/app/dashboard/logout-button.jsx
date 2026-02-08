"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
    >
      Logout
    </button>
  );
}
