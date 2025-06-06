"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect } from "react";

export default function TestAuth() {
  const { data: session, status } = useSession();

  useEffect(() => {
    console.log("Session status:", status);
    console.log("Session data:", session);
  }, [session, status]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Auth Test Page</h1>

        {session ? (
          <div className="text-center">
            <div className="mb-4">
              <img
                src={session.user?.image || "/default-avatar.png"}
                alt="Profile"
                className="w-16 h-16 rounded-full mx-auto mb-2"
              />
              <h2 className="text-xl font-semibold">{session.user?.name}</h2>
              <p className="text-gray-600">{session.user?.email}</p>
            </div>
            <button
              onClick={() => signOut()}
              className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="text-center">
            <p className="mb-4">You are not signed in</p>
            <div className="space-y-2">
              <button
                onClick={() => signIn("google")}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
              >
                Sign in with Google
              </button>
              <button
                onClick={() => signIn()}
                className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors"
              >
                Sign in (Default)
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h3 className="font-semibold mb-2">Debug Info:</h3>
          <pre className="text-xs overflow-auto">
            {JSON.stringify({ status, session }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
