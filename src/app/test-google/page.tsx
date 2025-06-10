"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TestGoogleAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleGoogleTest = async () => {
    setLoading(true);
    try {
      console.log("🚀 Starting Google auth test...");

      const result = await signIn("google", {
        redirect: false,
      });

      console.log("📄 SignIn result:", result);

      if (result?.ok && !result?.error) {
        console.log("✅ Google auth successful!");
        // Force refresh session
        window.location.reload();
      } else {
        console.error("❌ Google auth failed:", result?.error);
      }
    } catch (error) {
      console.error("💥 Error during Google auth:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    window.location.reload();
  };

  if (status === "loading") {
    return <div className="p-8">Loading session...</div>;
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Google Auth Debug Test</h1>

        <div className="mb-6 p-4 bg-gray-100 rounded">
          <h2 className="font-semibold mb-2">Session Status: {status}</h2>
          {session ? (
            <div className="space-y-2">
              <p>
                <strong>Email:</strong> {session.user?.email}
              </p>
              <p>
                <strong>Name:</strong> {session.user?.name}
              </p>
              <p>
                <strong>Role:</strong> {session.user?.role}
              </p>
              <p>
                <strong>Is New User:</strong> {session.isNewUser ? "Yes" : "No"}
              </p>
              <p>
                <strong>Profile Complete:</strong>{" "}
                {session.isProfileComplete ? "Yes" : "No"}
              </p>
              <p>
                <strong>Backend Token:</strong>{" "}
                {session.backendToken ? "Present" : "Missing"}
              </p>
            </div>
          ) : (
            <p>No session found</p>
          )}
        </div>

        <div className="space-y-4">
          {session ? (
            <div className="space-y-2">
              <button
                onClick={() => router.push("/dashboard")}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => router.push("/login/complete-profile")}
                className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
              >
                Go to Complete Profile
              </button>
              <button
                onClick={handleSignOut}
                className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={handleGoogleTest}
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? "Processing..." : "Test Google Sign In"}
            </button>
          )}
        </div>        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h3 className="font-semibold mb-2">Debug Instructions:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Click &quot;Test Google Sign In&quot;</li>
            <li>Check browser console for detailed logs</li>
            <li>If successful, you&apos;ll see session data above</li>
            <li>Test navigation to dashboard/profile</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
